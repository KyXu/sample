var mongoose = require('mongoose')
var CustomerSchema = require('../schemas/customer.js')
var Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer
