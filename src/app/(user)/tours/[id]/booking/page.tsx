'use client';
import CustomerBookingNew from "@/components/customer/booking/new";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

const TourBookingPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("userLoginTravel") || '{}');
  useEffect(() => {
    if (!user || !user.id && user?.role !== 'user') {
      router.push (`/user/signin`);
      return;
    }
  }, [user]);
  return (
    <>
      <CustomerBookingNew id = {id} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TourBookingPage;