// src/pages/Dashboard.jsx
import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/common/Card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TaskStatusChart from '@/components/dashboard/TaskStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import { Users, CheckSquare, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data, loading, error } = useDashboard();
  
  if (loading) return <Loading size="lg" text="Loading dashboard..." />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-600 font-semibold">Error loading dashboard: {error}</p>
      </div>
    );
  }
  
  const stats = [
    {
      title: 'Total Employees',
      value: data?.employees || 0,
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Tasks',
      value: data?.totalTasks || 0,
      icon: CheckSquare,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Completed Tasks',
      value: data?.completedTasks || 0,
      icon: CheckSquare,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Completion Rate',
      value: `${data?.completionRate || 0}%`,
      icon: TrendingUp,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-primary-100 text-lg">
          Track your team's performance and task progress at a glance
        </p>
      </div>
      
      {/* Stats Grid */}
      <DashboardStats stats={stats} />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskStatusChart data={data?.statusCounts} />
        <PriorityChart data={data?.priorityCounts} />
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-rose-50 to-rose-100/50 border-l-4 border-rose-500 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Overdue Tasks</h3>
              </div>
              <div className="text-4xl font-bold text-rose-600 mb-2">
                {data?.overdueTasks || 0}
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Tasks that need immediate attention
              </p>
            </div>
            <div className="text-6xl opacity-10">⚠️</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Avg. Completion Time</h3>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {data?.avgCompletionTime ? `${data.avgCompletionTime}d` : 'N/A'}
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Average days to complete tasks
              </p>
            </div>
            <div className="text-6xl opacity-10">⏱️</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;