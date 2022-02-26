require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const router = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(morgan('tiny'))
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose
  .connect('mongodb://localhost:27017/mnc-test')
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    app.use(router)
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

module.exports = app