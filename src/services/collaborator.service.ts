
import { http } from "@/lib/http";
import { Collaborator } from "@/components/type/collaborator";

export const updateCollaborator = async (
  id: string,
  data: Collaborator
): Promise<unknown> => {
  return await http.put<unknown>(`/admin/collaborator/${id}`, data, {
    withAuth: true,
  });
};

export const deleteCollaborator = async (id: string): Promise<unknown> => {
  return await http.delete<unknown>(`/admin/collaborator/${id}`, {
    withAuth: true,
  });
}
