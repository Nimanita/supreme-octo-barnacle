// src/pages/Employees.jsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { employeeApi } from '@/api/employeeApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import EmployeeList from '@/components/employees/EmployeeList';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { debounce } from '@/utils/helpers';

const Employees = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const { data, meta, loading, error, refetch } = useEmployees({ page, search, limit: 10 });
  const { success, error: showError } = useToast();
  
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
  
  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await employeeApi.delete(id);
      success('Employee deleted successfully');
      refetch();
    } catch (err) {
      showError(err.message || 'Failed to delete employee');
    }
  };
  
  const handleSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        await employeeApi.update(editingEmployee._id, formData);
        success('Employee updated successfully');
      } else {
        await employeeApi.create(formData);
        success('Employee created successfully');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showError(err.message || 'Failed to save employee');
      throw err;
    }
  };
  
  return (
    <div className="space-y-6">
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
      
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
      >
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Employees;