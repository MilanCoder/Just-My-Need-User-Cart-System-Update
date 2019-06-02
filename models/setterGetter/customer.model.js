
const order= {
    orderId:null
}
const cart = {
cartId:null
}

const CustomerModel = {
firstName:null,
lastName:null,
dob:null,
email:null,
address:null,
password:null,
mobile_no:null,
customerId:null,
orders:[

],
cartProducts:[
  
],
loggedOnce:false
,

createdAt:null
  
}

module.exports={
 'customerModel':CustomerModel,
 'order':order,
 'cart':cart
}
