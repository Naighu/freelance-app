 const Work = require("../models/Work");
const Category = require("../models/Category");



const postWork = async (req, res) => { 
    try{
        const {title,description,budget,category_id} = req.body;

    //Check if the category already exists
     const category = await Category.findById(category_id)
     
     if(!category){
        return res.status(400).json({ message: 'Category does not exists' })
     }
    

     const work = await Work.create({ title, description, budget, category: category.name,user_id: req.user.id });

     return res.status(201).json(work)
    }catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { postWork};