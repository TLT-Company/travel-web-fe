import { http } from "@/lib/http";

export const loginAdmin = async (
  values: { email: string; password: string }
): Promise<any> => {
  return await http.post<any>("/auth/login", values, {
    withAuth: false,
  });
};