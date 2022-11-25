const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { query } = require('express');
require('dotenv').config();
var jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7apvnd5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const productCategoriesCollections = client.db('resaleMarket').collection('categories');
        const productCollections = client.db('resaleMarket').collection('products');
        const userCollections = client.db('resaleMarket').collection('users');

        // Add New Category
        app.post('/categories', async (req, res) => {
            const category = req.body;
            const result = await productCategoriesCollections.insertOne(category);
            res.send(result);
        })

        // Add New Products
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollections.insertOne(product);
            res.send(result);
        })

        // All Categories
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = productCategoriesCollections.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })


        // All Products
        app.get('/allProducts', async (req, res) => {
            const query = {}
            const cursor = productCollections.find(query);
            const allProducts = await cursor.toArray();
            res.send(allProducts);
        })

        // Products by category
        app.get('/products', async (req, res) => {
            let query = {};
            if (req.query.category) {
                query = {
                    category: req.query.category
                }
            }
            const cursor = productCollections.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // Save Users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);
        })

        // Display All Users
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        // User make admin
        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const options = { upsert: true };
            const result = await userCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // Delete User by id
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollections.deleteOne(filter);
            res.send(result);
        })
    }
    finally {

    }
}
run().catch(error => console.log(error))






app.get('/', (req, res) => {
    res.send('Resale Market Server is running ...............')
})

app.listen(port, () => {
    console.log('The Reasale Market Server is running on port: ', port);
})