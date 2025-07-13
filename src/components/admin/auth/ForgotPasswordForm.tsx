"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ForgotPasswordType } from "../../type/login";
import { ForgotPasswordAdmin } from "@/services/login.service";
import { toast } from "react-toastify";
import {useRouter } from "next/navigation";


export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const SigninSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  });

  const handleForgotPassword = async (values: ForgotPasswordType) => {
    setIsLoading(true);
    try {
      const data = await ForgotPasswordAdmin(values);
      if(data?.success){
        toast.success(data?.message || "Đã gửi email thành công!");
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
          href="/admin"
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
              Quên mật khẩu
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập email để nhận mail!
            </p>
          </div>
          <div>
            <div className="relative py-3 sm:py-5">
            </div>
            <Formik
              initialValues={{ email: ""}}
              validationSchema={SigninSchema}
              onSubmit={handleForgotPassword}
            >
              {() => (
                <Form className="space-y-6">
                  {/* Email */}
                  <div>
                    <Label>Email <span className="text-error-500">*</span></Label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="info@gmail.com"
                      as={Input}
                      disabled={isLoading}
                    />
                    <ErrorMessage
                      name="email"
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
