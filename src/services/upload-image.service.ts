import { http } from "@/lib/http";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export const uploadImages = async (
  images: File[]
): Promise<ApiResponse<string[]>> => {
  const formData = new FormData();
  images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await http.post(`/uploads`, formData);
  return response;
};
