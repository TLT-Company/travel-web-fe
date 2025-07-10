import { http } from "@/lib/http";
import { SetStateAction } from 'react';

// TypeScript interfaces
interface Booking {
  id: number;
  customer_id: number;
  tour_id: number;
  booking_date: string;
  status: string;
  assigned_to: number;
  note: string;
  customer: {
    id: number;
    full_name: string;
  };
  assignedAdmin: {
    id: number;
    username: string;
  };
}

interface Creator {
  id: number;
  email: string;
  role: string;
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  bookings?: Booking[];
  creator?: Creator
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  count: SetStateAction<number>;
}

export interface FormSearchTourParams {
  name?: string,
  location?: string,
  start_date?: string,
  end_date?: string,
  price_min?: string,
  price_max?: string,
  page?: number,
  limit?: number,
}

export const getListTours = async (
  queryParams?: FormSearchTourParams
): Promise<ApiResponse<Tour[]>> => {
  const query = new URLSearchParams(
    Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  );

  return await http.get<Tour[]>(`/tours?${query}`);
};

export const getTourDetail = async (id: number): Promise<ApiResponse<Tour>> => {
  return await http.get<Tour>(`/tours/${id}`);
};
