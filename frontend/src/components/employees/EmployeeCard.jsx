// src/components/employees/EmployeeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Briefcase, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import { getInitials } from '@/utils/helpers';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-lg">
              {getInitials(employee.name)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
            {employee.role && (
              <p className="text-sm text-gray-600">{employee.role}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{employee.email}</span>
        </div>
        {employee.role && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span>{employee.role}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={`/employees/${employee._id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View Details
          <ExternalLink className="h-3 w-3" />
        </Link>
        
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(employee)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeCard;
