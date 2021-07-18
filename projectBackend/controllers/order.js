const {Order, ProductCart} = require("../models/order")

exports.getOrderById = (req, res, next, id) => {

    Order.findById(id)
    //which field u want to populate, information u want to grab
    .populate("products.product", "name price")
    .exec((err, order) => {

        if(err){
            res.status(400).json({
                error : "No Order Found in Database"
            })
        }

        req.order = order;

        next();
    })
}

exports.createOrder = (req, res) => {

    req.body.order.user = req.profile

    const order = new Order(req.body.order)
    order.save((err, order) => {

        if(err){
            res.status(400).json({
                error : "Failed to Save Order in Database"
            })
        }
        res.json(order)
    })
}

exports.getAllOrders = (req, res) => {

    Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {

        if(err){
            res.status(400).json({
                error : "Failed To Get Order From Database"
            })
        }
        res.json(orders)
    })
}

exports.getOrderStatus = (req, res) => {

    res.json(order.schema.path("status").enumValues)
}

exports.updateOrderStatus = (req, res) => {

    Order.update(
        {_id : req.body.orderId},
        {$set : {status : req.body.status}},
        (err, order) => {
            if(err){
                res.status(400).json({
                    error : "Cannot Update Order"
                })
            }
            res.json(order)
        }
    )
}