// src/utils/helpers.js
import { TASK_STATUS, TASK_PRIORITY } from './constants';

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get status badge color class
 */
export const getStatusColor = (status) => {
  switch (status) {
    case TASK_STATUS.COMPLETED:
      return 'badge-completed';
    case TASK_STATUS.IN_PROGRESS:
      return 'badge-in-progress';
    case TASK_STATUS.TODO:
    default:
      return 'badge-todo';
  }
};

/**
 * Get priority badge color class
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case TASK_PRIORITY.HIGH:
      return 'badge-high';
    case TASK_PRIORITY.MEDIUM:
      return 'badge-medium';
    case TASK_PRIORITY.LOW:
    default:
      return 'badge-low';
  }
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case TASK_STATUS.IN_PROGRESS:
      return 'In Progress';
    case TASK_STATUS.COMPLETED:
      return 'Completed';
    case TASK_STATUS.TODO:
    default:
      return 'To Do';
  }
};

/**
 * Get priority label
 */
export const getPriorityLabel = (priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

/**
 * Check if date is overdue
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

/**
 * Calculate days until due date
 */
export const daysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Class names utility (like clsx)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};