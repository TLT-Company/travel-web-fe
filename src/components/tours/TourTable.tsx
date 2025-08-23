"use client";

import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { Tour } from "@/services/tour.service";

interface TourTableProps {
  tours: Tour[];
  loading: boolean;
  onDelete?: (id: number) => void;
  onDownload?: (tour: Tour) => void;
}

const TourTable: FC<TourTableProps> = ({ tours, loading, onDelete, onDownload }) => {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white
                dark:border-white/[0.05] dark:bg-white/[0.03] w-full"
    >
      <div className="w-full max-w-full overflow-x-auto">
        <Table className="table-auto border-collapse">
          <TableHeader
            className="border-b border-gray-100 dark:border-white/[0.05]"
          >
            <TableRow>
              {[
                "Tên Tour",
                "Mô tả",
                "Địa điểm",
                "Giá",
                "Ngày bắt đầu",
                "Ngày kết thúc",
                "Tổng số khách hàng",
                "",
              ].map((title, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start
                            text-theme-xs dark:text-gray-400 whitespace-nowrap"
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
          >
            {tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-4 text-center">
                  Không có tour nào.
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour, index) => (
                <TableRow key={index}>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 min-w-[200px]"
                  >
                    {tour.name}
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 min-w-[400px]"
                  >
                    {tour.description}
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 whitespace-nowrap"
                  >
                    {tour.location}
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 whitespace-nowrap"
                  >
                    {Number(tour.price).toLocaleString()} VND
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="flex justify-center items-center">
                      {format(new Date(tour.start_date), 'dd/MM/yyyy')}
                    </span>
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="flex justify-center items-center">
                      {format(new Date(tour.end_date), 'dd/MM/yyyy')}
                    </span>
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="flex justify-center items-center">
                      {tour.total_customers}
                    </span>
                  </TableCell>
                  <TableCell
                    className="px-4 py-3 text-start text-theme-sm
                              dark:text-gray-400 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/tours/${tour.id}`} passHref>
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={loading}
                        >
                          Xem
                        </Button>
                      </Link>
                      <Link href={`/admin/tours/${tour.id}/edit`} passHref>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          disabled={loading}
                        >
                          Chỉnh sửa
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600"
                        onClick={() => onDownload?.(tour)}
                        disabled={loading || !tour.total_customers || tour.total_customers === 0}
                        aria-label={!tour.total_customers || tour.total_customers === 0 ? "Tour không có khách hàng" : "Download ảnh khách hàng"}
                      >
                        Tải xuống
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => onDelete?.(tour.id)}
                        disabled={loading}
                      >
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TourTable;
