const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log("connection success...")
    const database = client.db("BestMart+");
    const productsCollection = database.collection('products');
    const ordersCollection = database.collection('orders')

    //get all products api
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();

      res.send(result)
    })

    //get product by id
    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);

      res.send(result);
    })

    // get products by category
    app.get("/products/:category", async (req, res) =>{
      const {category} = req.params;
      console.log(req.params);
      const query = {category: category};
      const result = await productsCollection.find(query).toArray();

      res.send(result)
    })

    // inset order information post api
    app.post("/order", async (req, res) =>{
      const orderInfo = req.body
      const result = await ordersCollection.insertOne(orderInfo);

      res.send(result);
    })

  } finally {

  }
}
run().catch(console.dir())

app.get('/', (req, res) => {
  res.send('Best Mart+')
})

app.listen(port, () => {
  console.log(`Best mart server${port}`)
})
