const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const cors = require('cors');
var AWS = require("aws-sdk");
app.use(bodyParser.json({ strict: false }));
app.use(cors());
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.get('/', function (req, res) {
  res.send('Hello World!')
})


// Create User endpoint
const USERS_TABLE = "SLSusers"
app.post('/save-users', async function (req, res) {
  var userId = req.query.id;
  var name = req.query.name;
  var email = req.query.email;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }
  const params = {
    TableName: USERS_TABLE,
    Item: {
      pk: name,
      sk: userId,
      email: email
    }
  };
  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
  });

    var params2ElectricBoogaloo = {
      TableName: "music",
      FilterExpression: "pk = :scanValue",
      ExpressionAttributeValues: {
        ":scanValue": 'genre'
      }
    };
    var results = [];
    var gen = dynamoDb.scan(params2ElectricBoogaloo).promise();
    gen.then((data)=>{
      data.Items.forEach((i) => {
        console.log(i.sk);
        results.push(i.sk);
      })
      res.status(200).send(results);
    }).catch((e)=>{
      res.send(e)
    });

})

app.post('/user/playlist', async function (req, res) {
  res.send('huzzah')
})

module.exports.handler = serverless(app);