// src/api/dashboardApi.js
import api from './axios';

export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: async () => {
    return api.get('/dashboard');
  },

  // Get health check
  health: async () => {
    return api.get('/health');
  },
};