var logging = require('@sap/logging');
var express = require('express');
const https = require("https");
const port = process.env.PORT || 3100;
var app = express();
//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");
const xsHDBConn = require("@sap/hdbext");
xsenv.loadEnv();
var svc = xsenv.serviceCredentials({ tag: 'xsuaa' }); 
console.log("svc-------",svc); // prints { host: '...', port: '...', user: '...', password: '...', ... }
//console.log(xsenv.loadEnv());
https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";
global.__uaa = process.env.xsuaa;    //xsuaa

//global.__uaa = 'xsuaa';


var appContext = logging.createAppContext();

//Build a JWT Strategy from the bound UAA resource
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	xsuaa: {
		tag: "xsuaa"
	}
}).uaa));

app.use(passport.initialize());

console.log('after passport initialization....')

//Add Passport for Authentication via JWT + HANA DB connection as Middleware in Expess
app.use(passport.initialize());

console.log('after passport initialization....')

//Add Passport for Authentication via JWT + HANA DB connection as Middleware in Expess

app.use(logging.middleware({ appContext: appContext, logNetwork: true }));
app.get('/demo', function (req, res) {
   
try {
  app.use(
    //xsHDBConn.middleware(hanaOptions.hana),
    passport.authenticate("JWT", {
      session: false
    })
  );

  var logger = req.loggingContext.getLogger('/Application/File');
  var tracer = req.loggingContext.getTracer(__filename);

  logger.info('Retrieving demo greeting ...');
  console.log("tracer info--------------------\n");
  tracer.info('Processing GET request to /demo');

  res.send('Hello Worldddddd!');
}catch(err){
  console.log("server error====",err);
}

 
 
});

app.listen(3000, function() {
  console.log('Server started');
});