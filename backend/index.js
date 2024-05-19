const express = require('express')
const {ConnectionToDB} = require('./database/db')
const bodyParser = require('body-parser');
const rootRouter = require('./routes/index')
const cors = require('cors')

const app = express();

ConnectionToDB(); //function to connect to database

app.use(cors())
app.use(bodyParser.json());
app.use('/api/v1',rootRouter);




app.listen(3000,()=>console.log('listening on port 3000'));