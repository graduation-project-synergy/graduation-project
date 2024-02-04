const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const serverPort = 5000;
const client = require('./config/db.js');
const { connectToDB } = require('./db.js');
const { findPathAsync } = require('./pathFinder.js');

// DB 연결
connectToDB();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(express.json());

app.post('/findPathServer', async (req, res) => {
    try {
        const request = req.body;
        const result = await findPathAsync(request);
        res.json(result);
    } catch (error) {
        console.error('Error during POST request:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
