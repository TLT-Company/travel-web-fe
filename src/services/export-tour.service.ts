import { http } from "../lib/http";
import { ENV_CONFIG } from "../config/environment";
import { API_CONFIG } from "../config/api";

// TypeScript interfaces
export interface DocumentExport {
  id: number;
  kind: string;
  file_path: string;
  file_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export const exportTour = async (
  values: Record<string, unknown>,
): Promise<unknown> => {
  return await http.post<unknown>("/appointments", values);
};

// Document Export Service
export const documentExportService = {
  getAll: () => http.get<DocumentExport[]>('/document-export/'),
  getById: (id: number) => http.get<DocumentExport>(`/document-export/${id}/`),
  create: (data: Partial<DocumentExport>) => http.post<DocumentExport>('/document-export/', data),
  update: (id: number, data: Partial<DocumentExport>) => http.put<DocumentExport>(`/document-export/${id}/`, data),
  delete: (id: number) => http.delete(`/document-export/${id}/`),
  performAnalysis: (file_name: string) => http.post<ApiResponse>('/document-export/perform-analysis', { file_name }),
  download: (id: number) => {
    const url = `${ENV_CONFIG.API_BASE_URL}/document-export/download/${id}/`;
    return fetch(url, {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
      },
    });
  },
};

