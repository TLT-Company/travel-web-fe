"use client";

import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
};

export default function ImageGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const maxVisibleThumbnails = 7;

  const getThumbnailRange = () => {
    let start = Math.max(0, activeIndex - 3);
    let end = start + maxVisibleThumbnails;
    if (end > images.length) {
      end = images.length;
      start = Math.max(0, end - maxVisibleThumbnails);
    }

    const thumbs = images.slice(start, end);
    return { thumbs, start };
  };

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const { thumbs: visibleThumbnails, start } = getThumbnailRange();

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Ảnh lớn */}
      <div className="relative w-full aspect-[3/2] mb-4">
        <Image
          src={images[activeIndex]}
          alt={`Image ${activeIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-xl border"
        />
        {/* Nút prev/next */}
        <button
          onClick={handlePrev}
          className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white/70
                    hover:bg-white rounded-full p-1 shadow"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white/70
                    hover:bg-white rounded-full p-1 shadow"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 justify-center overflow-x-auto">
        {visibleThumbnails.map((thumb, idx) => {
          const actualIndex = start + idx;
          const isActive = actualIndex === activeIndex;

          if (!thumb || thumb.trim() === '') return null;

          return (
            <div
              key={actualIndex}
              className={`w-20 h-14 relative cursor-pointer rounded border-2 ${
                isActive ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => handleThumbnailClick(actualIndex)}
            >
              <Image
                src={thumb}
                alt={`Thumb ${actualIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
