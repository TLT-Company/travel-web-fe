import { http } from "@/lib/http";

export const getListTours = async (
): Promise<any> => {
  return await http.get<any>("/tours?page=0");
};