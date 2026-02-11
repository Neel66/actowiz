const Joi = require('joi');

const createBugSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Bug title is required',
      'string.min': 'Bug title must be at least 5 characters long',
      'string.max': 'Bug title must not exceed 100 characters',
      'any.required': 'Bug title is required',
    }),

  description: Joi.string()
    .min(10)
    .max(1000)
    .trim()
    .required()
    .messages({
      'string.empty': 'Bug description is required',
      'string.min': 'Bug description must be at least 10 characters long',
      'string.max': 'Bug description must not exceed 1000 characters',
      'any.required': 'Bug description is required',
    }),

  bountyAmount: Joi.number()
    .min(0)
    .max(1000000)
    .required()
    .messages({
      'number.base': 'Bounty amount must be a number',
      'number.min': 'Bounty amount must be at least 0',
      'number.max': 'Bounty amount must not exceed 1,000,000',
      'any.required': 'Bounty amount is required',
    }),

  isConfigurable: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Configurable must be a boolean',
    }),

  status: Joi.string()
    .valid('Open', 'In Review', 'Closed')
    .default('Open')
    .messages({
      'any.only': 'Status must be one of: Open, In Review, Closed',
    }),
});

const validateCreateBug = (req, res, next) => {
  const { error, value } = createBugSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      message: 'Validation failed',
      errors,
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateCreateBug,
};
