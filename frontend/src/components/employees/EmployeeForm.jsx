// src/components/employees/EmployeeForm.jsx
import React, { useState } from 'react';
import { User, Mail, Briefcase } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const EmployeeForm = ({ initialData, onSubmit, onCancel, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    role: initialData?.role || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    
    if (!isEditing) {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const submitData = isEditing ? { role: formData.role } : formData;
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
      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <User className="h-4 w-4 text-purple-600" />
          Full Name {!isEditing && '*'}
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter employee name..."
          disabled={isEditing}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 placeholder:text-slate-400 ${
            isEditing 
              ? 'border-slate-200 bg-slate-50 cursor-not-allowed text-slate-500' 
              : 'border-slate-200 focus:border-primary-500'
          }`}
        />
        {isEditing && (
          <p className="mt-1.5 text-xs text-slate-500 font-medium">Name cannot be changed</p>
        )}
        {errors.name && (
          <p className="mt-1.5 text-sm text-rose-600 font-medium">{errors.name}</p>
        )}
      </div>
      
      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Mail className="h-4 w-4 text-blue-600" />
          Email Address {!isEditing && '*'}
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="employee@example.com"
          disabled={isEditing}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-800 placeholder:text-slate-400 ${
            isEditing 
              ? 'border-slate-200 bg-slate-50 cursor-not-allowed text-slate-500' 
              : 'border-slate-200 focus:border-primary-500'
          }`}
        />
        {isEditing && (
          <p className="mt-1.5 text-xs text-slate-500 font-medium">Email cannot be changed</p>
        )}
        {errors.email && (
          <p className="mt-1.5 text-sm text-rose-600 font-medium">{errors.email}</p>
        )}
      </div>
      
      {/* Role */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Briefcase className="h-4 w-4 text-emerald-600" />
          Role / Position
        </label>
        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Software Engineer, Designer..."
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
        />
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          {isEditing ? 'Update the employee\'s role or position' : 'Optional - can be added later'}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1 py-3 font-semibold"
        >
          {isEditing ? '✨ Update Role' : '🚀 Add Employee'}
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

export default EmployeeForm;