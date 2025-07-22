import { http } from "@/lib/http";

export const getAdmin = async (id: string): Promise<any> => {
  return await http.get<any>(`/admin/${id}`, {
    withAuth: true,
  });
};