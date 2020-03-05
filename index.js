const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const cors = require('cors');
var AWS = require("aws-sdk");
app.use(bodyParser.json({ strict: false }));
app.use(cors());
const dynamoDb = new AWS.DynamoDB.DocumentClient();

function scan (){
  return new Promise((resolve, reject)=>{
    var results = [];
    var params2ElectricBoogaloo = {
      TableName: "music",
      FilterExpression: "pk = :scanValue",
      ExpressionAttributeValues: {
        ":scanValue": 'genre'
      }
    };

    dynamoDb.scan(params2ElectricBoogaloo, function (err, data) {
      if (err) console.log(err, err.stack);
      else {
        console.log(data);
        data.Items.forEach((i) => {
          console.log(i.sk);
          results.push(i.sk);
        })
      }
      resolve(res);
      // return res;
    })
  })
}

// async function putDDB(id, name, email) {
//   return new Promise((resolve, reject) => {
//     // console.log(typeof id)
//     var params = {
//       ReturnConsumedCapacity: "TOTAL",
//       TableName: "SLSusers",
//       Item: {
//         "pk": name,
//         "sk": id,
//         "email": email
//       }
//     };

//     dynamodb.put(params, function (err, data) {
//       if (err) console.log(err);
//       else {
//         console.log(data);
//       }
//     })
//   })
// }


app.get('/', function (req, res) {
  res.send('Hello World!')
})


// Create User endpoint
const USERS_TABLE = "SLSusers"
app.post('/save-users', async function (req, res) {
  // const { userId, name, email } = req.body;

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
  // var gen = scan();
  // // res.status(200).send(gen);
  // res.status(200).send("folk,funk");

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

module.exports.handler = serverless(app);