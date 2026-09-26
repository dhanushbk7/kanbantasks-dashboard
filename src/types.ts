export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate: string;
  tags: string[];
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  icon: string;
}
