
const dotenv = require("dotenv");

dotenv.config();


const dbTables = {
  users: "users",
  tokens: "tokens",
  address: "address"
}


const config = {
  APP_PORT: process.env.APP_PORT,
  MONGO_DATABASE_URL: process.env.MONGO_DATABASE_URL,
  dbTables
}

module.exports = config