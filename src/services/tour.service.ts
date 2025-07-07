import { http } from "../lib/http";

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
  assignedEmployer: {
    id: number;
    full_name: string;
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
}

interface FormSearchTourParams {
  name?: string,
  location?: string,
  start_date?: string,
  end_date?: string,
  price_min?: string,
  price_max?: string,
}

// Tour Service
export const tourService = {
  getAll: () => http.get<Tour[]>("/tours"),
  getById: (id: number) => http.get<Tour>(`/tours/${id}`),
  getTourBySearch: (queryParams?: FormSearchTourParams) => {
    const query = new URLSearchParams(
      Object.entries(queryParams || {}).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    );

    return http.get<Tour[]>(`/tours/search/getTourBySearch?${query}`);
  },
}
