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
import { DocumentCustommer } from "@/services/documentCustomer.service";

interface DocumentCustomerProps {
  documentCustomers: DocumentCustommer[];
  loading: boolean;
}

const DocumentCustomerTable: FC<DocumentCustomerProps> = ({ documentCustomers, loading }) => {
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
                  "Số thông hành",
                  "Ngày tạo",
                  "Số lượng khách hàng",
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
              {documentCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-4 text-center">
                    Không có số thông hành nào.
                  </TableCell>
                </TableRow>
              ) : (
                documentCustomers.map((documentCustomer, index) => (
                  <TableRow key={index}>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.document_number}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                       {format(new Date(documentCustomer.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.customer_count}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/thong-hanh/${documentCustomer.id}`} passHref>
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

export default DocumentCustomerTable;