const express = require('express');
const app = express();

const {db} = require('./db/db');
const {readdirSync} = require('fs');
const cors = require('cors');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000'
  }));

require('dotenv').config() 

const PORT = 4000;


// express middlewares.

readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));
// routing folder to transaction.js using map function 

app.use(cors())


app.get('/', (req, res) => {
    db();
    res.send('Hello World by sameer');
})



app.listen(PORT, ()=> {
    console.log("You're listening on PORT", PORT);
});