// src/utils/errorHandler.js

/**
 * Extract error message from various error formats
 * @param {Error|Object} error - The error object
 * @param {string} defaultMessage - Default message if no specific error found
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  // Check for API response errors
  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;
    
    // Try to get message from various possible locations
    if (data?.message) {
      return data.message;
    }
    
    if (data?.error) {
      return typeof data.error === 'string' ? data.error : data.error.message;
    }
    
    if (data?.errors && Array.isArray(data.errors)) {
      // Multiple validation errors
      return data.errors.map(err => err.message || err).join(', ');
    }
    
    // HTTP status-based messages
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${status}`;
    }
  }
  
  // Check for network errors
  if (error.request) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Check for error message property
  if (error.message) {
    return error.message;
  }
  
  // If error is a string
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback to default message
  return defaultMessage;
};

/**
 * Handle API errors with toast notifications
 * @param {Error|Object} error - The error object
 * @param {Function} showError - Toast error function
 * @param {string} defaultMessage - Default message if no specific error found
 */
export const handleApiError = (error, showError, defaultMessage) => {
  const message = getErrorMessage(error, defaultMessage);
  showError(message);
  console.error('API Error:', error);
};