/*eslint no-console: 0, no-unused-vars: 0, no-undef:0, no-process-exit:0*/
/*eslint-env node, es6 */

"use strict";
const https = require("https");
const port = process.env.PORT || 3100;
const server = require("http").createServer();
const express = require("express");

//Initialize Express App for XSA UAA and HDBEXT Middleware
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");
const xsHDBConn = require("@sap/hdbext");
xsenv.loadEnv();
// Read only the credentials portion of the configuration for a service instance matching a given service query

var svc = xsenv.serviceCredentials({ tag: 'xsuaa' }); 
console.log("svc-------",svc); // prints { host: '...', port: '...', user: '...', password: '...', ... }
//console.log(xsenv.loadEnv());
https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + "/";
global.__uaa = process.env.xsuaa;    //xsuaa

//global.__uaa = 'xsuaa';
//logging
let logging = require("@sap/logging");
let appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
let app = express();

try{
//Build a JWT Strategy from the bound UAA resource
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	xsuaa: {
		tag: "xsuaa"
	}
}).uaa));

//Add XS Logging to Express
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: true
}));

console.log('before passport initialization....')
//Add Passport JWT processing
app.use(passport.initialize());

console.log('after passport initialization....')


console.log('after jwt initialization....');
}catch(err){
console.log('errrr======',err);
}
//Setup Additional Node.js Routes
app.get('/demo', function (req, res) {
    try {
        console.log('inside try req initialization....');
        //Add Passport for Authentication via JWT + HANA DB connection as Middleware in Expess
        app.use(
        //xsHDBConn.middleware(hanaOptions.hana),
        passport.authenticate("JWT", {
        session: false
        })
        );
      
        var logger = req.loggingContext.getLogger('/Application/File');

        var tracer = req.loggingContext.getTracer(__filename);
      
        logger.info('Retrieving demo greeting  #####...');
        console.log("tracer info----------%%%%----------\n",logger);
       tracer.debug('Processing GET request to /demo');
        res.send('demo log req received');
        console.log('response after sending...');
    }catch(err){
        console.log('inside catch req initialization....',err)
    }

   /* 
   
  */
 
  });

//Start the Server
app.listen(3002, function() {
    console.log('Server started');
  });