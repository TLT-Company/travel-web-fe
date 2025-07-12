"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ResetPasswordType } from "../type/login";
import { ResetPasswordAdmin } from "@/services/login.service";
import { toast } from "react-toastify";
import {useRouter, useSearchParams } from "next/navigation";


export default function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const SigninSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    newPassword: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
  });

  const handleResetPassword = async (values: ResetPasswordType) => {
    setIsLoading(true);
    try {
      const data = await ResetPasswordAdmin(values);
      if(data?.success == true){
        toast.success(data?.message || "Đã cập nhật mật khẩu thành công!");
        router.push("/admin/signin");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Email hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/admin/forgot-password"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Quay lại
        </Link>
      </div>
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Mật khẩu mới
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập mật khẩu để tạo mật khẩu mới!
            </p>
          </div>
          <div>
            <div className="relative py-3 sm:py-5">
            </div>
            <Formik
              initialValues={{ email: String(email), newPassword: "" }}
              validationSchema={SigninSchema}
              onSubmit={handleResetPassword}
            >
              {() => (
                <Form className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label>Password <span className="text-error-500">*</span></Label>
                    <div className="relative">
                      <Field
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        as={Input}
                        disabled={isLoading}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                <div>
                  <button 
                    className="w-full inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Gửi email"}
                  </button>
                </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
