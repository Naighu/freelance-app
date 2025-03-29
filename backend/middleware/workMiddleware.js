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


const EditWorkSchema = {
    type: "object",
    properties: {
        work_id:  { type: "string" },
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 10 },
        budget: { type: "number", minimum: 0 },
        category_id: { type: "string" }
    },
    required: ["work_id"],
    additionalProperties: false
};

const validateEditWork = ajv.compile(EditWorkSchema);
const validateEditWorkMiddleware = (req, res, next) => {
    const valid = validateEditWork(req.body);
    if (!valid) {
        return res.status(400).json({ errors: validateEditWork.errors });
    }
    next();
};

const DeleteWorkSchema = {
    type: "object",
    properties: {
        work_id:  { type: "string" }
    },
    required: ["work_id"],
    additionalProperties: false
};

const validateDeleteWork = ajv.compile(DeleteWorkSchema);
const validateDeleteWorkMiddleware = (req, res, next) => {
    const valid = validateDeleteWork(req.body);
    if (!valid) {
        return res.status(400).json({ errors: validateDeleteWork.errors });
    }
    next();
};


const ApplyWorkSchema = {
    type: "object",
    properties: {
        work_id:  { type: "string" },
        message:  { type: "string",minLength: 1 },
        amount: {type: "number"}

    },
    required: ["work_id","message","amount"],
    additionalProperties: false
};

const validateApplyWork = ajv.compile(ApplyWorkSchema);
const validateApplyWorkMiddleware = (req, res, next) => {
    const valid = validateApplyWork(req.body);
    if (!valid) {
        return res.status(400).json({ errors: validateApplyWork.errors });
    }
    next();
};

module.exports = {validateWorkMiddleware,validateAddCategoryiddleware,validateEditWorkMiddleware,validateDeleteWorkMiddleware,validateApplyWorkMiddleware};