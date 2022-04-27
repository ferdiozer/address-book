const AddressBookController = require('../handlers/address')

module.exports = function (fastify, opts, next) {

  fastify.route({
    method: 'GET',
    url: '/',
    handler: AddressBookController.getList
  })
  fastify.route({
    method: 'POST',
    url: '/',
    handler: AddressBookController.create
  })
  next()
}