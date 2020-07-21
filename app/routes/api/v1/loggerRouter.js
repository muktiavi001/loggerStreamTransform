
const LoggerController = require('../../../controller/LoggerController');
var  prepareResponseObj = require('../../../resources/response');
//const postLogData 
module.exports = {
     postLogData:  async function (req,res){
                    try{

                    const loogectrlrObj = new LoggerController(req,res);
                    var postLogResult = await loogectrlrObj.postLogData();

                    res.send('log data successfully!');
                    }catch(err){
                        console.log(`error occured in logging message...: ${JSON.stringify(err)}`);
                        prepareResponseObj.success = false;
                        prepareResponseObj.message = 'error occured in logging message';
                        prepareResponseObj.ExceptionMessage = JSON.stringify(err);
                        prepareResponseObj.status = "502";
                        res.status(502).json(prepareResponseObj);    
                   }
                
                
        }
}



