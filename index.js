const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.euq4zn2.mongodb.net/?retryWrites=true&w=majority`;

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

        const artCollection = client.db('artDB').collection('art');
        const artNewCollection = client.db('artDB').collection('craft');

        app.post('/newItem', async (req, res) => {
            const newItem = req.body;
            const result = await artCollection.insertOne(newItem);
            res.send(result)
        })

        app.get('/newItem', async (req, res) => {
            const cursor = artCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // newHome
        app.get('/allItem', async (req, res) => {
            const cursor = artNewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/artItem/:subcategory_Name', async (req, res) => {
            const subcategory_Name = req.params.subcategory_Name;
            const query = { subcategory_Name: (subcategory_Name) }
            const matchingArt = await artCollection.find(query).toArray();
            res.send(matchingArt);
        })

        // newHomeEnd

        app.get('/artItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const singleArt = await artCollection.findOne(query)
            res.send(singleArt);
        })

        app.get("/myArt/:email", async (req, res) => {
            const result = await artCollection.find({
                user_email: req.params.email
            }).toArray();
            res.send(result)
        })

        app.delete('/artItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const deletedArt = await artCollection.deleteOne(query)
            res.send(deletedArt);
        })

        app.put('/newItem/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateArt = req.body;
            const upArt = {
                $set: {
                    item_name: updateArt.item_name,
                    subcategory_Name: updateArt.subcategory_Name,
                    short_description: updateArt.short_description,
                    price: updateArt.price,
                    rating: updateArt.rating,
                    customization_example: updateArt.customization_example, processing_time: updateArt.processing_time,
                    stock_status: updateArt.stock_status,
                    image_url: updateArt.image_url
                }
            }
            const result = await artCollection.updateOne(filter, upArt, options)
            res.send(result);
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




app.get('/', (req, res) => {
    res.send("added server")
})

app.listen(port, () => {
    console.log(`Art server running on port: ${port}`);
})
