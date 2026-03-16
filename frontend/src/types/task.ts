export type TaskStatus   = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id:          string;
  title:       string;
  description: string | null;
  status:      TaskStatus;
  priority:    TaskPriority;
  due_date:    string | null;
  created_at:  string;
  updated_at:  string;
}

export interface TaskStats {
  total:         string;
  pending:       string;
  in_progress:   string;
  completed:     string;
  cancelled:     string;
  high_priority: string;
  overdue:       string;
}

export interface TaskFormData {
  title:       string;
  description: string;
  status:      TaskStatus;
  priority:    TaskPriority;
  due_date:    string;
}
