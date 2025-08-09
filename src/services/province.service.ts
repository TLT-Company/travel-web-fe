import { http } from "../lib/http";

export const getProvinces = async (): Promise<any> => {
  return await http.get<any>(`/provinces`, {
        withAuth: true,
  });
};