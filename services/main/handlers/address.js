
const { userModel } = require('../lib/User')
const { tokenModel } = require('../lib/Token')
const { addressModel } = require('../lib/Address')



async function getList(req, reply) {

  let { authorization } = req.headers
  const db = this.mongo.db
  const { userId } = await tokenModel({ userModel: userModel({ db }), db }).loadTokenAndUser(authorization)
  const { items, totalCount } = await addressModel({ db }).getList({ userId })

  reply.send({ items, totalCount });
}


async function create(req, reply) {

  let { authorization } = req.headers
  const db = this.mongo.db

  const { email, phone, name } = req.body;

  if (!name) {
    //throw "Name is required"
    // new Error("Name is required")
    reply.code(400).send({ message: "Name is required" });
    return
  }

  const { userId } = await tokenModel({ userModel: userModel({ db }), db }).loadTokenAndUser(authorization)
  const data = {
    userId,
    name,
    email,
    phone
  }
  const responseCreated = await addressModel({ db }).create(data)

  reply.send({ result: responseCreated });
}




module.exports = {
  getList,
  create
}


