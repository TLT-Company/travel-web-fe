'use client';

import { useState, useEffect } from 'react';
import { getTaskList, assignTask, Task, AssignTaskRequest } from '../../services/task.service';
import { getAdminList, Admin } from '../../services/employee.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { format } from 'date-fns';

const TaskAssignment = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getTaskList(page);
      
      if (result) {
        setTasks(result.tasks);
        setPagination(result.pagination);
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await getAdminList(1);
      if (result) {
        setEmployees(result.admins);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleAssignTask = async () => {
    if (!selectedTask || !selectedEmployee) {
      alert('Vui lòng chọn công việc và nhân viên');
      return;
    }

    try {
      setAssigning(true);
      const requestData: AssignTaskRequest = {
        task_id: parseInt(selectedTask),
        employer_id: parseInt(selectedEmployee),
      };
      
      await assignTask(requestData);
      
      // Reset form
      setSelectedTask('');
      setSelectedEmployee('');
      
      // Refresh data
      fetchData(pagination.currentPage);
      
      alert('Giao việc thành công!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi giao việc';
      alert(errorMessage);
      console.error('Error assigning task:', err);
    } finally {
      setAssigning(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: 'primary' | 'success' | 'info' | 'warning' | 'error' | 'light' } } = {
      'new': { text: 'Mới', color: 'info' },
      'in_progress': { text: 'Đang thực hiện', color: 'warning' },
      'completed': { text: 'Hoàn thành', color: 'success' },
      'cancelled': { text: 'Đã hủy', color: 'error' },
    };
    return statusMap[status] || { text: status, color: 'light' };
  };

  // Get all unique employees from all admins
  const getAllEmployees = () => {
    const allEmployees: { id: number; full_name: string; position: string }[] = [];
    employees.forEach(admin => {
      admin.employers.forEach(employer => {
        allEmployees.push({
          id: employer.id,
          full_name: employer.full_name,
          position: employer.position,
        });
      });
    });
    return allEmployees;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Assignment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Phân nhiệm vụ
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn công việc *
            </label>
            <Select
              options={tasks.map((task) => ({
                value: task.id.toString(),
                label: task.name,
              }))}
              onChange={(value) => setSelectedTask(value)}
              placeholder="Chọn công việc..."
              defaultValue={selectedTask}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn nhân viên *
            </label>
            <Select
              options={getAllEmployees().map((employee) => ({
                value: employee.id.toString(),
                label: `${employee.full_name} - ${employee.position}`,
              }))}
              onChange={(value) => setSelectedEmployee(value)}
              placeholder="Chọn nhân viên..."
              defaultValue={selectedEmployee}
            />
          </div>
        </div>
        
        <Button
          className="bg-brand-500 hover:bg-brand-600"
          onClick={handleAssignTask}
          disabled={assigning || !selectedTask || !selectedEmployee}
        >
          {assigning ? 'Đang giao việc...' : 'Giao việc'}
        </Button>
      </div>

      {/* Assigned Tasks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách việc đã giao
          </h3>
        </div>
        
        <div className="overflow-hidden">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tên công việc
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Nhân viên được giao
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Ngày giao
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {tasks.map((task) => 
                    task.taskAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            #{task.id}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {task.name}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <div className="text-sm">
                            <div className="font-medium text-gray-800 dark:text-white/90">
                              {assignment.employer.full_name}
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {assignment.employer.position}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start">
                          <Badge color={getStatusDisplay(assignment.status).color}>
                            {getStatusDisplay(assignment.status).text}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDate(assignment.assigned_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} của {pagination.totalItems} kết quả
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Trước
            </Button>
            <span className="px-3 py-2 text-sm">
              Trang {pagination.currentPage} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignment; 