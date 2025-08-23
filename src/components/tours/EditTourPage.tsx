"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingOverlay from "../common/LoadingOverlay";
import {
  getTourDetail,
  updateTour,
  Tour,
  TourFormData
} from "@/services/tour.service";
import { uploadImages } from "@/services/upload-image.service";
import TourForm from "@/components/tours/TourForm";
import DownloadCustomerImagesButton from "./DownloadCustomerImagesButton";

export default function EditTourPage() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await getTourDetail(Number(id));
        setTour(res.data);
      } catch (e) {
        console.log("Error fetching tour:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleSubmit = async ({
    formData,
    images,
  }: {
    formData: TourFormData;
    images: File[];
  }) => {
    setLoading(true);

    try {
      if (!tour) return;

      const dataToUpdate: Partial<TourFormData> = {};

      (Object.keys(formData) as (keyof TourFormData)[]).forEach((key) => {
        const newValue = formData[key];
        const oldValue = tour?.[key]?.toString() || "";

        if (newValue !== oldValue) {
          dataToUpdate[key] = newValue;
        }
      });

      if (images.length > 0) {
        const uploaded = await uploadImages(images);

        if (!uploaded.success) {
          toast.error("Upload ảnh thất bại!");
          setLoading(false);
          return;
        }

        uploaded.data.forEach((url, index) => {
          dataToUpdate[`image_url_${index + 1}` as keyof TourFormData] = url;
        });
      }

      if (Object.keys(dataToUpdate).length === 0) {
        setLoading(false);
        return;
      }

      const response = await updateTour(Number(id), dataToUpdate);

      if (response.success) {
        toast.success("Cập nhật tour thành công!");
        router.push("/admin/tours");
      } else {
        toast.error("Cập nhật tour thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật tour thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay />;
  if (!tour) return <div>Không tìm thấy tour</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chỉnh sửa tour</h1>
        <DownloadCustomerImagesButton 
          tourId={tour.id} 
          tourName={tour.name}
          disabled={!tour.bookings || tour.bookings.length === 0}
        />
      </div>
      <TourForm
        isCreate={false}
        tour={tour}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
