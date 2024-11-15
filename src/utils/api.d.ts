export interface Task {
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    done: number;
    project_id: number;
    parent_id?: number | null;
    subtasks?: Task[];
}

export interface Project {
    name: string;
    description: string;
    status: string;
    id: number;
    task: Task[];
  }