
const dbTables = {
  users: "users",
  tokens: "tokens",
  address: "address"
}

const MONGO_DATABASE_URL = `mongodb://n0piyanos-o95user:fdjmgn45*-7fghd-*egaa@95.216.208.161:27017/fd3hm6dfgzsgpu-yuo`


const config = {
  APP_PORT: 6201,
  MONGO_DATABASE_URL,
  dbTables
}

module.exports = config