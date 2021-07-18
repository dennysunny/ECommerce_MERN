const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema


const productCartSchema = new mongoose.Schema({

    //based on productschema
    product:{
        type: ObjectId,
        ref: "Product"
    },

    //what to see in the cart
    name: {
        type: String
    },

    //how many prods are ordering
    count: {
        type: Number
    },

    //individual sum of products, like x product * 2
    price: {
        type: Number
    }

})

const ProductCart = mongoose.model("ProductCart", productCartSchema)



const orderSchema = new mongoose.Schema(
  {
    //products that is in the cart
    products: [productCartSchema],
    transaction_id: {},

    amount: {
      type: Number,
    },

    address: {
      type: String,
      maxlength: 2000,
    },

    status: {
      type: String,
      default: "Received",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Received"],
    },

    updated: {
      type: Date,
    },

    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema)


//exports both
module.exports = {Order, ProductCart}