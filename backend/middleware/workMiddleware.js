const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });


const postWorkSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 10 },
        budget: { type: "number", minimum: 0 },
        category_id: { type: "string" }
    },
    required: ["title", "description", "budget", "category_id"],
    additionalProperties: false
};

const validatePostWork = ajv.compile(postWorkSchema);
const validateWorkMiddleware = (req, res, next) => {
    const valid = validatePostWork(req.body);
    if (!valid) {
        return res.status(400).json({ errors: validatePostWork.errors });
    }
    next();
};

const AddCategorySchema = {
    type: "object",
    properties: {
        name: { type: "string", minLength: 0 },
    },
    required: ["name"],
    additionalProperties: false
};

const validateAddCategory = ajv.compile(AddCategorySchema);
const validateAddCategoryiddleware = (req, res, next) => {
    const valid = validateAddCategory(req.body);
    if (!valid) {
        return res.status(400).json({ errors: validateAddCategory.errors });
    }
    next();
};

module.exports = {validateWorkMiddleware,validateAddCategoryiddleware};