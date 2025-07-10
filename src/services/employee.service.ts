import { http } from "@/lib/http";

export interface Employer {
  id: number;
  admin_id: number;
  full_name: string;
  position: string;
  created_at: string;
}

export interface Admin {
  id: number;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  employers: Employer[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminListResponse {
  admins: Admin[];
  pagination: Pagination;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegisterAdminResponse {
  admin: {
    id: number;
    email: string;
    role: string;
    updated_at: string;
    created_at: string;
  };
  employer: {
    id: number;
    admin_id: number;
    created_at: string;
    full_name: string | null;
    position: string | null;
  };
}

export const getAdminList = async (page: number = 1): Promise<AdminListResponse> => {
  const response = await http.get<AdminListResponse>(`/admin/list?page=${page}`);
  return response.data;
};

export const registerAdmin = async (data: RegisterAdminRequest): Promise<RegisterAdminResponse> => {
  const response = await http.post<RegisterAdminResponse>("/auth/admin/register", data);
  return response.data;
}; 