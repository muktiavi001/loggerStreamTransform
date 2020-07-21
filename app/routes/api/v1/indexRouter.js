var express = require('express');
var router = express.Router();
const app = express();
const loggerRouter = require('./loggerRouter');
const validateRequest = require('../../../middleware/validateRequest');


router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  console.log('Request URL:', req.originalUrl);
  console.log('Request URL:', req.method);
 // console.log('Request URL:', approot);
  next()
})

router.post('/api/v1/logdata',validateRequest.createLog, loggerRouter.postLogData);



module.exports = router;


