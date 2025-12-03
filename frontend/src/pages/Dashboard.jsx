// src/pages/Dashboard.jsx
import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/common/Card';
import DashboardStats from '@/components/dashboard/DashboardStats';
import TaskStatusChart from '@/components/dashboard/TaskStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import { Users, CheckSquare, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { data, loading, error } = useDashboard();
  
  if (loading) return <Loading size="lg" text="Loading dashboard..." />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }
  
  const stats = [
    {
      title: 'Total Employees',
      value: data?.employees || 0,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Tasks',
      value: data?.totalTasks || 0,
      icon: CheckSquare,
      color: 'purple',
    },
    {
      title: 'Completed Tasks',
      value: data?.completedTasks || 0,
      icon: CheckSquare,
      color: 'green',
    },
    {
      title: 'Completion Rate',
      value: `${data?.completionRate || 0}%`,
      icon: TrendingUp,
      color: 'orange',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your team's tasks and performance
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
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Tasks</h3>
          <div className="text-3xl font-bold text-red-600">
            {data?.overdueTasks || 0}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Tasks past their due date
          </p>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Avg. Completion Time
          </h3>
          <div className="text-3xl font-bold text-blue-600">
            {data?.avgCompletionTime ? `${data.avgCompletionTime} days` : 'N/A'}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Average time to complete tasks
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;