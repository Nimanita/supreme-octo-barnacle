class ApiResponse {
  static success(data, meta = null) {
    const response = {
      success: true,
      data
    };

    if (meta) {
      response.meta = meta;
    }

    return response;
  }

  static created(data, message = 'Resource created successfully') {
    return {
      success: true,
      message,
      data
    };
  }

  static updated(data, message = 'Resource updated successfully') {
    return {
      success: true,
      message,
      data
    };
  }

  static deleted(message = 'Resource deleted successfully') {
    return {
      success: true,
      message
    };
  }

  static paginated(data, pagination) {
    return {
      success: true,
      data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: pagination.totalItems,
        totalPages: Math.ceil(pagination.totalItems / pagination.limit)
      }
    };
  }
}

module.exports = ApiResponse;