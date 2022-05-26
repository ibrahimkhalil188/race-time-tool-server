const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.grh7i.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect()
        const productCollection = client.db("RaceTimeTools").collection("products");
        const userCollection = client.db("RaceTimeTools").collection("users");
        const orderCollection = client.db("RaceTimeTools").collection("orders");


        app.get("/products", async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.patch("/products/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const quantity = req.body
            const options = { upsert: true };
            const doc = {
                $set: {
                    quantity: quantity.quantity
                }
            }
            const result = await productCollection.updateOne(filter, doc, options)
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
                $set: user
            }
            const result = await userCollection.updateOne(filter, doc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
            res.send({ result, token })
        })

        app.get("/order/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.findOne(query)
            res.send(result)
        })


        app.get("/order", async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            console.log(query)
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })


        app.post("/order", async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })


        app.delete("/order/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
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