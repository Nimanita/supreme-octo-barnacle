// src/components/tasks/TaskForm.jsx
import React, { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { Calendar, Flag, User, FileText, CheckSquare } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
    priority: initialData?.priority || 'medium',
    assignedTo: initialData?.assignedTo?._id || initialData?.assignedTo || '',
    dueDate: initialData?.dueDate ? initialData.dueDate.split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: employees } = useEmployees({ limit: 100 });
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null,
      };
      await onSubmit(submitData);
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <FileText className="h-4 w-4 text-primary-600" />
          Task Title *
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a clear, descriptive title..."
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-rose-600 font-medium">{errors.title}</p>
        )}
      </div>
      
      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <FileText className="h-4 w-4 text-primary-600" />
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Add details about this task..."
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none text-slate-800 placeholder:text-slate-400"
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-rose-600 font-medium">{errors.description}</p>
        )}
      </div>
      
      {/* Status and Priority Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-slate-800 bg-white"
          >
            <option value="todo">📋 To Do</option>
            <option value="in_progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Flag className="h-4 w-4 text-orange-600" />
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-slate-800 bg-white"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>
      
      {/* Assignee and Due Date Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <User className="h-4 w-4 text-purple-600" />
            Assign To
          </label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-slate-800 bg-white"
          >
            <option value="">Unassigned</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-slate-800 bg-white"
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1 py-3 font-semibold"
        >
          {initialData ? '✨ Update Task' : '🚀 Create Task'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 font-semibold"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;