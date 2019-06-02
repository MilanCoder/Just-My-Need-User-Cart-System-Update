const cartModel=require('../../db/schemas/cartSchema');
const productModel=require('../schemas/ProductSchema');
const config = require('../../Utils/statusconfig');
const cartPIdgen=require('../../Utils/idGenerator/cartPIdGen')
const cartOperations = {

    cartCreate(cartObject,res){
       // console.log(cartObject);
      cartModel.create(cartObject,(err)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else {
                console.log('here');
                res.status(200).json({"status":config.SUCCESS,'isPushed':true, "cartproduct":cartObject});
            }
        });
    },
    getCartData(customerId,res){
        //console.log(customerId);
        cartModel.find({'customerId':customerId},(err,cart)=>{
            if(err){
                res.status(500).json({"status":config.ERROR,"message":err});
         
            }else{
              res.status(200).json({"status":config.SUCCESS,'cartArray':cart});

            }
        })

    }
    ,

    addToCart(stackTrace,cartProduct,authData,res){
       
        if(cartProduct.cartProductId==null){
            if(stackTrace.length==4){

        productModel.Products.findOne({"categoryId":stackTrace[0]},(err,category)=> {
            if(err) {
               
                res.status(500).json({"status":config.ERROR,"message":config.ERROR});
            }

            else if(category!=null){
                let isFound=false;
              //  console.log('im here')
                for(let i=0;i<category.subcategory.length;i++){
                   if(isFound!=true){
                    if(category.subcategory[i].subcategoryId==stackTrace[1]){

                       for(let j=0;j<category.subcategory[i].products.length;j++){
                       // console.log('im hsubbce')
                        if(isFound!=true){
                        let product=category.subcategory[i].products[j];
                        if(product.productId==stackTrace[2]){

                        for(let k=0;k<product.subProducts.length;k++){  
                           // console.log('im sube')
                           if(isFound!=true){
                            let subproduct=product.subProducts[k];
                            if(subproduct.subproductId==stackTrace[3]){
                              
                              for(let l=0;l<subproduct.info.priceAndAmount.length;l++){
                               // console.log('im prive')
                                if(isFound!=true){
                                let amtprice = subproduct.info.priceAndAmount[l];
                                if(cartProduct.amount==amtprice.amount && cartProduct.suffix==amtprice.suffix){
                                    cartProduct.costprice=parseFloat(amtprice.price);
                                    cartProduct.sellprice = (parseFloat(amtprice.price)-(0.01*parseInt(amtprice.discount)*parseFloat(amtprice.price)));
                                    cartProduct.subTotal=parseFloat(cartProduct.sellprice*cartProduct.quantity);
                                    cartProduct.cartProductId=cartPIdgen.generateId(subproduct.subproductName);
                                    cartProduct.customerId=authData.customerId;
                                    cartProduct.subcategoryId=category.subcategory[i].subcategoryId;
                                    cartProduct.subcategoryName = category.subcategory[i].subcategoryName;
                                    cartProduct.imageUrl=subproduct.imageUrls[0];
                                    cartProduct.subproductId=stackTrace[3];
                                    cartProduct.subproductName=subproduct.subproductName;
                                  
                                   // console.log(cartProduct,authData);
                                    isFound=true;

                                } 
                            }
                              }
                            }
                            }}
                        }}
                       }
                    }
                    }
                
            
            }
           // console.log(isFound);
        if(isFound==true){
          //  console.log('found')
     cartOperations.cartCreate(cartProduct,res);
        }else{
            res.status(409).json('No Cart Found');
        }
        }
        })}else{
            res.status(409).json('StackTrace Invalid');
        }
    }else{
            cartOperations.increaseQuantity(cartProduct,cartProduct.quantity,res)
        }
    },
    increaseQuantity(cartProduct,currentQuantity,res) {
     //   console.log(currentQuantity,cartProduct);
        
        if(currentQuantity>12){
            res.status(500).json({"status":config.ERROR,"message":config.quantityOverflow});
        }
        cartModel.findOneAndUpdate({'cartProductId':cartProduct.cartProductId},{$set:{quantity:currentQuantity},$inc:{subTotal:cartProduct.sellprice}},{new:true},(err,updatedObjectOfCart)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else {
                console.log('here');
                res.status(200).json({"status":config.SUCCESS,'isPushed':true, "cartproduct":updatedObjectOfCart});
            }
        });
    },
    decreaseQuantity(cartProduct,currentQuantity,res) {
      //  console.log(cartProduct);
        if(currentQuantity>0){
        cartModel.findOneAndUpdate({'cartProductId':cartProduct.cartProductId},{$set:{quantity:currentQuantity},$inc:{subTotal:-(cartProduct.sellprice)}},{new:true},(err,updatedObjectOfCart)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else {
                res.status(200).json({"status":config.SUCCESS, "isDeleted":true, "cartproduct":updatedObjectOfCart});
            }
        });
    }else{
        this.deleteParticularItem(cartProduct.cartProductId,res)
    }
},
    deleteParticularItem(cartProductId,res) {
       // console.log('here delete')
        cartModel.findOneAndDelete({'cartProductId':cartProductId},(err,updatedObjectOfCart)=> {
            if(err) {
                res.status(500).json({"status":config.ERROR,"message":err});
            }
            else if(!updatedObjectOfCart) {
                res.status(404).json({"status":config.NOT_FOUND,"message":updatedObjectOfCart});
            }
            else {
                res.status(200).json({"status":config.SUCCESS,"cartproduct":updatedObjectOfCart ,'isDeleted':true});
            }
        });
    },
    emptyWholeCart(cartProductIdArray,res) {
        let index=0;
        async.each(cartProductIdArray,function(err,callback) {
            cartModel.find({cartProductId:cartProductIdArray[i]},(err)=> {
                if(err) return callback(err);   
                else {
                    index++;
                    callback();
                }
            }),function(err) {
                if(err) {
                    res.status(500).json({"status":config.ERROR,"message":err});
                }
                else{
                    res.status(200).json({"status":config.EMPTY,"message":config.CARTEMPTYMESSAGE});
                }
            };
        })
                
        },
        findSubProduct(cartObject,res,next) {
        }
    }
module.exports=cartOperations;