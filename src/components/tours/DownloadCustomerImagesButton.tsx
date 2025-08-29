"use client";

import React from "react";
import Button from "@/components/ui/button/Button";
import { DownloadIcon } from "@/icons";
import { useDownloadImages } from "@/hooks/useDownloadImages";

interface DownloadCustomerImagesButtonProps {
  tourId: number;
  tourName?: string;
  disabled?: boolean;
}

export default function DownloadCustomerImagesButton({
  tourId,
  tourName = "tour",
  disabled = false,
}: DownloadCustomerImagesButtonProps) {
  const { isDownloading, downloadImages, error } = useDownloadImages();

  const handleDownload = async () => {
    if (isDownloading || disabled) return;

    try {
      await downloadImages(tourId, tourName);
    } catch (error) {
      // Error đã được xử lý trong hook
      console.error("Error downloading images:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleDownload}
        disabled={isDownloading || disabled}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <DownloadIcon className="w-5.5 h-5.5" />
        {isDownloading ? "Đang download..." : "Download ảnh khách hàng"}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
