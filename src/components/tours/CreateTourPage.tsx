"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createTour, TourFormData } from "@/services/tour.service";
import LoadingOverlay from "../common/LoadingOverlay";
import TourForm from "@/components/tours/TourForm";
import { uploadImages } from "@/services/upload-image.service";

export default function CreateTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async ({
    formData,
    images,
  }: {
    formData: TourFormData;
    images: File[];
  }) => {
    setLoading(true);

    try {
      const imageUrls: Record<string, string> = {};

      if (images.length > 0) {
        const uploaded = await uploadImages(images);

        if (!uploaded.success) {
          toast.error("Upload ảnh thất bại!");
          setLoading(false);
          return;
        }

        uploaded.data.forEach((url, index) => {
          imageUrls[`image_url_${index + 1}`] = url;
        });
      }

      const data = {
        ...formData,
        ...imageUrls,
      };

      const response = await createTour(data);

      if (response.success) {
        toast.success("Tạo tour thành công!");
        router.push("/admin/tours");
      } else {
        toast.error("Tạo tour thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Tạo tour thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <TourForm isCreate={true} onSubmit={handleSubmit} loading={loading} />
  )
}
