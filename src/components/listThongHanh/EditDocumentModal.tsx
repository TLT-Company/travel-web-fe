"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { toast } from "react-toastify";
import { updateDocument } from "@/services/documentCustomer.service";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  documentId?: string;
}

const EditDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  documentId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    document_number: Yup.string()
      .required("Số thông hành là bắt buộc")
  });

  const handleSubmit = async (values: {
    document_number: string;
  }) => {
    setIsLoading(true);
    try {
      await updateDocument({
        id: documentId ?? "",
        data: { document_number: values.document_number }
      });

      toast.success("Chỉnh sửa số thông hành thành công!");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi chỉnh sửa số thông hành";
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
          Chỉnh sửa số thông hành
        </h2>

        <Formik
          initialValues={{ document_number: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6" noValidate>
              <div>
                <Label>Nhập số thông hành <span className="text-error-500">*</span></Label>
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
                <button
                  type="button"
                  className="inline-flex items-center justify-center font-medium
                            gap-2 rounded-lg transition px-5 py-3.5 text-sm
                            bg-white text-gray-700 ring-1 ring-inset
                            ring-gray-300 hover:bg-gray-50 dark:bg-gray-800
                            dark:text-gray-400 dark:ring-gray-700
                            dark:hover:bg-white/[0.03] dark:hover:text-gray-300
                            disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center font-medium
                            gap-2 rounded-lg transition px-5 py-3.5 text-sm
                            bg-brand-500 text-white shadow-theme-xs
                            hover:bg-brand-600 disabled:bg-brand-300
                            disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang chỉnh sửa..." : "Chỉnh sửa số thông hành"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default EditDocumentModal;
