// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { dashboardApi } from '@/api/dashboardApi';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardApi.getMetrics();
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);
  
  return { data, loading, error };
};