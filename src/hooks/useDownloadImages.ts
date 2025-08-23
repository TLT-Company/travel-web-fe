import { useState } from 'react';
import { downloadTourCustomerImages } from '@/services/tour.service';

interface UseDownloadImagesReturn {
  isDownloading: boolean;
  downloadImages: (tourId: number, tourName?: string) => Promise<void>;
  error: string | null;
}

export const useDownloadImages = (): UseDownloadImagesReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImages = async (tourId: number, tourName: string = 'tour') => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setError(null);
      
      const filename = `${tourName}-customers-images-${new Date().toISOString().split('T')[0]}.zip`;
      await downloadTourCustomerImages(tourId, filename);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi download ảnh';
      setError(errorMessage);
      console.error('Error downloading images:', err);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    downloadImages,
    error,
  };
}; 