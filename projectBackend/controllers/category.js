const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, categ) => {

        if(err){
            return res.staus(400).json({
                error : "Category Not Found"
            })
        }

        req.category = categ;
        next();
    })

    
};

exports.createCategory = (req, res) => {

    const category = new Category(req.body);
    category.save((err, category) => {

        if(err){
            return res.staus(400).json({
                error : "Not able to save Category in DB"
            })
        }

        res.json({category})
    })

}

exports.getCategory = (req, res) => {

    return res.json(req.category);
}


exports.getAllCategory = (req, res) => {

    Category.find().exec((err, categories) => {

        if(err){
            return res.staus(400).json({
                error : "No Categories found in DB"
            })
        }

        res.json({categories})
    }) 
}