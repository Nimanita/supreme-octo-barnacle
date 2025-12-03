// src/api/employeeApi.js
import api from './axios';

export const employeeApi = {
  // Get all employees with pagination and search
  getAll: async (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    return api.get(`/employees?${queryParams}`);
  },

  // Get single employee by ID with tasks
  getById: async (id) => {
    return api.get(`/employees/${id}`);
  },

  // Create new employee
  create: async (data) => {
    return api.post('/employees', data);
  },

  // Update employee
  update: async (id, data) => {
    return api.put(`/employees/${id}`, data);
  },

  // Delete employee
  delete: async (id) => {
    return api.delete(`/employees/${id}`);
  },
};