const Product = require("../models/product")
const formidable = require('formidable');
var _ = require('lodash');
const fs = require("fs");
const { sortBy } = require("lodash");

exports.getProductById = (req, res, next, id) => {
    
    Product.findById(id)
    .populate("category")  //to get product based on category
    .exec((err, product) => {

        if(err){

            return res.status(400).json({
                error : "Product Not Found"
            })
        }

        req.product = product
        next();
    })
}

exports.createProduct = (req, res) => {

    //F O R M I D A B L E
    //based on form data - cuz of imaages
    //https://www.npmjs.com/package/formidable

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //syntax is like this
    form.parse(req, (err, fields, files) => {

        if(err){

            return res.status(400).json({
                error : "Problem With Uploaded Image"
            })
        }

        // D E S T R C T U R E  F I E L D S
        const {name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {

          return res.status(400).json({
            error: "Please include all fields",
          });
        }

        let product = new Product(fields)

        //H A N D L I N G   F I L E S 
        //check size
        if(files.photo){

            if(files.photo.size > 3000000) {
                
                return res.status(400).json({
                    error : "File Size Too Big"
                })
            }
             //data will store the path
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, product) => {
            //watch section 10 - 05 - 06:10 
            if(err){

                return res.status(400).json({
                    error : "Failed To Save in DB"
                })
            }

            res.json(product)

        })
       
      });
}

exports.getProduct = (req, res) => {

    //we will be using a middleware to load photo seperately
    req.product.photo = undefined
    res.json(req.product)
}

//M I D D L E W A R E 
exports.photo = (req, res, next) => {

    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
        next();
    }
}

exports.removeProduct = (req, res) => {
    
    let product = req.product;
    product.remove((err, deletedProduct) => {

        if(err){
            return res.status(400).json({
                error : `Failed to Delete Product : ${req.product.name}`
            })
        }

        res.json({
            message : `${req.product.name} Deleted`
        })

    })
}

exports.updateProduct = (req, res) => {
    
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //syntax is like this
    form.parse(req, (err, fields, files) => {

        if(err){
            return res.status(400).json({
                error : "Problem With Uploaded Image"
            })
        }

        let product = req.product

        //lodash helps to work with forms arrays much easier way
        //extend takes the value that user passed, and extends that
        //fileds will update inside the products
        product = _.extend(product, fields)

        //H A N D L I N G   F I L E S 
        if(files.photo){

            if(files.photo.size > 3000000) {
                
                return res.status(400).json({
                    error : "File Size Too Big"
                })
            }
            //data will store the path
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, product) => {
            //watch section 10 - 05 - 06:10 
            if(err){
                return res.status(400).json({
                    error : "Failed To Update in DB"
                })
            }
            res.json(product)
        })
      });
}

//Product Listing
exports.getAllProducts = (req, res) => {

    //parseInt because, mostly languages consider queryparameter as string
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    letsortBy = req.query.sortBy ? req.query.sortBy : "_id" //can be any

    Product.find()
    .select("-photo") //- means exclude
    .populate("category")
    .sort([[sortBy, "asc"]]) //Eg: Product.find().sort([['updatedAt', 'descending']])
    .limit(limit)
    .exec((err, products) => {
        
        if(err) {
            return res.status(400).json({
                error : "No Products"
            })
        }

        res.json(products)
    })
}

exports.getAllUniqueCategories = (req, res) => {

    //parameters, options, callback
    Product.distinct("category", {}, (err, category) => {

        if(err){
            return res.status(400).json({
                error : "No Category Found"
            })
        }
        res.json(category)
    })
}

exports.updateStock = (req, res, next) => {
  //bulkwrite : https://mongoosejs.com/docs/api/model.html#model_Model.bulkWrite
  //here, order will have the product added to the cart
  let myOperations = req.body.order.product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id }, //find the product 1st with id
        update: { $inc: { stock: -prod.count, sold: +prod.count } }, //$inc - incriment - syntax is like that
      },
    };
  });

  //parameters, options, callback
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Failed",
      });
    }
    next();
  });
};

