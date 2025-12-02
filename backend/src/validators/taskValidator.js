const Joi = require('joi');

const taskValidators = {
  create: Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
      }),
    description: Joi.string()
      .max(1000)
      .allow('', null)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    status: Joi.string()
      .valid('todo', 'in_progress', 'completed')
      .default('todo')
      .messages({
        'any.only': 'Status must be one of: todo, in_progress, completed'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .default('medium')
      .messages({
        'any.only': 'Priority must be one of: low, medium, high'
      }),
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Invalid employee ID format'
      }),
    dueDate: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'Invalid date format for dueDate'
      })
  }),

  update: Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title cannot exceed 200 characters'
      }),
    description: Joi.string()
      .max(1000)
      .allow('', null)
      .messages({
        'string.max': 'Description cannot exceed 1000 characters'
      }),
    status: Joi.string()
      .valid('todo', 'in_progress', 'completed')
      .messages({
        'any.only': 'Status must be one of: todo, in_progress, completed'
      }),
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .messages({
        'any.only': 'Priority must be one of: low, medium, high'
      }),
    assignedTo: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Invalid employee ID format'
      }),
    dueDate: Joi.date()
      .allow(null)
      .messages({
        'date.base': 'Invalid date format for dueDate'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  })
};

module.exports = taskValidators;