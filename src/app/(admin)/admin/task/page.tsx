import TaskManagement from "@/components/task/TaskManagement";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function TaskPage() {
  return <TaskManagement />;
}
