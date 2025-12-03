const Task = require('../models/task');
const ApiError = require('../utils/ApiError');
const Logger = require('../config/logger');
const redis = require("../config/redis");

class TaskService {
  /**
   * Get all tasks with pagination, search, and filters
   */
  async getAllTasks({ 
    page = 1, 
    limit = 10, 
    search = '', 
    status = '', 
    priority = '', 
    assignedTo = '' 
  }) {
    try {
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);

      // Validate pagination parameters
      if (parsedPage < 1) {
        throw ApiError.badRequest('Page must be greater than 0');
      }
      if (parsedLimit < 1 || parsedLimit > 100) {
        throw ApiError.badRequest('Limit must be between 1 and 100');
      }

      const skip = (parsedPage - 1) * parsedLimit;

      // Build filter query
      const query = {};
      
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }
      
      if (status && ['todo', 'in_progress', 'completed'].includes(status)) {
        query.status = status;
      }
      
      if (priority && ['low', 'medium', 'high'].includes(priority)) {
        query.priority = priority;
      }
      
      if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      // Execute query with pagination
      const [tasks, totalItems] = await Promise.all([
        Task.find(query)
          .populate('assignedTo', 'name email')
          .skip(skip)
          .limit(parsedLimit)
          .sort({ createdAt: -1 })
          .lean(),
        Task.countDocuments(query)
      ]);

      Logger.info('Tasks fetched', { 
        page: parsedPage, 
        limit: parsedLimit, 
        totalItems,
        filters: { search, status, priority, assignedTo }
      });

      return {
        tasks,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalItems,
          totalPages: Math.ceil(totalItems / parsedLimit)
        }
      };
    } catch (error) {
      Logger.error('Error fetching tasks', { error: error.message });
      throw error;
    }
  }

  /**
   * Get single task by ID
   */
  async getTaskById(id) {
    try {
      const task = await Task.findById(id)
        .populate('assignedTo', 'name email')
        .lean();

      if (!task) {
        throw ApiError.notFound('Task not found');
      }

      Logger.info('Task fetched by ID', { taskId: id });
      return task;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      Logger.error('Error fetching task by ID', { 
        taskId: id, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Create new task
   */
  async createTask(taskData) {
    try {
      // Validate assignedTo employee exists if provided
      if (taskData.assignedTo) {
        const employeeService = require('./employeeService');
        const exists = await employeeService.employeeExists(taskData.assignedTo);
        if (!exists) {
          throw ApiError.badRequest('Assigned employee does not exist');
        }
      }

      const task = await Task.create(taskData);
      
      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .lean();

      Logger.info('Task created', { taskId: task._id });
      await redis.del("dashboard:metrics");
      return populatedTask;
    } catch (error) {
      Logger.error('Error creating task', { 
        data: taskData, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Update task
   */
  async updateTask(id, updateData) {
    try {
      // Validate assignedTo employee exists if provided
      if (updateData.assignedTo) {
        const employeeService = require('./employeeService');
        const exists = await employeeService.employeeExists(updateData.assignedTo);
        if (!exists) {
          throw ApiError.badRequest('Assigned employee does not exist');
        }
      }

      const task = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email').lean();

      if (!task) {
        throw ApiError.notFound('Task not found');
      }

      Logger.info('Task updated', { taskId: id });
      await redis.del("dashboard:metrics");
      return task;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      Logger.error('Error updating task', { 
        taskId: id, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Delete task
   */
  async deleteTask(id) {
    try {
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        throw ApiError.notFound('Task not found');
      }

      Logger.info('Task deleted', { taskId: id });
      await redis.del("dashboard:metrics");
      return { deleted: true };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      Logger.error('Error deleting task', { 
        taskId: id, 
        error: error.message 
      });
      throw error;
    }
  }
}

module.exports = new TaskService();