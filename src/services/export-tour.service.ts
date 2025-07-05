import { http } from "../lib/http";

export const exportTour = async (
  values: any,
): Promise<any> => {
  return await http.post<any>("/appointments", values);
};