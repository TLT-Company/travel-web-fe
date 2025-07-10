"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from 'date-fns';
import LoadingOverlay from "../common/LoadingOverlay";
import { PencilIcon } from "@/icons";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import Badge from "../ui/badge/Badge";
import { getTourDetail, Tour } from "@/services/tour.service";

export default function EditTourPage() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await getTourDetail(Number(id));
        setTour(res.data);
      } catch (e) {
        console.log("Error fetching tour:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) return <LoadingOverlay />;
  if (!tour) return <div>Không tìm thấy tour</div>;

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {tour.name}
      </h1>

      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2 font-bold">Mô tả:</div>
        <div className="col-span-10">{tour.description}</div>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2 font-bold">Địa điểm:</div>
        <div className="col-span-10">{tour.location}</div>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2 font-bold">Giá:</div>
        <div className="col-span-10">
          {Number(tour.price).toLocaleString()} VNĐ
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2 font-bold">Ngày bắt đầu:</div>
        <div className="col-span-10">
          {format(new Date(tour.start_date), 'dd/MM/yyyy')}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2 font-bold">Ngày kết thúc:</div>
        <div className="col-span-10">
          {format(new Date(tour.end_date), 'dd/MM/yyyy')}
        </div>
      </div>

      {/* Danh sách booking */}
      <h2 className="text-xl font-semibold mb-2">Danh sách booking</h2>
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
                    Tên người đặt tour
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start
                              text-theme-xs dark:text-gray-400"
                  >
                    Ngày đặt
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start
                              text-theme-xs dark:text-gray-400"
                  >
                    Tên nhân viên
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start
                              text-theme-xs dark:text-gray-400"
                  >
                    Trạng thái
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
                {tour.bookings && tour.bookings.length > 0 ? (
                  tour.bookings.map((booking, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className="px-4 py-3 text-start text-theme-sm
                                  dark:text-gray-400"
                      >
                        {booking.customer.full_name}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-start text-theme-sm
                                  dark:text-gray-400"
                      >
                        {format(new Date(booking.booking_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-start text-theme-sm
                                  dark:text-gray-400"
                      >
                        {booking.assignedAdmin.username}
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-start text-theme-sm
                                  dark:text-gray-400"
                      >
                        <Badge
                          size="sm"
                          color={
                            booking.status === "confirmed"
                              ? "success"
                              : booking.status === "pending"
                              ? "warning"
                              : "error"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-start text-theme-sm
                                  dark:text-gray-400"
                      >
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/bookings/${booking.id}/edit`} passHref>
                            <Button
                              size="sm"
                              className="bg-gray-500 hover:bg-gray-600"
                            >
                              <PencilIcon className="w-6 h-6" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Không có booking nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
