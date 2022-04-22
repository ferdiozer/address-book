
const db = require("../lib/mongo_pool")


const LoginController = {
  login: async (request, reply) => {
    let { params } = request

    reply.send({
      success: false,
      ready: true,
      message: 'OK',
      params
    })
  }

}



module.exports = LoginController


