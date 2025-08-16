export enum ProjectStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  OnHold = 'On Hold',
}

export enum ProjectPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface Subtask {
  id: string;
  projectId: string;
  description: string;
  isCompleted: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  imageUrl: string;
  projectLink: string;
  subtasks: Subtask[];
  isArchived: boolean;
}