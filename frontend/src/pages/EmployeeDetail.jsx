// src/pages/EmployeeDetail.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';
import { useEmployee } from '@/hooks/useEmployees';
import { employeeApi } from '@/api/employeeApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/common/Card';
import { Toast } from '@/components/common/Toast';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import TaskCard from '@/components/tasks/TaskCard';
import { formatDate, getInitials } from '@/utils/helpers';
import { handleApiError } from '@/utils/errorHandler';
import Input from '@/components/common/Input';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useEmployee(id);
  const { toasts, success, error: showError, removeToast } = useToast();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleEditClick = () => {
    if (data) {
      const employee = data.employee || data;
      setRole(employee.role || '');
      setIsEditModalOpen(true);
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await employeeApi.update(id, { role });
      success('Employee role updated successfully');
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      handleApiError(err, showError, 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await employeeApi.delete(id);
      success('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      handleApiError(err, showError, 'Failed to delete employee');
      setDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (loading) return <Loading />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-600 font-semibold">Error: {error}</p>
        <Link to="/employees" className="text-primary-600 hover:underline mt-4 inline-block font-medium">
          Back to Employees
        </Link>
      </div>
    );
  }
  
  if (!data) return null;
  
  const employee = data.employee || data;
  const tasks = data.tasks || [];
  
  return (
    <div className="space-y-6">
      <Toast toasts={toasts} onClose={removeToast} />
      
      {/* Back Button */}
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors font-medium group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Employees
      </Link>
      
      {/* Employee Header Card */}
      <Card className="bg-gradient-to-br from-white to-purple-50/30 border-l-4 border-purple-500">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-xl">
              <span className="text-white font-bold text-3xl">
                {getInitials(employee.name)}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{employee.name}</h1>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{employee.email}</span>
                </div>
                {employee.role && (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Briefcase className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{employee.role}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-slate-700 font-medium">Joined {formatDate(employee.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={handleEditClick}
              className="font-semibold"
            >
              Edit Role
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteConfirm(true)}
              className="font-semibold"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-primary-600"></div>
            Assigned Tasks
            <span className="text-lg font-semibold text-slate-500">({tasks.length})</span>
          </h2>
        </div>
        
        {tasks.length === 0 ? (
          <Card className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100/50">
            <p className="text-slate-600 text-lg font-medium">
              No tasks assigned to this employee yet
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee Role"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Name (Read-only)
            </label>
            <input
              type="text"
              value={employee.name}
              disabled
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={employee.email}
              disabled
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
            />
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Briefcase className="h-4 w-4 text-emerald-600" />
              Role / Position
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium"
            />
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              Update the employee's role or position
            </p>
          </div>
          
          <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1 py-3 font-semibold"
            >
              ✨ Update Role
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
              className="px-6 font-semibold"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employee.name}? This action cannot be undone and will remove all associated tasks.`}
        confirmText="Delete Employee"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EmployeeDetail;