import EmployeeList from "@/components/employee/EmployeeList";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};


export default function EmployeesPage() {
  return <EmployeeList />;
}
