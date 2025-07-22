"use client";

import React, { useEffect, useState } from "react";
import LoadingOverlay from "../../common/LoadingOverlay";
import {
  Tour,
  FormSearchTourParams,
  getListTours
} from "@/services/tour.service";
import Pagination from "../../tables/Pagination";
import TourTable from "./TourTable";
import FormSearchTour from "./FormSearchTour";
import { toast } from 'react-toastify';


export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTours, setTotalTours] = useState<number>(0);
  const [
    searchParams, setSearchParams
  ] = useState<FormSearchTourParams | null>(null);
  const [formSearch, setFormSearch] = useState<FormSearchTourParams>({
    name: "",
    location: "",
    price_min: "",
    price_max: "",
    start_date: "",
    end_date: "",
  });
  const toursPerPage = 20;

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const result = await getListTours({
          ...searchParams,
          page: currentPage,
          limit: toursPerPage,
        });

        if (result.success) {
          setTours(result.data);
          setTotalTours(result.count);
        } else {
          setTours([]);
          setTotalTours(0);
        }
      } catch (e) {
        console.log("Error get tours: ", e)
        toast.error("Lỗi khi lấy danh sách tour");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentPage, searchParams]);

  if (loading) return <LoadingOverlay shown={loading} />;

  const totalPages = Math.ceil(totalTours / toursPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <FormSearchTour
        formSearch={formSearch}
        setFormSearch={setFormSearch}
        onSubmitSearch={(params) => {
          setCurrentPage(1);
          setSearchParams(params);
        }}
        loading={loading}
      />

      <TourTable tours={tours} loading={loading} />

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
