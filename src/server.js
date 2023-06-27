const express = require('express')
const app = express()
const route = require('./routes/route')
const bodyParser = require('body-parser')

const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 8080


const db = require('./config/db/mongoose')
db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

route(app)

app.listen(PORT, () => {
    console.log(`app is listening in port: ${PORT}`)
})
