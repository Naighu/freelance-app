const Work = require("../models/Work");


const postWork = async (req, res) => { 
    const {title,description,budget,category} = req.body;

     const work = await Work.create({ title, description, budget,category });

     return res.status(201).json(work)
}

module.exports = { postWork};