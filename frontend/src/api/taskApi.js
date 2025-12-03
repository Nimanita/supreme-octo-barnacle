// src/api/taskApi.js
import api from './axios';

export const taskApi = {
  // Get all tasks with filters, pagination, and search
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '', status, priority, assignedTo } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignedTo && { assignedTo }),
    });
    return api.get(`/tasks?${queryParams}`);
  },

  // Get single task by ID
  getById: async (id) => {
    return api.get(`/tasks/${id}`);
  },

  // Create new task
  create: async (data) => {
    return api.post('/tasks', data);
  },

  // Update task
  update: async (id, data) => {
    return api.put(`/tasks/${id}`, data);
  },

  // Update task status (for optimistic updates)
  updateStatus: async (id, status) => {
    return api.put(`/tasks/${id}`, { status });
  },

  // Delete task
  delete: async (id) => {
    return api.delete(`/tasks/${id}`);
  },
};