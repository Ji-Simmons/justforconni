require('dotenv').config();
const express = require('express'),
    cors = require ('cors'),
    bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../build`));

app.listen(PORT, ()=>{console.log(`Running on Port ${PORT}`)});