// src/pages/TaskDetail.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Edit, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTask } from '@/hooks/useTasks';
import { taskApi } from '@/api/taskApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/common/Card';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import TaskForm from '@/components/tasks/TaskForm';
import { Toast } from '@/components/common/Toast';
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
  const { toasts, success, error: showError, removeToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskApi.delete(id);
      success('Task deleted successfully');
      setTimeout(() => navigate('/tasks'), 1000);
    } catch (err) {
      showError(err.message || 'Failed to delete task');
    }
  };
  
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };
  
  const handleUpdate = async (formData) => {
    try {
      await taskApi.update(id, formData);
      success('Task updated successfully');
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (err) {
      showError(err.message || 'Failed to update task');
      throw err;
    }
  };
  
  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-600 font-semibold">Error: {error}</p>
        <Link to="/tasks" className="text-primary-600 hover:underline mt-4 inline-block font-medium">
          Back to Tasks
        </Link>
      </div>
    );
  }
  
  if (!data) return null;
  
  const task = data.task || data;
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
  
  return (
    <>
      <Toast toasts={toasts} onClose={removeToast} />
      
      <div className="space-y-6 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors font-medium group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tasks
        </Link>
        
        {/* Task Header Card */}
        <Card className="bg-gradient-to-br from-white to-primary-50/30 border-l-4 border-primary-500">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-800 mb-3">{task.title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm', getStatusColor(task.status))}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className={cn('px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm', getPriorityColor(task.priority))}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    {overdue && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 shadow-sm flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4" />
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                leftIcon={<Edit className="h-4 w-4" />}
                onClick={handleEdit}
                className="font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={handleDelete}
                className="font-semibold"
              >
                Delete
              </Button>
            </div>
          </div>
          
          {/* Description Section */}
          {task.description && (
            <div className="mb-6 p-4 bg-white/50 rounded-xl border-2 border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary-600"></div>
                Description
              </h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{task.description}</p>
            </div>
          )}
          
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t-2 border-slate-100">
            {/* Assigned To */}
            <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <div className="flex items-center gap-2 text-sm text-purple-700 mb-2 font-semibold">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <User className="h-4 w-4" />
                </div>
                Assigned To
              </div>
              {task.assignedTo ? (
                <Link
                  to={`/employees/${task.assignedTo._id || task.assignedTo}`}
                  className="text-purple-700 hover:text-purple-800 font-bold text-lg transition-colors"
                >
                  {task.assignedTo.name || 'View Employee'}
                </Link>
              ) : (
                <span className="text-slate-500 font-medium">Unassigned</span>
              )}
            </div>
            
            {/* Due Date */}
            <div className={cn("p-4 rounded-xl border-2 transition-colors", 
              overdue ? "bg-rose-50 border-rose-100 hover:border-rose-200" : "bg-blue-50 border-blue-100 hover:border-blue-200"
            )}>
              <div className={cn("flex items-center gap-2 text-sm mb-2 font-semibold", 
                overdue ? "text-rose-700" : "text-blue-700"
              )}>
                <div className={cn("p-1.5 rounded-lg", overdue ? "bg-rose-100" : "bg-blue-100")}>
                  <Calendar className="h-4 w-4" />
                </div>
                Due Date
              </div>
              <div className={cn("font-bold text-lg", overdue ? "text-rose-700" : "text-blue-700")}>
                {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
              </div>
            </div>
            
            {/* Created At */}
            <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-100 hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-2 text-sm text-emerald-700 mb-2 font-semibold">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                Created
              </div>
              <div className="text-emerald-700 font-bold text-lg">{formatDateTime(task.createdAt)}</div>
            </div>
            
            {/* Completed At */}
            {task.completedAt && (
              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-100 hover:border-green-200 transition-colors">
                <div className="flex items-center gap-2 text-sm text-green-700 mb-2 font-semibold">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  Completed
                </div>
                <div className="text-green-700 font-bold text-lg">{formatDateTime(task.completedAt)}</div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
          size="lg"
        >
          <TaskForm
            initialData={task}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      </div>
    </>
  );
};

export default TaskDetail;

