var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CustomerSchema = new Schema({
  BP_code: String,
  BP_name: String,
  slp: String,
  meta: {
    createAt:{
      type: Date,
      default: Date.now()
    },
    updateAt:{
      type: Date,
      default: Date.now()
    }
  }
})

CustomerSchema.pre('save',function(next) {
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  next()
})

CustomerSchema.statics = {
  fetch: function(cb) {
    return this
    .find({})
    .sort('meta.updateAt')
    .exec(cb)
  },
  findById: function(id, cb) {
    return this
    .findOne({_id: id})
    .sort('meta.updateAt')
    .exec(cb)
  }
}

module.exports = CustomerSchema
