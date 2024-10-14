const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

app.use('/', express.static('public'));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/personal_budget')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    value: { type: Number, required: true },
    color: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^#[0-9A-Fa-f]{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid hexadecimal color!`
        }
    }
});

const Budget = mongoose.model('Budget', budgetSchema);

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget-data', async (req, res) => {
    try {
        const budgetData = await Budget.find();
        res.json({ myBudget: budgetData });
    } catch (error) {
        console.error('Error fetching budget data:', error);
        res.status(500).send('Server Error');
    }
});

app.post('/budget', async (req, res) => {
    console.log('Received body:', req.body);
    try {
        const newBudget = new Budget(req.body);
        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        console.error('Error details:', error);
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});