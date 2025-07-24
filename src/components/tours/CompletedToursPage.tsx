"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import {
  Tour,
  getListToursByMonth
} from "@/services/tour.service";
import Pagination from "@/components/tables/Pagination";
import TourTable from "./TourTable";
import { toast } from 'react-toastify';
import DatePicker from "@/components/form/date-picker";
import { format } from "date-fns";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTours, setTotalTours] = useState<number>(0);
  const [monthYear, setMonthYear] = useState<string>(() =>
    format(new Date(), "yyyy-MM")
  );
  const toursPerPage = 20;

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getListToursByMonth({
        page: currentPage,
        limit: toursPerPage,
        month_year: monthYear,
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
  }, [currentPage, monthYear]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  if (loading) return <LoadingOverlay shown={loading} />;

  const totalPages = Math.ceil(totalTours / toursPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleChangeMonth = (selectedDates: Date[]) => {
    if (selectedDates?.[0]) {
      const monthYear = format(selectedDates[0], "yyyy-MM");
      setMonthYear(monthYear);
      setCurrentPage(1);
    }
  };

  return (
    <div>
      <div className="w-[30%] mb-8">
        <DatePicker
          id="month-picker"
          label="Chọn tháng"
          monthSelectMode={true}
          defaultDate={new Date(`${monthYear}-01`)}
          onChange={handleChangeMonth}
        />
      </div>

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
