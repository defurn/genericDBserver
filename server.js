require('dotenv').config()



const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const http = require('http');

const chalk = require('chalk');
const blue = chalk.bold.blue;
const red = chalk.bold.red;
const green = chalk.bold.green;

app.set('views', './views')
app.set('view engine', 'ejs');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const port = process.env.PORT || 3030;
const MONGO_URI = process.env.MONGO_URI
const MONGO_USER = process.env.MONGO_USER
const MONGO_PW = process.env.MONGO_PW
const MONGO_CONNECTION_STRING = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_URI}`
var db;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//logging middleware
let timer = (req, res, next) => {
  req.timestamp = new Date().toLocaleString();
  next()
}

let logger = (req, res, next) => {
  if (req.method === 'GET'){
    color = blue
  } else if (req.method === 'DELETE'){
    color = red
  } else if (req.method === 'POST'){
    color = green
  }
  console.log(`/ ${color(req.method)} ${red(req.baseUrl)} ${green(req.timestamp)}
  `
  //  ${Object.keys(req)}
  // ${Object.keys(req.headers)}
  );

  next();
}


//setup mongodb and start server
const client = new MongoClient(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  db = client.db("test")
  if (err) console.log(`error ${err}`);
  else console.log(`mongo active: ${db.databaseName}`)
  // perform actions on the collection object
  app.listen(port, () => {
    console.log(`app is listening on port: ${port}`);
  });
  // client.close();
});
// mongo.connect(MONGO_CONNECTION_STRING, (err, database) => {
//   console.log(`connecting to ${MONGO_URI}`)
//   db = database;
// })

router.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

router.get('/index.js', (req, res) => {
  res.sendFile(__dirname + '/index.js');
});

router.get('/dbcontents', (req, res, next) => {
  db.collection('practexpress')
  .find()
  .toArray( (err, data) => {
    if (err) return res.send('error: ' + err);
    res.render('index', { data: data });
  })
});

router.delete('/mongo/:id', (req, res, next) => {
  let id = req.params.id;
  db.collection('practexpress')
    .remove({_id:ObjectID(id) }, (err, result) => {
      if (err) res.send(`error: ${err}`)
      if(result.result.n > 0){
        res.send('deleted')
      } else {
        res.send('item doesn\'t exist');
      }
  })
});

router.post('/mongo/post', (req, res, next) => {
  let data = req.body;
  let timestamp = { submitted_time: req.timestamp}

  let sendData = Object.assign(data, timestamp);

  db.collection('practexpress')
  .save(sendData, (err, result) => {
    if (err) return err
    res.redirect('/dbcontents');
  })
})


app.use('*', timer);
app.use('*', logger);
app.use('/', router);
