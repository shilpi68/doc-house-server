const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nksmhfq.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    const cardCollection = client.db("docHouseBD").collection("card");
    const reviewCollection = client.db("docHouseBD").collection("reviews");
    const  docterCollection = client.db("docHouseBD").collection(" docters");


    app.get('/card',async(req,res)=>{
        const result = await cardCollection.find().toArray()
        res.send(result)
    })
    app.get('/reviews',async(req,res)=>{
        const result = await reviewCollection.find().toArray()
        res.send(result)
    })
  // docter collecrtion
app.get('/docters',async(req,res)=>{
  const email = req.query.email;
  const query = {email:email}
  const result = await docterCollection.find(query).toArray();
  res.send(result)
})

  app.post('/docters', async(req,res)=>{
    const docterItem = req.body;
    const result = await docterCollection.insertOne(docterItem);
    res.send(result);
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get ('/',(req,res) =>{
    res.send('Doc House Runing')
})

app.listen(port,() =>{
    console.log(`Doc House is running on port ${port}`)
})