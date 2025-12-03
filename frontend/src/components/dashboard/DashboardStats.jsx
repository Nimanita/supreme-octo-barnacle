// src/components/dashboard/DashboardStats.jsx
import React from 'react';
import { Card } from '../common/Card';

const DashboardStats = ({ stats }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-rose-100 text-rose-600',
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary-500 bg-gradient-to-br from-white to-primary-50/30 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 text-8xl opacity-5 transform translate-x-4 -translate-y-4">
              <Icon />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-lg bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">
                {stat.title}
              </p>
              <p className="text-4xl font-bold text-slate-800">
                {stat.value}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
