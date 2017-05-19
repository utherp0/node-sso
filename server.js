//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app     = express();
var eps     = require('ejs');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// RHSSO Integration
var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();

app.use(session({
  secret: "justaphrase",
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

var keycloakInstance = new Keycloak( { store : memoryStore });
//var keycloakInstance = new Keycloak( { scope : "session"});

// Initiate the middleware keycloak integration
app.use( keycloakInstance.middleware() );

app.engine('html', require('ejs').renderFile);

app.use( '/scripts', express.static('scripts'));

app.get('/', keycloakInstance.protect(), function (req, res) {
  console.log("In the render method for root context");
  console.log( "token:" + req.session['keycloak-token']);
  res.render('rhsso_test.html');
});

app.get('/js', function (req, res) {
  res.render('rhsso_js.html');
});

app.get('/page1.html', keycloakInstance.protect(), function (req,res ) {
  res.render('page1.html');
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('5xx error detected at Server, check code.');
});

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);
