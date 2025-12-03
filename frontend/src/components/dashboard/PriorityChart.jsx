// src/components/dashboard/PriorityChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card } from '../common/Card';
import { Flag } from 'lucide-react';

const PriorityChart = ({ data }) => {
  const chartData = [
    { name: 'Low', value: data?.low || 0, color: '#10b981' },
    { name: 'Medium', value: data?.medium || 0, color: '#f97316' },
    { name: 'High', value: data?.high || 0, color: '#f43f5e' },
  ];
  
  const COLORS = ['#10b981', '#f97316', '#f43f5e'];
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-xl border-2 border-slate-200">
          <p className="font-bold text-slate-800">{payload[0].name} Priority</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} tasks
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card className="bg-gradient-to-br from-white to-orange-50/30 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-xl">
          <Flag className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Tasks by Priority</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={3}
            stroke="#fff"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span className="font-semibold text-slate-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PriorityChart;