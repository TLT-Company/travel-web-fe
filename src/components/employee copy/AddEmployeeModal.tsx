'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerAdmin } from '../../services/employee.service';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Select from '../form/Select';
import Label from '../form/Label';
import { toast } from 'react-toastify';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'admin', label: 'Nhân viên' },
  ];

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
    role: Yup.string()
      .required('Vai trò là bắt buộc'),
  });

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => {
    setIsLoading(true);
    try {
      await registerAdmin({
        email: values.email,
        password: values.password,
        role: values.role,
      });
      
      toast.success('Thêm nhân viên thành công!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error registering admin:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm nhân viên';
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          Thêm nhân viên mới
        </h2>
        
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            role: 'admin',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Form className="space-y-6">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  as={Input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label>Mật khẩu <span className="text-error-500">*</span></Label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  as={Input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label>Xác nhận mật khẩu <span className="text-error-500">*</span></Label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  as={Input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label>Vai trò <span className="text-error-500">*</span></Label>
                <Select
                  options={roleOptions}
                  placeholder="Chọn vai trò"
                  onChange={(value) => setFieldValue('role', value)}
                  defaultValue={values.role}
                />
                {touched.role && errors.role && (
                  <div className="text-red-500 text-sm mt-1">{errors.role}</div>
                )}
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
                  {isLoading ? 'Đang thêm...' : 'Thêm nhân viên'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddEmployeeModal; 