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
    // const bookingCollection = database.collection('')
    //get all products api
    app.get("/products", async (req, res) => {
      const result = await productsCollection.find({}).toArray();

      res.send(result)
    })
    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);

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
