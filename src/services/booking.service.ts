// src/services/booking.service.ts
import { http, ApiResponse } from "@/lib/http";

export const createBooking = async (formData: FormData): Promise<ApiResponse<unknown>> => {
  const response = await http.post("/bookings", formData, {
    withAuth: true,
  });
  return response;
};
