'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { toast } from 'react-toastify';
import { addDocument } from '@/services/documentCustomer.service';

interface AddDocumwntModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddDocumentModal: React.FC<AddDocumwntModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    document_number: Yup.string()
      .required('Số thông hành là bắt buộc')
  });

  const handleSubmit = async (values: {
    document_number: string;
  }) => {
    setIsLoading(true);
    try {
      await addDocument({
        document_number: values.document_number,
      });
      
      toast.success('Thêm số thông hành thành công!');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm số thông hành';
      onClose();
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
          Thêm mới số thông hành
        </h2>
        
        <Formik
          initialValues={{
            document_number: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
              <div>
                <Label>Họ tên <span className="text-error-500">*</span></Label>
                <Field
                  type="text"
                  name="document_number"
                  placeholder="Nhập số thông hành"
                  as={Input}
                  disabled={isLoading}
                />
                <ErrorMessage
                  name="document_number"
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
                  {isLoading ? 'Đang thêm...' : 'Thêm số thông hành'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default AddDocumentModal; 