import { http } from "@/lib/http";
import { LoginType, LoginResponseData } from "@/components/type/login";

export const loginAdmin = async (
  values: LoginType
): Promise<LoginResponseData> => {
  const response = await http.post<LoginResponseData>("/auth/admin/login", values, {
    withAuth: false,
  });
  return response.data; // Return the data part which contains admin and token
};