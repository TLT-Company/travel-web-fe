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

export interface ProvinceByCCCD {
  ma_tinh: string;
  ten_tinh: string;
  ky_tu: string;
  cccd: string;
}

export const getProvinceByCCCD = async (cccd: string): Promise<ApiResponse<ProvinceByCCCD>> => {
  const response = await http.get<ProvinceByCCCD>(`/provinces/cccd/${cccd}`, {
    withAuth: true,
  });
  return response;
};