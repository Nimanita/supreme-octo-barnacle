// src/components/tasks/TaskCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Edit, Trash2, ExternalLink, AlertCircle, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { 
  getStatusColor, 
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  isOverdue,
  daysUntilDue,
  truncateText,
  cn,
} from '@/utils/helpers';
import { TASK_STATUS } from '@/utils/constants';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const overdue = isOverdue(task.dueDate) && task.status !== TASK_STATUS.COMPLETED;
  const daysLeft = daysUntilDue(task.dueDate);
  
  const handleStatusChange = (e) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(task._id, e.target.value);
    }
  };
  
  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary-500 bg-gradient-to-br from-white to-primary-50/30">
      <div className="space-y-4">
        {/* Header with badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
              {task.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={cn('px-3 py-1 rounded-full text-xs font-semibold shadow-sm', getStatusColor(task.status))}>
                {getStatusLabel(task.status)}
              </span>
              <span className={cn('px-3 py-1 rounded-full text-xs font-semibold shadow-sm', getPriorityColor(task.priority))}>
                {getPriorityLabel(task.priority)}
              </span>
              {overdue && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 shadow-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Overdue
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(task._id)}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {truncateText(task.description, 100)}
          </p>
        )}
        
        {/* Info Grid */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <div className={cn("p-1.5 rounded-lg", overdue ? "bg-rose-100" : "bg-blue-100")}>
                <Calendar className={cn("h-4 w-4", overdue ? "text-rose-600" : "text-blue-600")} />
              </div>
              <div className="flex-1">
                <span className={cn("font-medium", overdue ? "text-rose-700" : "text-slate-700")}>
                  {formatDate(task.dueDate)}
                </span>
                {daysLeft !== null && !overdue && (
                  <span className="text-slate-500 ml-2 text-xs">
                    ({daysLeft === 0 ? 'Due today' : `${daysLeft}d remaining`})
                  </span>
                )}
              </div>
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded-lg bg-purple-100">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <Link 
                to={`/employees/${task.assignedTo._id || task.assignedTo}`}
                className="font-medium text-slate-700 hover:text-primary-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {task.assignedTo.name || 'Assigned'}
              </Link>
            </div>
          )}
        </div>
        
        {/* Quick Status Change */}
        {onStatusChange && (
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Quick Update
            </label>
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="w-full text-sm font-medium border-2 border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white hover:border-primary-300"
            >
              <option value="todo">📋 To Do</option>
              <option value="in_progress">⚡ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        )}
        
        {/* Footer */}
        <div className="pt-3 border-t border-slate-200">
          <Link
            to={`/tasks/${task._id}`}
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold group transition-all"
          >
            View Full Details
            <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;