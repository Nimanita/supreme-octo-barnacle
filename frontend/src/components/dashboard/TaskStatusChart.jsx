// src/components/dashboard/TaskStatusChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';

const TaskStatusChart = ({ data }) => {
  const chartData = [
    { name: 'To Do', count: data?.todo || 0, fill: '#9ca3af' },
    { name: 'In Progress', count: data?.in_progress || 0, fill: '#3b82f6' },
    { name: 'Completed', count: data?.completed || 0, fill: '#22c55e' },
  ];
  
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TaskStatusChart;
