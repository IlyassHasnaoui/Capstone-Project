const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());


app.use(express.json());

//saved results
const savedResults = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//save results
app.post('/save', (req, res) => {
    const newResult = req.body;
    savedResults.push(newResult);
    res.status(201).send('Result saved successfully');
});

//get data
app.get('/saved', (req, res) => {
    res.json(savedResults);
});

app.listen(port, () => {
    console.log(`Server is running on port 3000`);
});
