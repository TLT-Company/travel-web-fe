import { http } from "@/lib/http";
import { LoginType, LoginResponseData, ForgotPasswordType, ResetPasswordType } from "@/components/type/login";

export const loginAdmin = async (
  values: LoginType
): Promise<LoginResponseData> => {
  const response = await http.post<LoginResponseData>("/auth/admin/login", values, {
    withAuth: false,
  });
  return response.data; // Return the data part which contains admin and token
};

export const logoutAdmin = async (): Promise<any> => {
  return await http.post<any>("/auth/logout", {},);
};


export const ForgotPasswordAdmin = async (
  values: ForgotPasswordType
): Promise<any> => {
  return await http.post<any>("/auth/admin/forgot-password", values, {
    withAuth: false,
  });
};

export const ResetPasswordAdmin = async (
  values: ResetPasswordType
): Promise<any> => {
  return await http.post<any>("/auth/admin/reset-password", values, {
    withAuth: false,
  });
};