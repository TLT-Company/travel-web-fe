'use client';
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

interface TourDetailClientProps {
  id: string;
}

const TourDetailClient = ({ id }: TourDetailClientProps) => {
  const router = useRouter();
  
  const handleBookingTour = (tourId: string) => {
    const user = JSON.parse(localStorage.getItem("userLoginTravel") || '{}');
    if (!user || !user.id && user?.role !== 'user') {
      router.push(`/user/signin`);
      return;
    } else {
      router.push(`/tours/${tourId}/booking`);
    }
  };

  return (
    <div>
      <h1>Chi tiết tour {id}</h1>
      <Button 
        className="bg-blue-500 text-white px-4 py-2 rounded" 
        onClick={() => {handleBookingTour(id)}}
      >
        Booking Tour
      </Button>
    </div>
  );
};

export default TourDetailClient; 