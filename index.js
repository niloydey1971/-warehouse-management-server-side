const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 4000;

// Database connection

const uri = "mongodb+srv://carmoto22:UEaKVilSCO00iQGO@cluster0.2asyc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {


    try {

        await client.connect();
        const database = client.db('carmoto').collection('carmotoinventory');

        // get data from mongo db
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = database.find(query)
            const db = await cursor.toArray()
            res.send(db)
        })

        // get data by  Query..........
        app.get('/myproduct', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = database.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get data via params
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const cursor = database.find(query)
            const db = await cursor.toArray()
            res.send(db)
        })


        // post data to Mongo DB
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await database.insertOne(product)
            res.send({ ack: "product added to server" })
        })

        // delete
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const result = await database.deleteOne(query)
            res.send(result)
        })

        // Update
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id
            const updated = req.body
            const filter = { _id: objectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {

                    sold: updated.delivered,
                    quantity: updated.quantity
                }
            }
            const result = await database.updateOne(filter, updatedDoc, options)
            res.send(result)

        })



    } finally {
        
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running my Server!")
})

app.listen(port, () => {
    console.log("Listening port 4000")
})