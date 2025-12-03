// src/components/dashboard/PriorityChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../common/Card';

const PriorityChart = ({ data }) => {
  const chartData = [
    { name: 'Low', value: data?.low || 0 },
    { name: 'Medium', value: data?.medium || 0 },
    { name: 'High', value: data?.high || 0 },
  ];
  
  const COLORS = ['#9ca3af', '#eab308', '#ef4444'];
  
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriorityChart;