import { http, ApiResponse } from "@/lib/http";
import { LoginType, LoginResponseData, ForgotPasswordType, ResetPasswordType, Customer, Admin } from "@/components/type/login";

export const loginAdmin = async (
  values: LoginType
): Promise<LoginResponseData> => {
  const response = await http.post<LoginResponseData>("/auth/admin/login", values, {
    withAuth: false,
  });
  return response.data; // Return the data part which contains admin and token
};

export const logoutAdmin = async (): Promise<ApiResponse<unknown>> => {
  const response = await http.post<unknown>("/auth/logout", {},);
  return response;
};


export const ForgotPasswordAdmin = async (
  values: ForgotPasswordType
): Promise<ApiResponse<unknown>> => {
  const response = await http.post<unknown>("/auth/admin/forgot-password", values, {
    withAuth: false,
  });
  return response;
};

export const ResetPasswordAdmin = async (
  values: ResetPasswordType
): Promise<ApiResponse<unknown>> => {
  const response = await http.post<unknown>("/auth/admin/reset-password", values, {
    withAuth: false,
  });
  return response;
};

export const getCurrentAdmin = async (): Promise<ApiResponse<Admin>> => {
  const response = await http.get<Admin>("/auth/admin/me", {
    withAuth: true,
  });
  return response;
};

export const loginCustomer = async (
  values: LoginType
): Promise<LoginResponseData> => {
  const response = await http.post<LoginResponseData>("/auth/user/login", values, {
    withAuth: false,
  });
  return response.data; // Return the data part which contains admin and token
};

export const getCurrentUser = async (): Promise<ApiResponse<Customer>> => {
  const response = await http.get<Customer>("/auth/user/me", {
    withAuth: true,
  });
  return response;
};

