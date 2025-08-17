'use client';
import CustomerBookingNew from "@/components/customer/booking/new";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TourBookingClientProps {
  id: string;
}

const TourBookingClient = ({ id }: TourBookingClientProps) => {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem("userLoginTravel") || '{}');
  
  useEffect(() => {
    if (!user || !user.id && user?.role !== 'user') {
      router.push(`/user/signin`);
      return;
    }
  }, [user, router]);

  return <CustomerBookingNew id={id} />;
};

export default TourBookingClient; 