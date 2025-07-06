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
import { PencilIcon, DownloadIcon } from "@/icons";
import { Tour } from "@/services/tour.service";

interface TourTableProps {
  tours: Tour[];
  loading: boolean;
}

const TourTable: FC<TourTableProps> = ({ tours, loading }) => {
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
                {[
                  "Tên Tour",
                  "Mô tả",
                  "Địa điểm",
                  "Giá",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "",
                ].map((title, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start
                              text-theme-xs dark:text-gray-400"
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
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/tours/${tour.id}/edit`} passHref>
                          <Button
                            size="sm"
                            className="bg-gray-500 hover:bg-gray-600"
                            disabled={loading}
                          >
                            <PencilIcon className="w-6 h-6" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => {}}
                          disabled={loading}
                        >
                          <DownloadIcon />
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
    </div>
  );
};

export default TourTable;
