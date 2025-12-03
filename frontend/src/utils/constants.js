// src/utils/constants.js

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const STATUS_OPTIONS = [
  { value: TASK_STATUS.TODO, label: 'To Do', color: 'purple' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress', color: 'blue' },
  { value: TASK_STATUS.COMPLETED, label: 'Completed', color: 'green' },
];

export const PRIORITY_OPTIONS = [
  { value: TASK_PRIORITY.LOW, label: 'Low', color: 'emerald' },
  { value: TASK_PRIORITY.MEDIUM, label: 'Medium', color: 'orange' },
  { value: TASK_PRIORITY.HIGH, label: 'High', color: 'rose' },
];

export const PAGINATION_LIMITS = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;