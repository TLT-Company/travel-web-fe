import TourDetailClient from "./TourDetailClient";

const TourDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  
  return <TourDetailClient id={id} />;
};

export default TourDetailPage;