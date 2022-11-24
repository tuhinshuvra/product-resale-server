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
        const usersCollections = client.db('resaleMarket').collection('users');

        // All Categories
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = productCategoriesCollections.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

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

        // All Users
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = usersCollections.find(query);
            const users = await cursor.toArray();
            res.send(users);
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