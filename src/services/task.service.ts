import { http } from "@/lib/http";

export interface Employer {
  id: number;
  full_name: string;
  position: string;
}

export interface TaskAssignment {
  id: number;
  task_id: number;
  employer_id: number;
  booking_id: number | null;
  assigned_at: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  employer: Employer;
}

export interface Task {
  id: number;
  name: string;
  taskAssignments: TaskAssignment[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: Pagination;
}

export const getTaskList = async (page: number = 1): Promise<TaskListResponse> => {
  const response = await http.get<TaskListResponse>(`/tasks?page=${page}`);
  return response.data;
};

export interface CreateTaskRequest {
  name: string;
}

export interface CreateTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export const createTask = async (data: CreateTaskRequest): Promise<CreateTaskResponse> => {
  const response = await http.post<CreateTaskResponse>("/tasks", data);
  return response.data;
};

export interface TaskDetailResponse {
  success: boolean;
  message: string;
  data: Task;
}

export const getTaskDetail = async (id: number): Promise<TaskDetailResponse> => {
  const response = await http.get<TaskDetailResponse>(`/tasks/${id}`);
  return response.data;
};

export interface UpdateTaskRequest {
  name: string;
}

export interface UpdateTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export const updateTask = async (id: number, data: UpdateTaskRequest): Promise<UpdateTaskResponse> => {
  const response = await http.put<UpdateTaskResponse>(`/tasks/${id}`, data);
  return response.data;
};

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}

export const deleteTask = async (id: number): Promise<DeleteTaskResponse> => {
  const response = await http.delete<DeleteTaskResponse>(`/tasks/${id}`);
  return response.data;
};

export interface AssignTaskRequest {
  task_id: number;
  employer_id: number;
}

export interface AssignTaskResponse {
  success: boolean;
  message: string;
  data: TaskAssignment;
}

export const assignTask = async (data: AssignTaskRequest): Promise<AssignTaskResponse> => {
  const response = await http.post<AssignTaskResponse>("/tasks/assign", data);
  return response.data;
}; 