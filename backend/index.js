const express = require('express')
const {Connection} = require('./database/db')
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
Connection();

app.listen(3000,()=>console.log('listening on port 3000'));