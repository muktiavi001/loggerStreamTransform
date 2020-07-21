const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const url = require('url');
const app = express();
const https = require("https");
//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");
const xsHDBConn = require("@sap/hdbext");
var routes = require('./routes/api/v1/indexRouter');

xsenv.loadEnv();

const port = process.env.PORT || 3040;
const approot = '/api/v1/';


// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


var svc = xsenv.serviceCredentials({ tag: 'xsuaa' }); 
//console.log("svc-------",svc); // prints { host: '...', port: '...', user: '...', password: '...', ... }
//console.log(xsenv.loadEnv());
https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";
global.__uaa = process.env.xsuaa;    //xsuaa

//Build a JWT Strategy from the bound UAA resource
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
xsuaa: {
tag: "xsuaa"
}
}).uaa));
//Add Passport JWT processing
app.use(passport.initialize());

var auth =  passport.authenticate("JWT", {
  session: true
  });
  console.log("auth-------",auth)
/*
app.use(
  //xsHDBConn.middleware(hanaOptions.hana),
  passport.authenticate("JWT", {
  session: true
  })
  );
*/
app.post('/test', passport.authenticate('JWT', { session: false }), (req, res) => {
  res.send('Authenticated');
});



app.use('/', routes);


// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    console.log(req.body);
    console.log({status:404,message:`NO ROUTE IS MATCHED: ${req.originalUrl} ,method ${req.method}`});
    res.status(404).end({status:404,message:`NO ROUTE IS MATCHED: ${req.originalUrl} ,method ${req.method}`});

	//next(err);
});
app.listen(port, () => {
  console.log('Server started on: ' , port);
});
