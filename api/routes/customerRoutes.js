const express = require('express');
const customerRoutes = express.Router();
const customerCrud=require('../../db/crudOperations/customerCrud')
const passport = require('passport')
const customer= require('../../models/setterGetter/customer.model')
const orderCrud= require('../../db/crudOperations/orderCrud');
const order= require('../../models/setterGetter/order.model');
const jwt=require('jsonwebtoken');
const passwordEncryptor=require('../../Utils/passwordEncryptor');
const jwtVerification = require('../../Utils/jwt/jwtverify');
const config = require("../../Utils/statusconfig");
const cartObject=require("../../models/setterGetter/cartmodel");
const checkQuantity=require('../../Utils/middleware/checkQuantity');
const cartOperations = require('../../db/crudOperations/cartOperations');


customerRoutes.post('/cart/addProduct',jwtVerification.verifyToken,checkQuantity,(req,res)=> {
    // let stackTrace=req.body.stackTrace;
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json('JWT Error');
        }else{
          
            if(req.body.crud=='add') {
                
                cartOperations.addToCart(req.body.stackTrace,req.body.cartProduct,authData.userobj,res);
            }else{
                res.status(409).json('Non Valid Crud');
            }
        }
    })
   
});
customerRoutes.get('/cart/getCartData',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json('JWT Error');
        }else{
            cartOperations.getCartData(authData.userobj.customerId,res);
        }})
})

customerRoutes.post('/cart/deleteProduct',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json('JWT Error');
        }else{
            if(req.body.crud =='del'){
                let currentquantity = req.body.cartProduct.quantity;
                cartOperations.decreaseQuantity(req.body.cartProduct,currentquantity,res);
            }

        }
});})

customerRoutes.post('/cart/deletecartProduct',jwtVerification.verifyToken,(req,res)=> {
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json('JWT Error');
        }else{
           console.log(req.body);
            if(req.body!=null){
                if(req.body.cartProductId!=null){
                    cartOperations.deleteParticularItem(req.body.cartProductId,res);
                }
            }
        }})

});

customerRoutes.post('/order',(req,res)=>{
if(req.body.order!=null){
    try{
for(let key in order){
    order[key]=req.body.order[key];
}
    orderCrud.addOrder(order,res);
}catch(e){
    res.status(500).json('Invalid Order');
}}else 
{
    res.status(409).json('Null Data');
}

})

customerRoutes.get('/getProfileData',jwtVerification.verifyToken,(req,res)=>{
    jwt.verify(req.token,jwtVerification.custSecurekey,(err,authData)=>{
        if(err){
            res.status(409).json('JWT Error');
        }else{
            customerCrud.getData(authData.userobj,res);
        }
    })
})


customerRoutes.post('/auth/login' ,async (req,res)=>{
let loginObj={'email':req.body.email,'password':req.body.password};
let userobj= await customerCrud.login(loginObj);
if(userobj!=null && userobj!='error'){
if(passwordEncryptor.verifyPassword(loginObj.password,userobj.password)==true){
    jwt.sign({userobj},jwtVerification.custSecurekey,{expiresIn:'100000s'},(err,token)=>{
        if(err){
            res.status(500).json(err)
        }else{
        res.json({
            'custToken':token
         })
    }
    })
}else{
    res.status(500).json('Invalid Password')
}


}else{
    res.status(500).json('No User Found');
}
})

customerRoutes.post('/auth/signup',async (req,res)=>{
    //console.log(req.body);
    let custObj=customer.customerModel;
for(let key in req.body.customerData){
    if(key=='password'){
custObj[key]=passwordEncryptor.generatePassHash(req.body.customerData[key],10);
    }
    else{
   custObj[key]=req.body.customerData[key];
}}
custObj.createdAt=Date.now();
let returncustObj = await customerCrud.signUp(custObj);



if(returncustObj!='error' && returncustObj!=null){
jwt.sign({returncustObj},jwtVerification.custSecurekey,{expiresIn:'100000s'},(err,token)=>{
    if(err){
        res.status(500).json(err)
    }else{
    res.json({
        'custToken':token
     })}
})
}
})



customerRoutes.get('/auth/facebook',passport.authenticate('facebook'));

customerRoutes.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

customerRoutes.get('/dashboard',passport.authenticate('google'), (req,res)=> {
    console.log("request user inside the request ", req.user);
    res.send("Welcome User "+req.user.name);
})

module.exports=customerRoutes;