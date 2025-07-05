"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import axios from "axios";
import { format } from 'date-fns';
import LoadingOverlay from "../common/LoadingOverlay";
import { PencilIcon } from "@/icons";

interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  location: string;
}

interface TourResponse {
  success: boolean;
  count: number;
  message: string;
  data: Tour[];
}


export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get<TourResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}tours?page=0`
        );
        if (res.data.data) {
          const tours = res.data.data.map((tour: Tour) => ({
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

  return (
    <div
      className="overflow-hidden rounded-xl border border-gray-200 bg-white
                dark:border-white/[0.05] dark:bg-white/[0.03]"
    >
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader
              className="border-b border-gray-100 dark:border-white/[0.05]"
            >
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  Tên Tour
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  Mô tả
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  Địa điểm
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  Giá
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  Ngày bắt đầu
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  Ngày kết thúc
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400"
                >
                  {``}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody
              className="divide-y divide-gray-100 dark:divide-white/[0.05]"
            >
              {tours.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-4 text-center">
                    Không có tour nào.
                  </TableCell>
                </TableRow>
              ) : (
                tours.map((tour, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {tour.name}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {tour.description}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {tour.location}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {tour.price.toLocaleString()} VND
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      <span className="flex justify-center items-center">
                        {format(new Date(tour.start_date), 'dd/MM/yyyy')}
                      </span>
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      <span className="flex justify-center items-center">
                        {format(new Date(tour.end_date), 'dd/MM/yyyy')}
                      </span>
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      <a
                        href={`/tours/${tour.id}/edit`}
                        className="flex justify-center items-center"
                      >
                        <PencilIcon />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
