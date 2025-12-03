// src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import { taskApi } from '@/api/taskApi';

export const useTasks = (params = {}) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskApi.getAll(params);
      setData(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [JSON.stringify(params)]);
  
  const refetch = () => fetchTasks();
  
  // Optimistic update for status change
  const updateTaskStatus = async (taskId, newStatus) => {
    const originalData = [...data];
    
    try {
      // Optimistic update
      setData(prevData => 
        prevData.map(task => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      // API call
      await taskApi.updateStatus(taskId, newStatus);
      
      return { success: true };
    } catch (err) {
      // Rollback on error
      setData(originalData);
      return { success: false, error: err.message };
    }
  };
  
  return { data, meta, loading, error, refetch, updateTaskStatus };
};

export const useTask = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await taskApi.getById(id);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [id]);
  
  return { data, loading, error };
};

