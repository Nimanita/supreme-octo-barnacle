// src/pages/Employees.jsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { employeeApi } from '@/api/employeeApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { Toast } from '@/components/common/Toast';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmployeeList from '@/components/employees/EmployeeList';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { debounce } from '@/utils/helpers';
import { handleApiError } from '@/utils/errorHandler';

const Employees = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, employee: null });
  const [editConfirm, setEditConfirm] = useState({ isOpen: false, employee: null, formData: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data, meta, loading, error, refetch } = useEmployees({ page, search, limit: 10 });
  const { toasts, success, error: showError, removeToast } = useToast();
  
  const handleSearch = debounce((value) => {
    setSearch(value);
    setPage(1);
  }, 500);
  
  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };
  
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };
  
  const handleDeleteEmployee = (employee) => {
    setDeleteConfirm({ isOpen: true, employee });
  };
  
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await employeeApi.delete(deleteConfirm.employee._id);
      success('Employee deleted successfully');
      setDeleteConfirm({ isOpen: false, employee: null });
      refetch();
    } catch (err) {
      handleApiError(err, showError, 'Failed to delete employee. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        // Show confirmation dialog for editing
        setEditConfirm({ 
          isOpen: true, 
          employee: editingEmployee, 
          formData 
        });
      } else {
        // Create new employee directly
        await employeeApi.create(formData);
        success('Employee created successfully');
        setIsModalOpen(false);
        refetch();
      }
    } catch (err) {
      handleApiError(err, showError, 'Failed to save employee. Please try again.');
      throw err;
    }
  };
  
  const confirmEdit = async () => {
    setIsUpdating(true);
    try {
      await employeeApi.update(editConfirm.employee._id, editConfirm.formData);
      success('Employee role updated successfully');
      setEditConfirm({ isOpen: false, employee: null, formData: null });
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      handleApiError(err, showError, 'Failed to update employee role. Please try again.');
      setEditConfirm({ isOpen: false, employee: null, formData: null });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Toast Component - Add this at the top */}
      <Toast toasts={toasts} onClose={removeToast} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your team members
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreateEmployee}>
          Add Employee
        </Button>
      </div>
      
      {/* Search */}
      <Input
        placeholder="Search employees..."
        leftIcon={<Search className="h-5 w-5 text-gray-400" />}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {/* Content */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="No employees found"
          description="Get started by creating your first employee."
          action={
            <Button variant="primary" onClick={handleCreateEmployee}>
              Add Employee
            </Button>
          }
        />
      ) : (
        <>
          <EmployeeList
            employees={data}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
          
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * meta.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * meta.limit, meta.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{meta.totalItems}</span> results
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page === meta.totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Employee Role' : 'Add Employee'}
      >
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isEditing={!!editingEmployee}
        />
      </Modal>
      
      {/* Edit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={editConfirm.isOpen}
        onClose={() => setEditConfirm({ isOpen: false, employee: null, formData: null })}
        onConfirm={confirmEdit}
        title="Confirm Role Update"
        message={`Are you sure you want to update the role for ${editConfirm.employee?.name}? The new role will be "${editConfirm.formData?.role || 'Not specified'}".`}
        confirmText="Update Role"
        cancelText="Cancel"
        variant="primary"
        isLoading={isUpdating}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, employee: null })}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteConfirm.employee?.name}? This action cannot be undone and will remove all associated tasks.`}
        confirmText="Delete Employee"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Employees;