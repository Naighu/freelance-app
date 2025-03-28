const Work = require("../models/Work");
const Category = require("../models/Category");



const postWork = async (req, res) => { 
    const {title,description,budget,category_id} = req.body;

    //Check if the category already exists
     const category = await Category.findById(category_id)
     
     if(!category){
        return res.status(400).json({ message: 'Category does not exists' })
     }
    

     const work = await Work.create({ title, description, budget, category: category.name });

     return res.status(201).json(work)
}

module.exports = { postWork};