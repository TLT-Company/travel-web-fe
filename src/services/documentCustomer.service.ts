import { http } from "../lib/http";
import { SetStateAction } from 'react';


interface Creator {
  id: number;
  email: string;
  role: string;
}

export interface DocumentCustommer {
  document_number: string;
  created_at: string;
  customer_count: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  count: SetStateAction<number>;
}

export interface FormSearchDocumentCustomerParams {
  id?: string,
  create_date?: string,
  page?: number,
  limit?: number,
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

  return await http.get<DocumentCustommer[]>(`/document-customer?${query}`);
};