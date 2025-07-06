"use client";

import React, { useEffect, useState } from "react";
import LoadingOverlay from "../common/LoadingOverlay";
import { tourService, Tour } from "@/services/tour.service";
import Pagination from "../tables/Pagination";
import TourTable from "./TourTable";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const toursPerPage = 20;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const result = await tourService.getAll();

        if (result.success) {
          const tours = result.data.map((tour: Tour) => ({
            id: tour.id,
            name: tour.name,
            description: tour.description,
            price: Number(tour.price),
            start_date: tour.start_date,
            end_date: tour.end_date,
            location: tour.location,
          }));
          setTours(tours);
        } else {
          setTours([]);
        }
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
