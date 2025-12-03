// src/pages/EmployeeDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';
import { useEmployee } from '@/hooks/useEmployees';
import { employeeApi } from '@/api/employeeApi';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/common/Card';
import Button from '@/components/common/Button';
import TaskCard from '@/components/tasks/TaskCard';
import { formatDate, getInitials } from '@/utils/helpers';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useEmployee(id);
  const { success, error: showError } = useToast();
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure? This will delete the employee and all their tasks.')) {
      return;
    }
    
    try {
      await employeeApi.delete(id);
      success('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      showError(err.message || 'Failed to delete employee');
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
              onClick={() => navigate(`/employees`)}
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
    </div>
  );
};

export default EmployeeDetail;