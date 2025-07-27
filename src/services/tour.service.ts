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
  user: {
    id: number;
    email: string;
    customer: {
      id: number;
      full_name: string;
    }
  };
  assignedAdmin: {
    id: number;
    email: string;
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
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  image_url_5?: string;
  image_url_6?: string;
  image_url_7?: string;
  image_url_8?: string;
  image_url_9?: string;
  image_url_10?: string;
  bookings?: Booking[];
  creator?: Creator
  total_customers?: number;
}

export interface TourFormData {
  name: string;
  description: string;
  price: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url_1?: string;
  image_url_2?: string;
  image_url_3?: string;
  image_url_4?: string;
  image_url_5?: string;
  image_url_6?: string;
  image_url_7?: string;
  image_url_8?: string;
  image_url_9?: string;
  image_url_10?: string;
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
  month_year?: string,
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

  return await http.get<Tour[]>(`/tours?${query}`,{
    withAuth: false,
  });
};

export const getTourDetail = async (id: number): Promise<ApiResponse<Tour>> => {
  return await http.get<Tour>(`/tours/${id}`, {
    withAuth: false,
  });
};

export const createTour = async (
  data: TourFormData
): Promise<ApiResponse<Tour>> => {
  return await http.post<Tour>(`/tours`, data);
};

export const updateTour = async (
  id: number,
  data: Partial<TourFormData>
): Promise<ApiResponse<Tour>> => {
  return await http.patch<Tour>(`/tours/${id}`, data);
};

export const deleteTour = async (id: number): Promise<ApiResponse> => {
  return await http.delete(`/tours/${id}`);
};

export const getListToursByMonth = async (
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

  return await http.get<Tour[]>(`/tours/by-month?${query}`, {
    withAuth: false,
  });
};
