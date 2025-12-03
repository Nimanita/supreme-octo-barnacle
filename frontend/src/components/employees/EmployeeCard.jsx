// src/components/employees/EmployeeCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Briefcase, Edit, Trash2, ExternalLink, User } from 'lucide-react';
import { Card } from '../common/Card';
import Button from '../common/Button';
import { getInitials } from '@/utils/helpers';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-purple-500 bg-gradient-to-br from-white to-purple-50/30">
      <div className="space-y-4">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {getInitials(employee.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-slate-800 truncate">{employee.name}</h3>
              {employee.role && (
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  <p className="text-sm text-slate-600 font-medium truncate">{employee.role}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(employee)}
              className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:scale-110"
              title="Edit employee"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(employee)}
              className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-all duration-200 hover:scale-110"
              title="Delete employee"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Info Section */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-blue-100">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-slate-700 font-medium truncate">{employee.email}</span>
          </div>
          
          {employee.role && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-lg bg-emerald-100">
                <Briefcase className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-slate-700 font-medium truncate">{employee.role}</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="pt-3 border-t border-slate-200">
          <Link
            to={`/employees/${employee._id}`}
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold group transition-all"
          >
            View Profile
            <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeCard;
