const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');

const dbConnect = require('./utils/dbConnect');
// const verifyJWT = require('./utils/jwtToken');
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const categoryRoutes = require("./route/v1/categories.route");

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

// customization start from here
dbConnect();
// verifyJWT();
app.use('/api/v1/categories', categoryRoutes);

async function run() {
    try {
    }
    finally {
    }
}
run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send('Resale Market Server is running ...............')
})

app.all('*', (req, res) => {
    res.send("No routes found");
})

app.listen(port, () => {
    console.log('The Easy Resale Market Server is running on port: ', port);
})