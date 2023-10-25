const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eugvbbj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const brandsCollection = client.db('brandsDB').collection('brands')
    const cartCollection = client.db('brandsDB').collection('cart')
    

    app.get('/brands', async(req, res) =>{
      const cursor = brandsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/brands/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const user = await brandsCollection.findOne(query)
      res.send(user)
    })

    app.get('/cart', async(req,res)=>{
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
    })

    app.post('/cart', async(req,res)=> {
      const newCartItem = req.body;
      const result = await cartCollection.insertOne(newCartItem)
      res.send(result)
      console.log(result)
    })

    app.post('/brands', async(req, res) =>{
      const newBrand = req.body
      console.log(newBrand)
      const result = await brandsCollection.insertOne(newBrand)
      res.send(result)
  })

  app.put('/brands/:id', async(req, res) =>{
    const id = req.params.id
    const updateProduct = req.body
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true}
    const product = {
      $set: {
        photo: updateProduct.photo,
        name: updateProduct.name,
        brand: updateProduct.brand,
        type: updateProduct.type,
        price: updateProduct.price,
        rating: updateProduct.rating
      }
    }
    const result = await brandsCollection.updateOne(filter, product, options)
    res.send(result)
  })

  app.delete('/cart/:id', async(req,res) => {
    const id = req.params.id;
    const query = {_id : new ObjectId(id)};
    const result = await cartCollection.deleteOne(query)
    res.send(result)
    
  })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('my server is running')
})

app.listen(port,()=>{
    console.log(`brand server is running on port:${port}`)
})