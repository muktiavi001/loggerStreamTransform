'use strict';
const express = require('express');
const app = express();
const logging = require('@sap/logging');
const AppUtility = require('../util/AppUtility');
var Filter = require('../util/streamFilterUtility');
const fs = require('fs');
const stream = require('stream');



const apputilObj = new AppUtility();

class LoggerController {
 
  constructor(reqdata) {
     this.request = reqdata;
     this.appContext = logging.createAppContext({req:reqdata});
     app.use(logging.middleware({ appContext: this.appContext , logNetwork: true }));
  }

  async  postLogData() {
      try{
        console.log("log req data from console.");
         
        let servityLevel;
        
        var logger = this.appContext.createLogContext().getLogger('/Application');
     // const transformer = new filter();  
      var access = fs.createWriteStream("newLog.txt");
       process.stdout.write = process.stderr.write = access.write.bind(access);

     /*  const mySuperTransformStream = new Transform({
        _transform: (chunk, encoding, cb) => cb(
          null,
          
            chunk.toString().toUpperCase(),
            
          ),
        
      });
      */
     function createMyStream(){
      return new stream.Transform({
        
        transform: transformFunc
      });
    
      function transformFunc(chunk, encoding, callback){

        // just to check ,able to transform or not
        var data = chunk.toString().toLowerCase();
    
        callback(null,data);
      }
    };
    var mystream = createMyStream();
   
       
       logger.info(this.request.body);
       process.stdout.pipe(mystream).pipe(access);
       access.end();

       
        
        return true;
      }catch (err){
       console.log('error  in postLog Data ',err);
      }
    
  }


}




module.exports = LoggerController;
