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

export interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
  bookings?: Booking[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Document Export Service
export const tourService = {
  getAll: () => http.get<Tour[]>('/tours'),
  getById: (id: number) => http.get<Tour>(`/tours/${id}`),
}
