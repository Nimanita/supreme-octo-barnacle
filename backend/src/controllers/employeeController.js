const employeeService = require('../services/employeeService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const employeeController = {
  // GET /api/employees
  getAllEmployees: asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await employeeService.getAllEmployees({ page, limit, search });
    
    res.json(ApiResponse.paginated(result.employees, result.pagination));
  }),

  // GET /api/employees/:id
  getEmployeeById: asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(ApiResponse.success(employee));
  }),

  // POST /api/employees
  createEmployee: asyncHandler(async (req, res) => {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(ApiResponse.created(employee));
  }),

  // PUT /api/employees/:id
  updateEmployee: asyncHandler(async (req, res) => {
    const employee = await employeeService.updateEmployee(req.params.id, req.body);
    res.json(ApiResponse.updated(employee));
  }),

  // DELETE /api/employees/:id
  deleteEmployee: asyncHandler(async (req, res) => {
    await employeeService.deleteEmployee(req.params.id);
    res.json(ApiResponse.deleted());
  })
};

module.exports = employeeController;