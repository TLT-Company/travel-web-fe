'use client';

import { useState } from 'react';
import { deleteAdmin, Admin } from '../../services/employee.service';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { toast } from 'react-toastify';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Admin | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employee,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!employee) return;
    
    setIsLoading(true);
    try {
      await deleteAdmin(employee.id);
      
      toast.success('Xóa nhân viên thành công!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa nhân viên";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 max-w-sm mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Xác nhận xóa nhân viên
          </h3>
          
          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bạn có chắc chắn muốn xóa nhân viên{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {employee.employer?.full_name || employee.email}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal; 