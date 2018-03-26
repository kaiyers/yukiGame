var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({ extented: false });

var app = express();

// app.set('view engine', 'pug');

app.use(express.static('views'));

app.get('/', function(req, res) {
	res.send('waiting');
});

app.get('/:id', function(req, res) {
    var id = req.params.id;
    // res.render(id);
    res.sendfile(__dirname + '/views/' + id + '.html');
});


app.listen(8088);

console.log('app is running');