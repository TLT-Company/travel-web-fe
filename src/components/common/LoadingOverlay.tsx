import React from "react";
import { FaSpinner } from 'react-icons/fa';

interface LoadingOverlayProps {
  shown?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ shown = true }) => {
  if (!shown) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-[rgba(243,243,244,0.75)]
                text-[rgba(119,119,119,0.9)] font-bold
                flex items-center justify-center"
    >
      <p className="flex flex-col items-center">
        <FaSpinner className="animate-spin text-3xl text-gray-600" />
        <span className="mt-2">Đang tải dữ liệu...</span>
      </p>
    </div>
  );
};

export default LoadingOverlay;
