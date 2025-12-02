const taskService = require('../services/taskService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../middleware/asyncHandler');

const taskController = {
  // GET /api/tasks
  getAllTasks: asyncHandler(async (req, res) => {
    const { page, limit, search, status, priority, assignedTo } = req.query;
    const result = await taskService.getAllTasks({ 
      page, 
      limit, 
      search, 
      status, 
      priority, 
      assignedTo 
    });
    
    res.json(ApiResponse.paginated(result.tasks, result.pagination));
  }),

  // GET /api/tasks/:id
  getTaskById: asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id);
    res.json(ApiResponse.success(task));
  }),

  // POST /api/tasks
  createTask: asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body);
    res.status(201).json(ApiResponse.created(task));
  }),

  // PUT /api/tasks/:id
  updateTask: asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(ApiResponse.updated(task));
  }),

  // DELETE /api/tasks/:id
  deleteTask: asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    res.json(ApiResponse.deleted());
  })
};

module.exports = taskController;