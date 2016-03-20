var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var util = require('util');

var registrocrawler1, registrocrawler2, registrocrawler5;
// Connect to the db
MongoClient.connect("mongodb://localhost/myosotis", function(err, db) {
  if(err) { return console.dir(err); }
  registrocrawler1 = db.collection('registrocrawler1');
  registrocrawler2 = db.collection('registrocrawler2');
  registrocrawler5 = db.collection('registrocrawler5');
  registrocrawler6 = db.collection('registrocrawler6');
});

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/font-awesome/css/", express.static(__dirname + '/font-awesome/css/'));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.get('/collection/site1/all/', function(req,res){
  registrocrawler1.find().toArray(function(err, items) {            
    res.send(items);
  });
});

app.get('/collection/site2/all/', function(req,res){
  registrocrawler2.find().toArray(function(err, items) {            
    res.send(items);
  });
});

app.get('/collection/site5/all/', function(req,res){
  registrocrawler5.find().toArray(function(err, items) {            
    res.send(items);
  });
});

app.get('/collection/site6/all/', function(req,res){
  registrocrawler6.find().toArray(function(err, items) {            
    res.send(items);
  });
});

http.listen(4000, function(){
  console.log('Disponível na porta 4000');
});