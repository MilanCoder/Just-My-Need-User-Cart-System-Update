const mongoose = require('../connection');
const Customer = mongoose.Schema;
const order= mongoose.Schema({
    orderId:String
})
const cart = mongoose.Schema({
cartId:String
})

const CustomerSchema = new Customer({
firstName:String,
lastName:String,
dob:String,
email:String,
address:String,
password:String,
mobile_no:String,
customerId:String,
orders:[
    order
],
cartProducts:[
    cart
],
loggedOnce:{
    type:Boolean,
    default:false
},

createdAt:{
    type:Date,

}

})

module.exports={
    Customer:mongoose.model('Customers',CustomerSchema)
}