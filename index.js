const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.grh7i.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect()
        const productCollection = client.db("RaceTimeTools").collection("products");
        const userCollection = client.db("RaceTimeTools").collection("users");

        app.get("/products", async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id
            const query = ObjectId(id)
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const user = req.body
            const options = { upsert: true };
            const doc = {
                $set: {
                    user
                }
            }
            const result = await userCollection.updateOne(filter, doc, options)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("RaceTimeTOols")
})

app.listen(port, () => {
    console.log("RaceTimeTools", port)
})