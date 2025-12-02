const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const Logger = require('../config/logger');

class EmployeeService {
  /**
   * Get all employees with pagination and search
   */
  async getAllEmployees({ page = 1, limit = 10, search = '' }) {
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

      // Build search query
      const query = {};
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      // Execute query with pagination
      const [employees, totalItems] = await Promise.all([
        Employee.find(query)
          .skip(skip)
          .limit(parsedLimit)
          .sort({ createdAt: -1 })
          .lean(),
        Employee.countDocuments(query)
      ]);

      Logger.info('Employees fetched', { 
        page: parsedPage, 
        limit: parsedLimit, 
        totalItems,
        search 
      });

      return {
        employees,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalItems,
          totalPages: Math.ceil(totalItems / parsedLimit)
        }
      };
    } catch (error) {
      Logger.error('Error fetching employees', { error: error.message });
      throw error;
    }
  }

  /**
   * Get single employee by ID with their tasks
   */
  async getEmployeeById(id) {
    try {
      const employee = await Employee.findById(id)
        .populate({
          path: 'tasks',
          options: { sort: { createdAt: -1 } }
        })
        .lean();

      if (!employee) {
        throw ApiError.notFound('Employee not found');
      }

      Logger.info('Employee fetched by ID', { employeeId: id });
      return employee;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      Logger.error('Error fetching employee by ID', { 
        employeeId: id, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData) {
    try {
      const employee = await Employee.create(employeeData);
      Logger.info('Employee created', { employeeId: employee._id });
      return employee.toObject();
    } catch (error) {
      Logger.error('Error creating employee', { 
        data: employeeData, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id, updateData) {
    try {
      const employee = await Employee.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!employee) {
        throw ApiError.notFound('Employee not found');
      }

      Logger.info('Employee updated', { employeeId: id });
      return employee;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      Logger.error('Error updating employee', { 
        employeeId: id, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Delete employee (cascades to tasks)
   */
  async deleteEmployee(id) {
    try {
      const employee = await Employee.findById(id);

      if (!employee) {
        throw ApiError.notFound('Employee not found');
      }

      // Use deleteOne on document to trigger pre-remove hook
      await employee.deleteOne();

      Logger.info('Employee deleted', { employeeId: id });
      return { deleted: true };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      Logger.error('Error deleting employee', { 
        employeeId: id, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Check if employee exists
   */
  async employeeExists(id) {
    try {
      const exists = await Employee.exists({ _id: id });
      return !!exists;
    } catch (error) {
      Logger.error('Error checking employee existence', { 
        employeeId: id, 
        error: error.message 
      });
      return false;
    }
  }
}

module.exports = new EmployeeService();