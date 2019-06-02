 const Customer= require('../schemas/customerSchema')
 const custIdGen = require('../../Utils/idGenerator/custIdGen')
const customerCrud={

async signUp(custObj){
    let returncustomer=null;
try{
   let customer =await Customer.Customer.findOne({'email':custObj.email});
   if(customer!=null){  
      returncustomer=customer;
     }
     else{
         if(custIdGen.idgenerator(custObj.email)!=null){
        custObj.customerId=custIdGen.idgenerator(custObj.email);
        let customer=await Customer.Customer.create(custObj);
         returncustomer=customer;
          }}
       return returncustomer;
}catch(e){
    return returncustomer='error';
    
}},



async login(custObj){
let returnuser=null;
try{
    let customer = await Customer.Customer.findOne({'email':custObj.email});
    if(customer!=null){
        returnuser=customer;
    }
    return returnuser;

}catch(e){
return returncustomer='error';

}

},
getData(userobj,res){
    Customer.Customer.findById({'_id':userobj._id},(err,user)=>{
        if(err){
            res.status(409).json(err);
        }
        else{
            if(user!=null){
            let returnuser={
                firstName:user.firstName
            }
            res.status(200).json(returnuser);

        }else{
            res.status(409).json('No Data Found');
        }}
    })
    
}
}
module.exports=customerCrud