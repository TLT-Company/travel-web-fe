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

export interface Customer {
  id: number;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    user_id: number;
    card_id: number;
    card_created_at: string;
    full_name: string;
    day_of_birth: string;
    gender: string;
    national: string;
    address: string;
    village: string;
    province: string;
    district: string;
    commune: string;
    place_of_birth: string;
    province_code: string;
    district_code: string;
    commune_code: string;
    phone_number: string;
    id_card_number: string;
    id_card_front: string;
    id_card_back: string;
    picture: string;
    verified_status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface LoginResponseData {
  admin: Admin;
  user:  Customer;
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