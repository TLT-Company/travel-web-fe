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
import { PencilIcon, TrashBinIcon  } from "@/icons";
import { Custommer } from "@/services/documentCustomer.service";

interface CustomerProps {
  customers: Custommer[];
  document_id: String;
  loading: boolean;
  onSubmitDelete: (customerId: string) => void;
}

const CustomerTable: FC<CustomerProps> = ({ customers, loading, document_id, onSubmitDelete }) => {
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
                  "ID thẻ",
                  "Họ và tên",
                  "Ngày sinh",
                  "Giới tính",
                  "Quốc tịch",
                  "Ngày tạo thẻ",
                  "Thôn",
                  "Xã",
                  "Huyện",
                  "Tỉnh",
                  "..."
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
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-4 text-center">
                    Không có khách hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.card_id}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                       {customer.full_name}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {format(new Date(customer.day_of_birth), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.gender}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.national}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {format(new Date(customer.card_created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.village}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.province}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.district}
                    </TableCell>
                     <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.commune}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/thong-hanh/${document_id}/customer/edit/${customer.id}`} passHref>
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
                          className="bg-red-500 hover:bg-blue-400"
                          onClick={() => onSubmitDelete(customer.id)}
                          disabled={loading}
                        >
                          <TrashBinIcon />
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

export default CustomerTable;