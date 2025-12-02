const Joi = require('joi');

const employeeValidators = {
  create: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
      }),
    role: Joi.string()
      .max(50)
      .allow('', null)
      .messages({
        'string.max': 'Role cannot exceed 50 characters'
      })
  }),

  update: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    email: Joi.string()
      .email()
      .messages({
        'string.email': 'Invalid email format'
      }),
    role: Joi.string()
      .max(50)
      .allow('', null)
      .messages({
        'string.max': 'Role cannot exceed 50 characters'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  })
};

module.exports = employeeValidators;