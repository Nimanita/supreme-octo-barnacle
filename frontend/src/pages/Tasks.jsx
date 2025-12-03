// src/pages/Tasks.jsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { taskApi } from '@/api/taskApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFilters from '@/components/tasks/TaskFilters';
import { debounce } from '@/utils/helpers';

const Tasks = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', assignedTo: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const { data, meta, loading, error, refetch, updateTaskStatus } = useTasks({
    page,
    search,
    limit: 10,
    ...filters,
  });
  
  const { success, error: showError } = useToast();
  
  const handleSearch = debounce((value) => {
    setSearch(value);
    setPage(1);
  }, 500);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  
  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskApi.delete(id);
      success('Task deleted successfully');
      refetch();
    } catch (err) {
      showError(err.message || 'Failed to delete task');
    }
  };
  
  const handleStatusChange = async (taskId, newStatus) => {
    const result = await updateTaskStatus(taskId, newStatus);
    
    if (result.success) {
      success('Task status updated');
    } else {
      showError(result.error || 'Failed to update task status');
    }
  };
  
  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        await taskApi.update(editingTask._id, formData);
        success('Task updated successfully');
      } else {
        await taskApi.create(formData);
        success('Task created successfully');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showError(err.message || 'Failed to save task');
      throw err;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track all tasks
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreateTask}>
          Add Task
        </Button>
      </div>
      
      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>
      
      {/* Content */}
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error}</p>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Get started by creating your first task."
          action={
            <Button variant="primary" onClick={handleCreateTask}>
              Add Task
            </Button>
          }
        />
      ) : (
        <>
          <TaskList
            tasks={data}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
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
        title={editingTask ? 'Edit Task' : 'Add Task'}
        size="lg"
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Tasks;