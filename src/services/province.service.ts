import { http } from "../lib/http";

export const getProvinces = async (): Promise<any> => {
  return await http.get<any>(`/provinces`, {
        withAuth: true,
  });
};

export const getAllCommunesByProvinceID = async (
  id: Number
): Promise<any> => {
  return await http.get<any>(`/provinces/${id}`, {
        withAuth: true,
  });
};