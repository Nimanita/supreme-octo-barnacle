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
        <p className="text-red-600">Error: {error}</p>
        <Link to="/employees" className="text-primary-600 hover:underline mt-4 inline-block">
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
      {/* Toast Component */}
      <Toast toasts={toasts} onClose={removeToast} />
      
      {/* Back Button */}
      <Link
        to="/employees"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Employees
      </Link>
      
      {/* Employee Header */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-bold text-2xl">
                {getInitials(employee.name)}
              </span>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>
                {employee.role && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{employee.role}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(employee.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={handleEditClick}
            >
              Edit Role
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Tasks ({tasks.length})
          </h2>
        </div>
        
        {tasks.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600 py-8">
              No tasks assigned to this employee
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (Read-only)
            </label>
            <input
              type="text"
              value={employee.name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={employee.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          
          <Input
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Software Engineer"
            helperText="Update the employee's role or position"
          />
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Update Role
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
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