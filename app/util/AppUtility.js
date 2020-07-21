'use strict';
const fs = require("fs").promises;


class AppUtility {
 
  constructor() {
   
  }

  async writeData(data) {
      try{
        console.log("log req data from console.");
        await fs.writeFile("log.txt",data);  
      }catch(err){
        console.error(err);
      }
   
  
  }

  
}




module.exports = AppUtility;
