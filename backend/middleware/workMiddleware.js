const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });


const workSchema = {
    type: "object",
    properties: {
        title: { type: "string", minLength: 3 },
        description: { type: "string", minLength: 10 },
        budget: { type: "number", minimum: 0 },
        category: { type: "string" }
    },
    required: ["title", "description", "budget", "category"],
    additionalProperties: false
};

const validatePostWork = ajv.compile(workSchema);
const validateWorkMiddleware = (req, res, next) => {
    const valid = validatePostWork(req.body);
    if (!valid) {
        return res.status(400).json({ errors: validatePostWork.errors });
    }
    next();
};

module.exports = {validateWorkMiddleware};