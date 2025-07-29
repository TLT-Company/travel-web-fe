import CollaboratorList from "@/components/admin/collaborator/EmployeeList";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};


export default function EmployeesPage() {
  return <CollaboratorList />;
}
