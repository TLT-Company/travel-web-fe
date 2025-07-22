'use client';
import Link from "next/link";

const TourDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <div>
      <h1>Chi tiết tour {id}</h1>
      <Link href={`/tours/${id}/booking`} className="inline-block mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Booking Tour
        </button>
      </Link>
    </div>
  );
};
export default TourDetailPage;