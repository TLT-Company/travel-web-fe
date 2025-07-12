import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Forgot Password Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Forgot Password Page TailAdmin Dashboard Template",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}