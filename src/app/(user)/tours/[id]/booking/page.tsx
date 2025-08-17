import { ToastContainer } from "react-toastify";
import TourBookingClient from "./TourBookingClient";


const TourBookingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return (
    <>
      <TourBookingClient id={id} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TourBookingPage;