var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var chalk = require('chalk');
var blue = chalk.bold.blue;
var red = chalk.bold.red;
var green = chalk.bold.green;

app.set('views', './views')
app.set('view engine', 'ejs');

var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var port = process.env.PORT || 3030;
var MONGO_URI   = process.env.MONGO_URI;
var db;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//logging middleware
let logger = (req, res, next) => {
  if (req.method === 'GET'){
    color = blue
  } else if (req.method === 'DELETE'){
    color = red
  } else if (req.method === 'POST'){
    color = green
  }
  console.log(`/ ${color(req.method)} ${red(req.baseUrl)}
  `
  //  ${Object.keys(req)}
  // ${Object.keys(req.headers)}
  );
  next();
}

//setup mongodb and start server
mongo.connect(MONGO_URI, (err, database) => {
  db = database;
  app.listen(port, () => {
    console.log(`listening on port: ${port}`);
    if (err) console.log(`error ${err}`);
    else console.log(`mongo active: ${db.databaseName}`)
  });
})

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
  let sendData = req.body;
  db.collection('practexpress')
  .save(req.body, (err, result) => {
    if (err) return err
    res.redirect('/dbcontents');
  })
})


app.use('*', logger);
app.use('/', router);
