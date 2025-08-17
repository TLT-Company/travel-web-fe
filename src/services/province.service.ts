import { http, ApiResponse } from "../lib/http";

export interface Province {
  tentinh: string;
  mahc: string;
}

export const getProvinces = async (): Promise<ApiResponse<Province[]>> => {
  const response = await http.get<Province[]>(`/provinces`, {
        withAuth: true,
  });
  return response;
};

export const getAllCommunesByProvinceID = async (
  id: number
): Promise<ApiResponse<Province[]>> => {
  const response = await http.get<Province[]>(`/provinces/${id}`, {
        withAuth: true,
  });
  return response;
};