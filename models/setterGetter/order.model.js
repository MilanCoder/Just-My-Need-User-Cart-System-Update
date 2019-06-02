const OrderedProducts={
    subproductId:null,
    subproductName:null,
    amount:null,
    suffix:null,
    quantity:null,
    subTotal:null
}
const orderModel={
   
        delieveryId:null,
        allocatedEmpId:null,
        orderId:null,
        date:null,
       timeSlot:null,
       delieveryAddress:null,
       pincode:null,
        transactionId:null,
        status:null,
        payment:null,
        customerId:null,
    paymentMethod:null,
     orderedProducts:[
     
     ]
}

module.exports={'orderModel':orderModel,
'orderProduct':OrderedProducts
}