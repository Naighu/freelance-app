const Work = require("../models/Work");
const Category = require("../models/Category");


const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = await Category.create({ name })

        return res.status(201).json(category)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()

        return res.status(201).json(categories)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const postWork = async (req, res) => {
    try {
        const { title, description, budget, category_id } = req.body;

        //Check if the category already exists
        const category = await Category.findById(category_id)

        if (!category) {
            return res.status(400).json({ message: 'Category does not exists' })
        }
        const work = await Work.create({ title, description, budget, category: category.name, user_id: req.user.id });

        return res.status(201).json(work)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editWork = async (req, res) => {
    try {
        const { work_id,title, description, budget, category_id } = req.body;

        // Find the existing work by ID
        const work = await Work.findById(work_id);
        if (!work) {
            return res.status(404).json({ message: 'Work not found' });
        }

        
    

        // Check if the logged-in user is the owner of the work
        if (!work.user_id.equals(req.user._id)) {
            return res.status(403).json({ message: 'Unauthorized to edit this work' });
        }

        let updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (budget) updateFields.budget = budget;

        // If category_id is provided, fetch category and update
        if (category_id) {
            const category = await Category.findById(category_id);
            if (!category) {
                return res.status(400).json({ message: 'Category does not exist' });
            }
            updateFields.category = category.name;
        }

        // Update the work with the provided fields
        const updatedWork = await Work.findByIdAndUpdate(work_id, { $set: updateFields }, { new: true });

        return res.status(200).json(updatedWork);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteWork = async (req, res) => {
    const { work_id} = req.body;

    const work = await Work.findById(work_id);
        if (!work) {
            return res.status(404).json({ message: 'Work not found' });
        }

     // Check if the logged-in user is the owner of the work
     if (!work.user_id.equals(req.user._id)) {
        return res.status(403).json({ message: 'Unauthorized to delete this work' });
    }

    await Work.deleteOne(work._id)
    return res.status(200).json({message: 'Deleted'})
}

//This function retuns all the works posted by the client,if the user type is client
//Otherwise return all the works.
const fetchAllWork = async (req, res) => {
    try {
        
        if (req.user && req.user.user_type === 'client') {
            const myWorks = await Work.find({ user_id: req.user.id })

            return res.status(200).json(myWorks)
        } else {
            const allWorks = await Work.find()
            return res.status(200).json(allWorks)
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const fetchWorkById = async (req, res) => {
    try {
       const {id} = req.params;

     const work= await Work.findById(id).populate('applied_users.user_id')

     return res.status(200).json(work)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const applyWork = async (req, res) => { 
    try {
        
        if (req.user.user_type === 'client') {
            

            return res.status(400).json({message: "Workers can apply for the work"})
        }

        const { work_id, message, amount } = req.body;

         // Find the job the worker wants to apply for
         const work = await Work.findById(work_id);
         if (!work) {
             return res.status(404).json({ message: "Job not found" });
         }

         

        //Check if the worker already applied
        const existingApplication = work.applied_users.find(application => application.user_id.equals(req.user._id.toString()));
        if (existingApplication) {

            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const appliedUser = {
            user_id: req.user._id,
            message: message,
            amount: amount
        };

        // push new entry
        work.applied_users.push(appliedUser);

        // Save the updated work document
        await work.save();
        res.status(200).json(work);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { postWork, addCategory, getCategories, fetchAllWork ,fetchWorkById,editWork,deleteWork,applyWork};