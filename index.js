const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const cors = require('cors');
var AWS = require("aws-sdk");
app.use(bodyParser.json({ strict: false }));
app.use(cors());
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function putDDB(id, name, email) {
  return new Promise((resolve, reject) => {
    // console.log(typeof id)
    var params = {
      ReturnConsumedCapacity: "TOTAL",
      TableName: "SLSusers",
      Item: {
        "pk": name,
        "sk": id,
        "email": email
      }
    };

    dynamodb.put(params, function (err, data) {
      if (err) console.log(err);
      else {
        console.log(data);
      }
    })
  })
}

async function scan(scanKey) {
  return new Promise((resolve, reject) => {
    var res = []
    var params = {
      TableName: "music",
      FilterExpression: "pk = :scanValue",
      ExpressionAttributeValues: {
        ":scanValue": scanKey
      }
    };

    dynamodb.scan(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else {
        console.log(data);
        data.Items.forEach((i) => {
          console.log(i.sk);
          res.push(i.sk);
        })
        console.log(res);
      }
      resolve(res);
    })
  })
}

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// app.post('/save-user', async (req, res) => {
//   // console.log('fuck')
//   var id = req.query.id;
//   var name = req.query.name;
//   var email = req.query.email;
//   putDDB(id, name, email)
//     .catch(e => {
//       res.status(400).json('booty');
//     });
//   var gen = await scan("genre")
//   res.status(200).json(gen);
// })

// Create User endpoint
const USERS_TABLE = "SLSusers"
app.post('/users', function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      pk: userId,
      sk: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, name });
  });
})

module.exports.handler = serverless(app);