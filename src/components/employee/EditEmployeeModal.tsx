'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateAdmin, Admin } from '../../services/employee.service';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { toast } from 'react-toastify';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Admin | null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employee,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    full_name: Yup.string()
      .required('Họ tên là bắt buộc')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    position: Yup.string()
      .required('Chức vụ là bắt buộc')
      .min(2, 'Chức vụ phải có ít nhất 2 ký tự'),
  });

  const handleSubmit = async (values: {
    full_name: string;
    position: string;
  }) => {
    if (!employee) return;
    
    setIsLoading(true);
    try {
      await updateAdmin(employee.id, {
        full_name: values.full_name,
        position: values.position,
      });
      
      toast.success('Cập nhật nhân viên thành công!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật nhân viên";
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
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          Chỉnh sửa thông tin nhân viên
        </h2>
        
        <Formik
          initialValues={{
            full_name: employee.employer?.full_name || '',
            position: employee.employer?.position || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={employee.email}
                  disabled={true}
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <div className="text-gray-500 text-sm mt-1">
                  Email không thể thay đổi
                </div>
              </div>

              <div>
                <Label>Họ tên <span className="text-error-500">*</span></Label>
                <Field
                  type="text"
                  name="full_name"
                  placeholder="Nhập họ tên"
                  as={Input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="full_name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label>Chức vụ <span className="text-error-500">*</span></Label>
                <Field
                  type="text"
                  name="position"
                  placeholder="Nhập chức vụ"
                  as={Input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="position"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default EditEmployeeModal; 