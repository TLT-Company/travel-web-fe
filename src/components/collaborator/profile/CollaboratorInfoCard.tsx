"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Image from "next/image";
import { toast } from "react-toastify";
import { Admin, getProfile, updateProfile } from "@/services/admmin.service";
import { format } from "date-fns";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import DatePicker from "@/components/form/date-picker";
import FileInput from "@/components/form/input/FileInput";
import Select from "@/components/form/Select";
import { useAdmin } from "../../../context/AdminContext";


export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [collaborator, setCollaborator] = useState<Admin>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageUrl = collaborator?.employer?.picture
  ? `${process.env.NEXT_PUBLIC_UPLOAD_IMAGE_URL}/${collaborator.employer.picture}`
  : "/images/user/owner.jpg";
  const { admin, setAdmin } = useAdmin();

  const fetchCollaborator = async () => {
    setIsLoading(true)
    try {
      const response = await getProfile();
      setCollaborator(response.data)
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("đã xảy ra lỗi");
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchCollaborator();
  }, []);

  if (isLoading) return <LoadingOverlay shown={isLoading} />;
  
  const handleSubmit = async (values: {
    full_name: string;
    phone_number: string;
    day_of_birth: string;
    gender: string;
    address: string;
    email:string;
  }) => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("phone_number", values.phone_number);
      formData.append("day_of_birth", values.day_of_birth);
      formData.append("gender", values.gender);
      formData.append("address", values.address);
      formData.append("email", values.email);
      if (avatarFile) {
        formData.append("picture", avatarFile);
      }

      const res = await updateProfile(formData);
      setAdmin(res);
      toast.success('Cập nhật thông tin thành công');
      await fetchCollaborator();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      closeModal();
      setIsLoading(false)
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCloseModal = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setAvatarFile(null);
    setPreviewUrl(null);
    closeModal();
  };

  const validationSchema = Yup.object({
      full_name: Yup.string()
        .required('Họ và tên là bắt buộc'),
      day_of_birth: Yup.string()
        .required('Ngày sinh là bắt buộc'),
      gender: Yup.string()
        .required('Giới tính là bắt buộc'),
      phone_number: Yup.string()
        .required('Số điện thoại là bắt buộc'),
      email: Yup.string()
        .required('Email là bắt buộc'),
      
  });

  const genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
  ];

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={imageUrl}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {collaborator?.employer?.full_name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {collaborator?.role === "collaborator" && "Cộng tác viên"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Thông tin cá nhân
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Họ và tên
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {collaborator?.employer?.full_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ngày sinh
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {
                  collaborator?.employer?.day_of_birth
                    ? format(new Date(collaborator.employer.day_of_birth), 'dd/MM/yyyy')
                    : ''
                }
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Địa chỉ email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {collaborator?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Số điện thoại
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {collaborator?.employer?.phone_number}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Giới tính
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {collaborator?.employer?.gender}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Địa chỉ
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {collaborator?.employer?.address}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Mã giới thiệu
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {collaborator?.employer?.referral_code}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h5 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin cá nhân
            </h5>
          </div>
          <Formik
            initialValues={{
                full_name: collaborator?.employer?.full_name || "",
                day_of_birth: collaborator?.employer?.day_of_birth || "",
                phone_number: collaborator?.employer?.phone_number || "",
                email: collaborator?.email || "",
                gender: collaborator?.employer?.gender || "",
                address: collaborator?.employer?.address || ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, touched, errors }) => (
          <Form className="flex flex-col">
              
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                  <div className="col-span-2">
                    <Label className="block">Ảnh đại diện</Label>
                    <Image
                      width={50}
                      height={50}
                      src={
                        previewUrl || imageUrl
                      }
                      alt="user"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <Label>Upload file</Label>
                      <FileInput onChange={handleFileChange} className="custom-class" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label>Họ và tên <span className="text-error-500">*</span></Label>
                    <Field
                      type="full_name"
                      name="full_name"
                      placeholder="Nhập họ và tên"
                      as={Input}
                      disabled={isLoading}
                    />
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="col-span-2">
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
                  <div className="col-span-2">
                    <Label>số điện thoại <span className="text-error-500">*</span></Label>
                    <Field
                      type="phone_number"
                      name="phone_number"
                      placeholder="Nhập số điện thoại"
                      as={Input}
                      disabled={isLoading}
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Ngày sinh <span className="text-error-500">*</span></Label>
                    <DatePicker
                      id="day_of_birth"
                      placeholder="Nhập ngày sinh"
                      defaultDate={values.day_of_birth}
                      onChange={([selected]) => 
                        {
                          setFieldValue('day_of_birth',  selected
                              ? selected.toLocaleDateString("en-CA") :"");
                        }
                      }
                    />
                    <ErrorMessage
                      name="day_of_birth"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Giới tính<span className="text-error-500">*</span></Label>
                    <Select
                      options={genderOptions}
                      placeholder="Chọn giới tính"
                      onChange={(value) => setFieldValue('gender', value)}
                      defaultValue={values.gender}
                    />
                    {touched.gender && errors.gender && (
                      <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <Label>Địa chỉ</Label>
                    <Field
                      type="text"
                      name="address"
                      placeholder="Nhập địa chỉ"
                      as={Input}
                      disabled={isLoading}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal}>
                Đóng
              </Button>
              <button
                  type="submit"
                  className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
              >
                  Lưu thay đổi
              </button>
            </div>

          </Form>
          )}
        </Formik>
        </div>
      </Modal>
    </>
  );
}
