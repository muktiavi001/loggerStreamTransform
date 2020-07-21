var express = require('express');
var xsenv = require('@sap/xsenv');
var passport = require('passport');
var JWTStrategy = require('@sap/xssec').JWTStrategy;
var logging = require('@sap/logging');
var appContext = logging.createAppContext();

var app = express();

app.use(logging.middleware({ appContext: appContext }));

passport.use(new JWTStrategy(xsenv.getServices({uaa:{tag:'xsuaa'}}).uaa));

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get('/', function (req, res, next) {
  var logger = req.loggingContext.getLogger('/Application');
  var tracer = req.loggingContext.getTracer(__filename);

  var isAuthorized = req.authInfo.checkScope('example.scope');
  if (isAuthorized) {
    tracer.debug("Authorization success. User: " + req.user.id + ", Path: '/'.");
    res.send('Application user: ' + req.user.id);
  } else {
    logger.info("Authorization failed. User: " + req.user.id + ", Path: '/'.");
    res.status(403).send('Forbidden');
  }
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});