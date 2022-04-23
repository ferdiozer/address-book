const ObjectID = require("mongodb").ObjectID;

const _ = require('lodash')
const { dbTables } = require('../config')


//const UserClass = require('../lib/User')

const RegisterController = {
  test: async (request, reply) => {
    let { params } = request
    reply.send({
      success: false,
      ready: true,
      message: 'OK',
      params
    })
  },
  register: async (req, reply) => {
    let { params } = req
    // const userModel = new UserClass()

    console.log("mongo: ", this.mongo)

    const users = this.mongo.db.collection(dbTables.users);
    const { email, password, name } = req.body;
    const data = { email, password, name };
    const result = await users.insertOne(data);
    reply.code(201).send(result.ops[0]);
    console.log("params:", params)


  }

}


module.exports = RegisterController


