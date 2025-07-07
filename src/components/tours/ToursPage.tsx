"use client";

import React, { useEffect, useState } from "react";
import LoadingOverlay from "../common/LoadingOverlay";
import { tourService, Tour } from "@/services/tour.service";
import Pagination from "../tables/Pagination";
import TourTable from "./TourTable";
import FormSearchTour from "./FormSearchTour";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const toursPerPage = 20;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const result = await tourService.getAll();

        setTours(result.success ? result.data : []);
      } catch (e) {
        console.log("Error fetching tours: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return <LoadingOverlay shown={loading} />;

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = tours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(tours.length / toursPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <FormSearchTour
        onSearchResult={(result) => {
          setTours(result);
          setCurrentPage(1);
        }}
        loading={loading}
      />

      <TourTable tours={currentTours} loading={loading} />

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
