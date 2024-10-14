const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// MongoDB connection string
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("personal_budget");
        const collection = database.collection("budget_data");
        
        const budgetData = await collection.find({}).toArray();
        
        res.json({ myBudget: budgetData });
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});