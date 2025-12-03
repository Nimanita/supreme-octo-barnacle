// src/hooks/useEmployees.js
import { useState, useEffect } from 'react';
import { employeeApi } from '@/api/employeeApi';

export const useEmployees = (params = {}) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeApi.getAll(params);
      setData(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmployees();
  }, [JSON.stringify(params)]);
  
  const refetch = () => fetchEmployees();
  
  return { data, meta, loading, error, refetch };
};

export const useEmployee = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchEmployee = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await employeeApi.getById(id);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEmployee();
  }, [id]);
  
  const refetch = () => fetchEmployee();
  
  return { data, loading, error, refetch };
};

