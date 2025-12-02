const ApiError = require('../utils/ApiError');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        issue: detail.message.replace(/['"]/g, '')
      }));

      const err = ApiError.validationError('Validation failed', details);
      return next(err);
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

module.exports = validateRequest;