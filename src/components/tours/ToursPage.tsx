"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "../common/LoadingOverlay";
import {
  Tour,
  FormSearchTourParams,
  getListTours,
  deleteTour
} from "@/services/tour.service";
import Pagination from "../tables/Pagination";
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

  const fetchTours = useCallback(async () => {
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
      console.log("Error get tours: ", e);
      toast.error("Lỗi khi lấy danh sách tour");
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  if (loading) return <LoadingOverlay shown={loading} />;

  const totalPages = Math.ceil(totalTours / toursPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa tour này?");
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteTour(id);
      toast.success("Xóa tour thành công!");
      await fetchTours();
    } catch (error) {
      console.log("Xóa tour thất bại:", error);
      toast.error("Xóa tour thất bại");
    } finally {
      setLoading(false);
    }
  }

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

      <div className="mb-4 text-right">
        <p className="text-sm text-gray-600 mr-1">
          Tổng số tour: <span className="text-black">{totalTours}</span>
        </p>
      </div>

      <TourTable tours={tours} loading={loading} onDelete={handleDelete} />

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
