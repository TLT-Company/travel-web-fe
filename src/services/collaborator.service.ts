
import { http } from "@/lib/http";
import { SetStateAction } from "react";
import { Collaborator } from "@/components/type/collaborator";

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

export const getCollaborator = async (): Promise<ApiResponse<Admin>> => {
  return await http.get<Admin>(`/collaborators/profile`, {
        withAuth: true,
  });
};



export const updateProfile = async (
  data: FormData,
): Promise<any> => {
  const response = await http.put<any>(`/collaborators/profile`, data);
  return response.data;
};

export const updateCollaborator = async (
  id: string,
  data: Collaborator
): Promise<any> => {
  return await http.put<any>(`/admin/collaborator/${id}`, data, {
    withAuth: true,
  });
};

export const deleteCollaborator = async (id: string): Promise<any> => {
  return await http.delete<any>(`/admin/collaborator/${id}`, {
    withAuth: true,
  });
}
