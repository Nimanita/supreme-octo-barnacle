const Task = require('../models/task');
const Employee = require('../models/employee');
const Logger = require('../config/logger');

class DashboardService {
  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics() {
    try {
      const [
        statusCounts,
        priorityCounts,
        tasksByEmployee,
        overdueCount,
        avgCompletionTime,
        totalEmployees,
        totalTasks
      ] = await Promise.all([
        this.getStatusCounts(),
        this.getPriorityCounts(),
        this.getTasksByEmployee(),
        this.getOverdueTasksCount(),
        this.getAverageCompletionTime(),
        this.getTotalEmployees(),
        this.getTotalTasks()
      ]);

      const completionRate = this.calculateCompletionRate(statusCounts);
      const completedTasks = statusCounts.completed;

      const metrics = {
        // Top-level stats for stat cards
        employees: totalEmployees,
        totalTasks: totalTasks,
        completedTasks: completedTasks,
        completionRate: completionRate,
        
        // Chart data
        statusCounts,
        priorityCounts,
        
        // Additional metrics
        tasksByEmployee,
        overdueTasks: overdueCount,
        avgCompletionTime: avgCompletionTime.formatted
      };

      Logger.info('Dashboard metrics fetched', { metrics });
      return metrics;
    } catch (error) {
      Logger.error('Error fetching dashboard metrics', { error: error.message });
      throw error;
    }
  }

  /**
   * Get total number of employees
   */
  async getTotalEmployees() {
    return await Employee.countDocuments();
  }

  /**
   * Get total number of tasks
   */
  async getTotalTasks() {
    return await Task.countDocuments();
  }

  /**
   * Get task counts by status
   */
  async getStatusCounts() {
    const result = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      todo: 0,
      in_progress: 0,
      completed: 0
    };

    result.forEach(item => {
      counts[item._id] = item.count;
    });

    return counts;
  }

  /**
   * Get task counts by priority
   */
  async getPriorityCounts() {
    const result = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      low: 0,
      medium: 0,
      high: 0
    };

    result.forEach(item => {
      counts[item._id] = item.count;
    });

    return counts;
  }

  /**
   * Get tasks grouped by employee
   */
  async getTasksByEmployee() {
    const result = await Task.aggregate([
      {
        $match: { assignedTo: { $ne: null } }
      },
      {
        $group: {
          _id: '$assignedTo',
          taskCount: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          todo: {
            $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $project: {
          employeeId: '$_id',
          employeeName: '$employee.name',
          employeeEmail: '$employee.email',
          taskCount: 1,
          completed: 1,
          inProgress: 1,
          todo: 1
        }
      },
      {
        $sort: { taskCount: -1 }
      }
    ]);

    return result;
  }

  /**
   * Calculate completion rate
   */
  calculateCompletionRate(statusCounts) {
    const total = statusCounts.todo + statusCounts.in_progress + statusCounts.completed;
    if (total === 0) return 0;
    return Math.round((statusCounts.completed / total) * 100);
  }

  /**
   * Get count of overdue tasks
   */
  async getOverdueTasksCount() {
    const now = new Date();
    const count = await Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    });
    return count;
  }

  /**
   * Calculate average completion time in hours
   */
  async getAverageCompletionTime() {
    const result = await Task.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $ne: null }
        }
      },
      {
        $project: {
          completionDuration: {
            $subtract: ['$completedAt', '$createdAt']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$completionDuration' }
        }
      }
    ]);

    if (result.length === 0 || !result[0].avgDuration) {
      return {
        hours: 0,
        days: 0,
        formatted: 'N/A'
      };
    }

    // Convert milliseconds to hours
    const avgMilliseconds = result[0].avgDuration;
    const avgHours = Math.round(avgMilliseconds / (1000 * 60 * 60) * 10) / 10;
    const avgDays = Math.round(avgMilliseconds / (1000 * 60 * 60 * 24) * 10) / 10;

    return {
      hours: avgHours,
      days: avgDays,
      formatted: avgDays >= 1 
        ? `${avgDays}` 
        : `${avgHours}`
    };
  }
}

module.exports = new DashboardService();