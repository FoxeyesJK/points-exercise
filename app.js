

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express(); 
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');

app.use(bodyParser.json());

app.use((req, res, next) => {
    next();
});

app.use(userRoutes);
app.use(transactionRoutes);

mongoose
  .connect(
    'mongodb+srv://mongodb-quote:PgVOWSPmpt7spV2f@cluster0.xnvkp.mongodb.net/point?retryWrites=true&w=majority'
  , { useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
