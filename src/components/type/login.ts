export type LoginType = {
  email: string;
  password: string;
};

export interface Admin {
  id: number;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  employer: {
    id: number;
    admin_id: number;
    created_at: string;
    full_name: string | null;
    position: string | null;
  };
}

export interface LoginResponseData {
  admin: Admin;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

export type ForgotPasswordType = {
  email: string;
};

export type ResetPasswordType = {
  email: string;
  newPassword: string;
};

export type GetCurrentAdminType = {
  id: number;
}