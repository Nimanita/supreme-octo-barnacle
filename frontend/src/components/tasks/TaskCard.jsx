// src/components/tasks/TaskCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Edit, Trash2, ExternalLink, AlertCircle } from 'lucide-react';
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
    <Card className="hover:shadow-lg transition-shadow relative">
      {overdue && (
        <div className="absolute top-2 right-2">
          <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-gray-600">{truncateText(task.description, 100)}</p>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span className={cn('badge', getStatusColor(task.status))}>
            {getStatusLabel(task.status)}
          </span>
          <span className={cn('badge', getPriorityColor(task.priority))}>
            {getPriorityLabel(task.priority)}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Due: {formatDate(task.dueDate)}
              {daysLeft !== null && !overdue && (
                <span className="text-gray-500 ml-1">
                  ({daysLeft === 0 ? 'Today' : `${daysLeft}d left`})
                </span>
              )}
            </span>
          </div>
        )}
        
        {task.assignedTo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <Link 
              to={`/employees/${task.assignedTo._id || task.assignedTo}`}
              className="hover:text-primary-600"
              onClick={(e) => e.stopPropagation()}
            >
              {task.assignedTo.name || 'Assigned'}
            </Link>
          </div>
        )}
      </div>
      
      {onStatusChange && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quick Status Change
          </label>
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={`/tasks/${task._id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View Details
          <ExternalLink className="h-3 w-3" />
        </Link>
        
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;