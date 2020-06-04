const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')

require('dotenv').config()

const app = express()
const routes = require('./routes/api')

//Database connection
const PORT = process.env.PORT || 8080
const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
	console.log('Mongoose is connected')
})

//Data parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Routes logs in console
app.use(morgan('tiny'))
//Use router
app.use('/', routes)


//Start server
app.listen(PORT, console.log(`Server listening on ${PORT}`))