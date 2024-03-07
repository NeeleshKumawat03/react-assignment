const Category = require('../models/Category')

exports.createCategory = async(req, res) => {
    try {
        const {name, description} = req.body;

        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const categoryDetails = await Category.create({
            name: name,
            description: description
        })

        console.log(categoryDetails);
        
        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    }   
    catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.showAllCategories = async(req, res) => {
    try {
        const allCategory = await Category.find({}, { name: true, description: true});
        res.status(200).json({
            success: true,
            message: "All Category returned Successfully",
            allCategory
        })
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.categoryPageDetails = async(req, res) => {
    try {
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId).populate("courses").exec();

        if(!selectedCourses) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            })
        }

        const differentCategories = await Category.find({
            _id: {ne: categoryId},
        })
        .populate("courses")
        .exec();

        // top selleing Courese

        return res.status(200).json({
            success: true,
            dat : {
                selectedCategory,
                differentCategories
            }
        })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}