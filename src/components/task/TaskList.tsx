'use client';

import { useState, useEffect } from 'react';
import { getTaskList, deleteTask, Task } from '../../services/task.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import TaskModal from './TaskModal';
import { format } from 'date-fns';

const TaskList = () => {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
  }, []);

  const fetchData = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getTaskList(page);
      
      if (result) {
        setData(result.tasks);
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

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleModalSuccess = () => {
    fetchData(pagination.currentPage);
  };

  const handleAddTask = () => {
    setModalMode('create');
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      fetchData(pagination.currentPage);
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Có lỗi xảy ra khi xóa công việc');
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button 
          className="bg-brand-500 hover:bg-brand-600"
          onClick={handleAddTask}
        >
          Thêm công việc
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data.map((task) => (
                  <TableRow key={task.id}>
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
                      {task.taskAssignments.length > 0 ? (
                        <div className="space-y-1">
                          {task.taskAssignments.map((assignment) => (
                            <div key={assignment.id} className="text-sm">
                              <div className="font-medium text-gray-800 dark:text-white/90">
                                {assignment.employer.full_name}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {assignment.employer.position}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Chưa có nhân viên</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {task.taskAssignments.length > 0 ? (
                        <div className="space-y-1">
                          {task.taskAssignments.map((assignment) => (
                            <Badge key={assignment.id} color={getStatusDisplay(assignment.status).color}>
                              {getStatusDisplay(assignment.status).text}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {task.taskAssignments.length > 0 ? (
                        <div className="space-y-1">
                          {task.taskAssignments.map((assignment) => (
                            <div key={assignment.id}>
                              {formatDate(assignment.assigned_at)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEditTask(task)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        task={selectedTask}
        mode={modalMode}
      />
    </div>
  );
};

export default TaskList; 