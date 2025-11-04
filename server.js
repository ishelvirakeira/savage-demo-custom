// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

// MongoDB connection string
const url = "mongodb+srv://ishelvirakeira_db_user:QjtwX7dDGqX9Ivk9@cluster0.vnt1rh6.mongodb.net/?appName=Cluster0";
const dbName = "demo";

let db;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB and start server
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) throw error;

    db = client.db(dbName);
    console.log(`Connected to database "${dbName}"`);

    app.listen(2000, () => {
        console.log('Server running on port 2000');
    });
});

// -----------------------------
// ROUTES
// -----------------------------

// READ - show all recipes
app.get('/', (req, res) => {
    db.collection('recipes').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index.ejs', { recipes: result });
    });
});

// CREATE - add a new recipe
app.post('/recipes', (req, res) => {
    db.collection('recipes').insertOne({
        title: req.body.title,
        ingredients: req.body.ingredients.split(','),
        instructions: req.body.instructions,
        likes: 0
    }, (err, result) => {
        if (err) return console.log(err);
        console.log('Recipe saved to database');
        res.redirect('/');
    });
});

// UPDATE - increment likes
app.put('/recipes', (req, res) => {
    db.collection('recipes')
    .findOneAndUpdate(
        { title: req.body.title },       // find recipe by title
        { $inc: { likes: 1 } },          // increment likes by 1
        { returnDocument: 'after' }      // return updated document
    )
    .then(result => {
        if (!result.value) {
            return res.json({ error: 'Recipe not found' });
        }
        res.json(result.value);          // return updated recipe
    })
    .catch(err => res.json({ error: err }));
});

// DELETE - remove recipe by title
app.delete('/recipes', (req, res) => {
    db.collection('recipes').findOneAndDelete({ title: req.body.title }, (err, result) => {
        if (err) return res.send(500, err);
        if (!result.value) {
            return res.json('No recipe to delete');
        }
        res.json('Recipe deleted!');
    });
});
