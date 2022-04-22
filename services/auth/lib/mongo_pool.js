
const { MongoClient } = require('mongodb');
const { MONGO_DATABASE_URL } = require('../config');

let mongoDbPool = null
const connect=()=>{
  MongoClient.connect(MONGO_DATABASE_URL,{ useUnifiedTopology: true}, (err, db) => {
    if(err){
      console.log('mongo error', err)
      process.exit(1)
    }
    console.log("connected mongo db")
    mongoDbPool = db
  });
}
if(!mongoDbPool){
  connect()
}

module.exports = mongoDbPool

