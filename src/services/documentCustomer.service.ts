import { http } from "../lib/http";
import { SetStateAction } from 'react';

export interface DocumentCustommer {
  id:string
  document_number: string;
  created_at: string;
  customer_count: string;
  customers : Custommer[]
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  count: SetStateAction<number>;
}

export interface FormSearchDocumentCustomerParams {
  document_number?: string,
  start_date?: string,
  end_date?: string,
  page?: number,
  limit?: number,
}

export interface FormSearchCustomerParams {
  card_id? : string,
  full_name?: string,
  page?: number,
  limit?: number,
}

export interface Custommer {
    id: string;
    user_id: string;
    card_id : string;
    full_name: string;
    day_of_birth: string;
    gender: string;
    national: string;
    card_created_at: string;
    village: string;
    province: string;
    district: string;
    commune: string;
    address_mapping: AddressMapping;
}

export interface AddressMapping {
  id: string;
  province_old: string;
  district_old: string;
  commune_old: string;
  province_new: string;
  commune_new: string;
}

export interface CustomerRequest {
    card_id: string;
    full_name: string;
    day_of_birth: string;
    gender: string;
    national: string;
    place_of_birth: string;
    village: string;
    card_created_at: string;
    province: string;
    district: string;
    commune: string;
}

export const getListDocumentCustommers = async (
  queryParams?: FormSearchDocumentCustomerParams
): Promise<ApiResponse<DocumentCustommer[]>> => {
  const query = new URLSearchParams(
    Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  );

  return await http.get<DocumentCustommer[]>(`/documents?${query}`);
};


export const getListCustommersByDocumentId = async (
  document_id: string,
  queryParams?: FormSearchCustomerParams
): Promise<ApiResponse<DocumentCustommer>> => {
  const query = new URLSearchParams(
    Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  );

  return await http.get<DocumentCustommer>(`/documents/${document_id}/?${query}`);
};

export const addCustomer = async (
  data: CustomerRequest,
  document_id: string
): Promise<Custommer> => {
  const response = await http.post<Custommer>(`/documents/${document_id}`, data);
  return response.data;
};

export const getCustomerById = async (customerId: number): Promise<ApiResponse<CustomerRequest>> => {
  return await http.get<CustomerRequest>(`/documents/customers/${customerId}`);
};

export const updateCustomer = async (
  data: CustomerRequest,
  customerId: number
): Promise<Custommer> => {
  const response = await http.put<Custommer>(`/documents/customers/${customerId}`, data);
  return response.data;
};

export const deleteCustomerById = async (document_number: string, customer_id:number): Promise<ApiResponse<CustomerRequest>> => {
  return await http.delete(`/documents/${document_number}/customers/${customer_id}`);
}

export const addDocument = async (
  data: any,
): Promise<any> => {
  const response = await http.post<any>(`/documents`, data);
  return response.data;
};

export const scanIDCard = async (
  document_id: string,
  images: File[]
): Promise<any> => {

  const formData = new FormData();
  images.forEach((file) => {
    formData.append("images", file);
  });
  const response = await http.post<any>(`/documents/scancccd/${document_id}`, formData);
  return response;
};