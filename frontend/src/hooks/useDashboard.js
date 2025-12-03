// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { dashboardApi } from '@/api/dashboardApi';

export const useDashboard = () => {
  const [data, setData] = useState(() => {
    const cached = sessionStorage.getItem('dashboard-cache');
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(() => !sessionStorage.getItem('dashboard-cache'));
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const response = await dashboardApi.getMetrics();

        if (!mounted) return;

        setData(response.data);

        // 🔥 Cache the data for instant reload next time
        sessionStorage.setItem('dashboard-cache', JSON.stringify(response.data));

        // Loading ends only if this was the first request
        setLoading(false);
      } catch (err) {
        if (!mounted) return;

        setError(err.message || 'Failed to load dashboard');
        setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
};
