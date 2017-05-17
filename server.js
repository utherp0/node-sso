//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app     = express();
var eps     = require('ejs');

app.engine('html', require('ejs').renderFile);

app.use( '/scripts', express.static('scripts'));

app.get('/', function (req, res) {
  res.render('rhsso_test.html');
});

app.get('/js', function (req, res) {
  res.render('rhsso_js.html');
});

app.get('/page1.html', function (req,res ) {
  res.render('page1.html');
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('5xx error detected at Server, check code.');
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);
