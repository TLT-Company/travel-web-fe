'use client';
import CustomerBookingNew from "@/components/customer/booking/new";
import { ToastContainer } from "react-toastify";

const TourBookingPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <CustomerBookingNew id = {id} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TourBookingPage;