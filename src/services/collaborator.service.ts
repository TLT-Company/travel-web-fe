
import { http } from "@/lib/http";
import { Collaborator } from "@/components/type/collaborator";

export const updateCollaborator = async (
  id: string,
  data: Collaborator
): Promise<any> => {
  return await http.put<any>(`/admin/collaborator/${id}`, data, {
    withAuth: true,
  });
};

export const deleteCollaborator = async (id: string): Promise<any> => {
  return await http.delete<any>(`/admin/collaborator/${id}`, {
    withAuth: true,
  });
}
