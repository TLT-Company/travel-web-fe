"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginType } from "../type/login";
import { loginAdmin } from "@/services/login.service";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";


export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname(); 
  
  const SigninSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
  });

  const handleLogin = async (values: LoginType) => {
    setIsLoading(true);
    try {
      const data = await loginAdmin(values);
      
      // Check if data exists and has the expected structure
      if (!data || !data.token || !data.admin) {
        throw new Error("Invalid response structure from server");
      }
      
      // Lưu token và thông tin user vào localStorage
      localStorage.setItem("accessTokenTravel", data.token);
      localStorage.setItem("userLoginTravel", JSON.stringify(data.admin));
      
      // Hiển thị thông báo thành công
      toast.success("Đăng nhập thành công!");
      
      // Chuyển hướng đến trang admin sau 1 giây
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Email hoặc mật khẩu không chính xác.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {pathname === "/admin/signin" && (
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
           Quay lại
          </Link>
        </div>
      )}

      {pathname === "/user/signin" && (
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Quay lại
          </Link>
        </div>
      )}
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập email và mật khẩu để đăng nhập!
            </p>
          </div>
          <div>
            <div className="relative py-3 sm:py-5">
            </div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SigninSchema}
              onSubmit={handleLogin}
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

                  {/* Password */}
                  <div>
                    <Label>Password <span className="text-error-500">*</span></Label>
                    <div className="relative">
                      <Field
                        name="password"
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
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} disabled={isLoading} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Lưu mật khẩu
                    </span>
                  </div>
                  {pathname === "/user/signin" && (
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Quên mật khẩu?
                  </Link>
                  )}
                   {pathname === "/admin/signin" && (
                  <Link
                    href="/admin/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Quên mật khẩu?
                  </Link>
                  )}
                </div>
                <div>
                  <button 
                    className="w-full inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
                {pathname === "/user/signin" && (
                  <div>
                    <a 
                      href="/user/signup"
                      className="w-full inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50" 
                      type="button"
                    >
                      {isLoading ? "Đang đăng nhập..." : "Đăng ký tài khoản"}
                    </a>
                  </div>
                )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
