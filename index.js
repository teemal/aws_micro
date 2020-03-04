const serverless = require('serverless-http');
const express = require('express')
const app = express()
const cors = require('cors');
var AWS = require("aws-sdk");
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/save-user', async (req, res) => {
      console.log('fuck')
      var id = req.query.id;
      var name =  req.query.name;
      var email = req.query.email;
      putDDB(id, name, email)
      .catch(e =>{
          res.status(400).send('booty');
      });
      var gen = await scan("genre")
      res.status(200).send(gen);
})

module.exports.handler = serverless(app);