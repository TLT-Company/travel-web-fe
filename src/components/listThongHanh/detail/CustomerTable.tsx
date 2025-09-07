"use client";

import React, { FC, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Checkbox from "@/components/form/input/Checkbox";
import { format } from "date-fns";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon  } from "@/icons";
import { DocumentCustomer } from "@/services/documentCustomer.service";

interface CustomerProps {
  documentCustomers: DocumentCustomer[];
  visibleCustomers: DocumentCustomer[];
  document_id: string;
  loading: boolean;
  onSubmitDelete: (customerId: string) => void;
  selectedCustomers: string[];
  onChangeSelectedCustomers: (selected: string[]) => void;
}

const CustomerTable: FC<CustomerProps> = ({ 
  documentCustomers,
  visibleCustomers,
  loading,
  document_id,
  onSubmitDelete,
  selectedCustomers,
  onChangeSelectedCustomers
  }) => {

  useEffect(() => {
      const initiallySelected = documentCustomers
        .filter(c => c.print_flag === "1")
        .map(c => c.customer.id);
      onChangeSelectedCustomers(initiallySelected);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentCustomers]);

  const toggleSelectAll = () => {
    if (selectedCustomers.length === documentCustomers.length) {
      onChangeSelectedCustomers([]);
    } else {
      onChangeSelectedCustomers(documentCustomers.map(c => c.customer.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      onChangeSelectedCustomers(selectedCustomers.filter(cid => cid !== id));
    } else {
      onChangeSelectedCustomers([...selectedCustomers, id]);
    }
  };

  
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
                <TableCell isHeader className="px-5 py-3">
                  <Checkbox 
                  checked={selectedCustomers?.length === documentCustomers.length && documentCustomers.length > 0} 
                  onChange={toggleSelectAll}
                  />
                </TableCell>
                {[
                  "Tên file",
                  "ID thẻ",
                  "Họ và tên",
                  "Ngày sinh",
                  "Giới tính",
                  "Quốc tịch",
                  "Ngày làm thẻ",
                  "Địa chỉ",
                  "Xã",
                  // "Huyện",
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
              {visibleCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-4 text-center">
                    Không có khách hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                visibleCustomers.map((documentCustomer, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3">
                      <Checkbox 
                      checked={selectedCustomers?.includes(documentCustomer.customer.id)} 
                      onChange={() => toggleSelectCustomer(documentCustomer.customer.id)} 
                    />
                    </TableCell>

                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.file_name || ''}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.customer.card_id}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.customer.full_name}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {format(new Date(documentCustomer.customer.day_of_birth), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.customer.gender}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.customer.national}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {format(new Date(documentCustomer.customer.card_created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {documentCustomer.customer.village}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {/* {customer.commune} */}
                      {documentCustomer.customer.address_mapping?.commune_new}
                    </TableCell>
                    {/* <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {customer.district}
                    </TableCell> */}
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      {/* {customer.province} */}
                      {documentCustomer.customer.address_mapping?.province_new}
                    </TableCell>
                    <TableCell
                      className="px-4 py-3 text-start text-theme-sm
                                dark:text-gray-400"
                    >
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/thong-hanh/${document_id}/customer/edit/${documentCustomer.customer.id}`} passHref>
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
                          onClick={() => onSubmitDelete(documentCustomer.customer.id)}
                          disabled={loading}
                        >
                          <TrashBinIcon className="w-6 h-6" />
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
