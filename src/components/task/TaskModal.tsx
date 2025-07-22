'use client';

import { useState, useEffect } from 'react';
import { createTask, updateTask, Task, CreateTaskRequest, UpdateTaskRequest } from '../../services/task.service';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import InputField from '../form/input/InputField';
import Label from '../form/Label';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task | null;
  mode: 'create' | 'edit';
}

const TaskModal = ({ isOpen, onClose, onSuccess, task, mode }: TaskModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task && mode === 'edit') {
      setFormData({
        name: task.name,
      });
    } else {
      setFormData({
        name: '',
      });
    }
    setError(null);
  }, [task, mode, isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Tên công việc không được để trống');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (mode === 'create') {
        const requestData: CreateTaskRequest = {
          name: formData.name.trim(),
        };
        await createTask(requestData);
      } else if (task) {
        const requestData: UpdateTaskRequest = {
          name: formData.name.trim(),
        };
        await updateTask(task.id, requestData);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu công việc';
      setError(errorMessage);
      console.error('Error saving task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Thêm công việc mới' : 'Chỉnh sửa công việc'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {mode === 'create' 
              ? 'Nhập thông tin công việc mới' 
              : 'Cập nhật thông tin công việc'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên công việc *</Label>
            <InputField
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên công việc..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              className="bg-brand-500 hover:bg-brand-600"
              disabled={loading}
              onClick={() => handleSubmit()}
            >
              {loading ? 'Đang lưu...' : mode === 'create' ? 'Thêm công việc' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskModal; 