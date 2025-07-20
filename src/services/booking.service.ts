// src/services/booking.service.ts
import { http } from "@/lib/http";

export const createBooking = async (formData: FormData): Promise<any> => {
  return await http.post("/bookings", formData, {
    withAuth: false,
  });
};
