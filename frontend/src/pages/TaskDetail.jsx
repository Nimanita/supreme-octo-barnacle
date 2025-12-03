// src/pages/TaskDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useTask } from '@/hooks/useTasks';
import { taskApi } from '@/api/taskApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/common/Card';
import Button from '@/components/common/Button';
import {
  formatDate,
  formatDateTime,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  isOverdue,
  cn,
} from '@/utils/helpers';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useTask(id);
  const { success, error: showError } = useToast();
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskApi.delete(id);
      success('Task deleted successfully');
      navigate('/tasks');
    } catch (err) {
      showError(err.message || 'Failed to delete task');
    }
  };
  
  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <Link to="/tasks" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Tasks
        </Link>
      </div>
    );
  }
  
  if (!data) return null;
  
  const task = data.task || data;
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
  
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <Link
        to="/tasks"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>
      
      {/* Task Header */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('badge', getStatusColor(task.status))}>
                {getStatusLabel(task.status)}
              </span>
              <span className={cn('badge', getPriorityColor(task.priority))}>
                {getPriorityLabel(task.priority)}
              </span>
              {overdue && (
                <span className="badge bg-red-100 text-red-800">
                  Overdue
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => navigate('/tasks')}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        
        {/* Description */}
        {task.description && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
        
        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          {/* Assigned To */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User className="h-4 w-4" />
              <span className="font-medium">Assigned To</span>
            </div>
            {task.assignedTo ? (
              <Link
                to={`/employees/${task.assignedTo._id || task.assignedTo}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {task.assignedTo.name || 'View Employee'}
              </Link>
            ) : (
              <span className="text-gray-500">Unassigned</span>
            )}
          </div>
          
          {/* Due Date */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Due Date</span>
            </div>
            <div className={overdue ? 'text-red-600 font-medium' : ''}>
              {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
            </div>
          </div>
          
          {/* Created At */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Created</span>
            </div>
            <div>{formatDateTime(task.createdAt)}</div>
          </div>
          
          {/* Completed At */}
          {task.completedAt && (
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Completed</span>
              </div>
              <div>{formatDateTime(task.completedAt)}</div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskDetail;

