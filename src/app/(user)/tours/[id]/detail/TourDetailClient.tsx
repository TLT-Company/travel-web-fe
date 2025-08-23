'use client';
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import DownloadCustomerImagesButton from "@/components/tours/DownloadCustomerImagesButton";

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
      <div className="flex gap-2 mt-4">
        <Button 
          className="bg-blue-500 text-white px-4 py-2 rounded" 
          onClick={() => {handleBookingTour(id)}}
        >
          Booking Tour
        </Button>
        <DownloadCustomerImagesButton 
          tourId={Number(id)} 
          tourName={`tour-${id}`}
        />
      </div>
    </div>
  );
};

export default TourDetailClient; 