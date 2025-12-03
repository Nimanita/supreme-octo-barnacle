// src/components/dashboard/TaskStatusChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';

const TaskStatusChart = ({ data }) => {
  const chartData = [
    { name: 'To Do', count: data?.todo || 0, fill: '#a855f7' },
    { name: 'In Progress', count: data?.in_progress || 0, fill: '#3b82f6' },
    { name: 'Completed', count: data?.completed || 0, fill: '#22c55e' },
  ];
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-slate-200">
          <p className="font-bold text-slate-800">{payload[0].payload.name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].fill }}>
            {payload[0].value} tasks
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="bg-gradient-to-br from-white to-blue-50/30 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Tasks by Status</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#475569', fontWeight: 600 }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#475569', fontWeight: 600 }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="count" radius={[12, 12, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TaskStatusChart;
