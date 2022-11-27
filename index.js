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


function verifyJWT(req, res, next) {
    // console.log('Token inside VerifyJWT', req.headers.authorization);
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).send('Un authorized Access.')
    }
    const token = authheader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded;
        next();
    })

}


async function run() {
    try {
        const productCategoriesCollections = client.db('resaleMarket').collection('categories');
        const productCollections = client.db('resaleMarket').collection('products');
        const userCollections = client.db('resaleMarket').collection('users');
        const orderCollections = client.db('resaleMarket').collection('orders');
        const paymentCollections = client.db('resaleMarket').collection('payments');


        // Note: VerifyAdmin always be after verifyJWT
        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await userCollections.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'Forbidden Access you are not admin' })
            }
            next();
        }

        // Note: VerifyAdmin always be after verifyJWT
        const verifySeller = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await userCollections.findOne(query);

            if (user?.userType !== 'seller') {
                return res.status(403).send({ message: 'Forbidden Access, you are not a seller' })
            }
            next();
        }


        //************** */ Category Related all Query  ********************

        // Add New Category
        app.post('/categories', async (req, res) => {
            const category = req.body;
            const result = await productCategoriesCollections.insertOne(category);
            res.send(result);
        })

        // Show All Category
        app.get('/categories', async (req, res) => {
            const query = {}
            const cursor = productCategoriesCollections.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

        // Show a category by id
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const category = await productCategoriesCollections.findOne(query);
            res.send(category);
        })

        // Update a Category
        app.put('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const category = req.body;
            const option = { upsert: true };
            const updatedCategory = {
                $set: {
                    title: category.title,
                    description: category.description,
                }
            }
            const result = await productCategoriesCollections.updateOne(filter, updatedCategory, option)
            res.send(result);
        })

        // Delete a Category
        app.delete('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCategoriesCollections.deleteOne(filter);
            res.send(result);
        })

        //************** */ Product Related all Query  ********************

        // Add New Products
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollections.insertOne(product);
            res.send(result);
        })

        //Show All Products
        app.get('/allProducts', async (req, res) => {
            const query = {}
            const cursor = productCollections.find(query);
            const allProducts = await cursor.toArray();
            res.send(allProducts);
        })

        // Show a product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollections.findOne(query);
            res.send(product);
        })

        // show all products by seller email
        app.get('/productOnMail', async (req, res) => {

            const decoded = req.decoded;
            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'Forbidden Access' })
            // }

            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = productCollections.find(query)
            const productOnMail = await cursor.toArray();
            res.send(productOnMail);
        })

        // Update a Product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const product = req.body;
            const option = { upsert: true };
            const updatedProduct = {
                $set: {
                    title: product.title,
                    // price: product.price,
                    // originalPrice: product.originalPrice,
                    description: product.description,
                    // yearOfUse: product.yearOfUse,
                    // location: product.location,
                    phone: product.phone,
                }
            }
            const result = await productCollections.updateOne(filter, updatedProduct, option)
            res.send(result);
        })

        // Delete a product
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollections.deleteOne(filter);
            res.send(result);
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

        //************** */ Orders Related all Query  ********************

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const orders = await orderCollections.find(query).toArray();
            res.send(orders);
        })


        //************** */ User Related all Query  ********************

        // Save Users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);
        })

        // Show All Users
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
                    role: 'admin',
                }
            }
            const options = { upsert: true };
            const result = await userCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // User verification
        app.put('/users/verification/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    verification: 'verified',
                }
            }
            const options = { upsert: true };
            const result = await userCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // check admin users
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        // check verified users
        app.get('/users/verification/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isVerified: user?.verification === 'verified' });
        })

        // check seller users
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await userCollections.findOne(query);
            res.send({ isSeller: user?.userType === 'seller' });
        })

        // Delete User
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await userCollections.deleteOne(filter);
            res.send(result);
        })

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollections.findOne(query)
            // console.log(user);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })

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
    console.log('The Easy Resale Market Server is running on port: ', port);
})