const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const dashboardController = {
  // GET /api/dashboard
  getDashboard: asyncHandler(async (req, res) => {
    const metrics = await dashboardService.getDashboardMetrics();
    res.json(ApiResponse.success(metrics));
  })
};

module.exports = dashboardController;