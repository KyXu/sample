var Customer = require('../models/customer.js')
var _ = require('underscore')

//admin new page
exports.new = function(req, res) {
  res.render('customer_admin',{
    title:'Customer admin',
    customer:{}
  })
}
//admin post Customers info
exports.save = function(req, res){

  console.log(req.body.customer)
  var _customer = req.body.customer
  var customer = new Customer(_customer)

   customer.save(function(err, customer){
     if(err){
       console.log(err)
     }
     res.redirect('/admin/customer/list')
   })
}

//customer list
exports.list = function(req, res) {

/*    Customer.fetch(function(err, customers){
      if(err){
        console.log(err)
     }*/
      res.render('custumer_admin',{
        title:'Customers list'
        //customers: customers
      })

}
exports.del = function(req,res){
  var id = req.query.id

  if(id){
    Customer.remove({_id:id},function(err, movie){
      if(err){
        console.log(err)
        res.json({success:0})
      }
      else{
        res.json({success:1})
      }
    })
  }
}
