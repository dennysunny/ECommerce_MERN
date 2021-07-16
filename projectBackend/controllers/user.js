const User = require("../models/user");
const Order = require("../models/order")

exports.getUserById = (req, res, next, id) => {
   
    User.findById(id).exec((err, user) => {

        if(err || !user){

            return res.status(400).json({
                error : "No User Found in DB"
            })
        }

        req.profile = user; //assigning the retrieved user to profile
        next();
    })
}

exports.getUser = (req, res) => {

    //for not to send back salt and pwd to front end
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined

    return res.json(req.profile)
}

exports.updateUser = (req, res) => {

    User.findByIdAndUpdate(
        {_id : req.profile._id}, //which one should update
        {$set : req.body}, //what should update
        {new: true, useFindAndModify: false}, //compolsory parameters
        (err, user) => {

            if(err || !user){

                return res.status(400).json({
                    error : "Not Authorized to update"
                })
            }

            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            res.json(user)
    
        }
    )
}

exports.userPurchaseList = (req, res) => {

    //order schema has ref of user
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order) => {

        if(err ){
            return res.status(400).json({
                error : "No Order in this Account"
            })
        }
        return res.json(order) //entire order is send back
    })

}

//user model
//middleware
exports.pushOrderInPurchaseList = (req, res, next) => {

    let purchases = [];
    req.body.order.products.forEach(product =>{
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.stock,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id
        })
    })

    //store in db
    User.findOneAndUpdate(
        {_id : req.profile._id},
        {$push : {purchases: purchases}}, //using push because this is an array
        {new: true}, //new = true means ; send me back the data which is the updated one
        (err, purchases) => {

            if(err){
                return res.status(400).json({
                    error : "Unable to save purchase list"
                })
            };

            next();
        }  
    )
    
}