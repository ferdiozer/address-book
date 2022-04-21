
const db = require("../lib/mongo_pool")


const AddressBookController = {
  getList: async (request, reply) => {
    let {params} = request

    console.log('AddressBookController: getList:params ', params)
    reply.send({
        ready: true,
        message: 'OK'
      })
  }

  }



module.exports = AddressBookController


