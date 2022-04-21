const AddressBookController = require('../handlers/addressBook')

module.exports = function (fastify, opts, next) {

    fastify.route({
        method: 'GET',
        url: '/',
        handler: AddressBookController.getList
      })
    next()
  }