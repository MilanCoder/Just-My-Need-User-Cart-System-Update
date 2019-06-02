const mongoose = require('../connection');

const OrderedProducts= new mongoose.Schema({
    subproductId:String,
    subproductName:String,
    amount:Number,
    suffix:String,
    quantity:Number,
    subTotal:Number
})
const OrderSchema= new mongoose.Schema({
    delieveryId:String,
    allocatedEmpId:String,
    orderId:String,
    date:String,
   timeSlot:{type:String,required:true},
   delieveryAddress:String,
   pincode:{type:String,required:true},
    transactionId:{type:String,required:true},
    status:String,
    payment:{type:String,required:true},
    customerId:{type:String,required:true},
paymentMethod:{type:String,required:true},
 orderedProducts:[
    OrderedProducts
 ]

})

module.exports={
    OrderSchema: mongoose.model("orders",OrderSchema),
    OrderedProducts:mongoose.model("orderedProducts",OrderedProducts)
}