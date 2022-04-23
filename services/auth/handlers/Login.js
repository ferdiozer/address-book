const { dbTables } = require("../config");

const ObjectID = require("mongodb").ObjectID;

const UserClass = require('../lib/User')

const { userModel } = require('../lib/User')
const { tokenModel } = require('../lib/Token')



async function login(req, reply) {
  const { email, password } = req.body;
  const data = { email, password };
  const db = this.mongo.db

  const result = await userModel({ tokenModel: tokenModel({ db }), db }).login(data)
  reply.code(200).send({ result });

}


module.exports = { login };