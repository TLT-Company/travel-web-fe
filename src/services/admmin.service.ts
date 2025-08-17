import { http } from "@/lib/http";
import { SetStateAction } from "react";

export const getAdmin = async (id: string): Promise<ApiResponse<Admin>> => {
  return await http.get<Admin>(`/admin/${id}`, {
    withAuth: true,
  });
};

export interface Admin {
  id:string
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  employer: Employer;
}

export interface Employer {
  id:string
  admin_id: string;
  full_name: string;
  referral_code: string;
  phone_number: string;
  picture: string;
  gender: string;
  address: string;
  day_of_birth: string;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  count: SetStateAction<number>;
}

export const getProfile = async (): Promise<ApiResponse<Admin>> => {
  return await http.get<Admin>(`/admin/profile`, {
        withAuth: true,
  });
};

export const updateProfile = async (
  data: FormData,
): Promise<ApiResponse<Admin>> => {
  const response = await http.put<Admin>(`/admin/profile`, data);
  return response;
};