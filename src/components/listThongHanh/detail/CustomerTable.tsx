"use client";

import React, { FC, useEffect, useRef } from "react";
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
import { DocumentCustomer, FormSearchCustomerParams } from "@/services/documentCustomer.service";
import Sortable from "sortablejs";

interface CustomerProps {
  documentCustomers: DocumentCustomer[];
  visibleCustomers: DocumentCustomer[];
  document_id: string;
  loading: boolean;
  onSubmitDelete: (customerId: string) => void;
  selectedCustomers: string[];
  onChangeSelectedCustomers: (selected: string[]) => void;
  searchParams: FormSearchCustomerParams | null;
}

const CustomerTable: FC<CustomerProps> = ({ 
  documentCustomers,
  visibleCustomers,
  loading,
  document_id,
  onSubmitDelete,
  selectedCustomers,
  onChangeSelectedCustomers,
  searchParams
  }) => {

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
      const initiallySelected = documentCustomers
        .filter(c => c.print_flag === "1")
        .map(c => c.customer.id);
      onChangeSelectedCustomers(initiallySelected);

      if (tableBodyRef.current && (searchParams?.card_id == '' && searchParams?.full_name == '' || searchParams == null)) {
        const sortable = Sortable.create(tableBodyRef.current, {
          animation: 150,
          ghostClass: "bg-blue-100", // hàng đang kéo
          chosenClass: "bg-gray-100", // hàng được chọn
          dragClass: "opacity-50",   // khi kéo sẽ mờ
          onEnd: (evt) => {
            if (!visibleCustomers || visibleCustomers.length === 0) {
              console.log("visibleCustomers is empty or null");
              return;
            }
            
            // Lấy thứ tự mới từ DOM sau khi kéo thả
            const tableRows = tableBodyRef.current?.querySelectorAll('tr[data-id]');
            
            if (!tableRows || tableRows.length === 0) {
              console.log("No table rows found");
              return;
            }
            
            const newOrder = Array.from(tableRows).map((row, index) => {
              const customerId = row.getAttribute('data-id');
              const found = visibleCustomers.find(c => {
                return c.customer.id == customerId; // Sử dụng == thay vì === để so sánh string và number
              });
              return found;
            }).filter(Boolean) as DocumentCustomer[];

            // console.log(
            //   "Thứ tự mới:",
            //   newOrder.map((c, index) => ({
            //     id: c.customer.id,
            //     stt: index + 1,
            //     name: c.customer.full_name,
            //   }))
            // )
            const customerList = newOrder.map((c, index) => ({
              id: c.customer.id,
              stt: index + 1,
              name: c.customer.full_name,
            }));
            handleUpdateSttCustomer(customerList);
            // 👉 Có thể truyền callback để update state từ cha
          },
        });
    
        return () => sortable.destroy();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentCustomers]);

  console.log(searchParams, "searchParams");

  // useEffect(() => {
  //   if (tableBodyRef.current) {
  //     const sortable = Sortable.create(tableBodyRef.current, {
  //       animation: 150,
  //       ghostClass: "bg-blue-100", // hàng đang kéo
  //       chosenClass: "bg-gray-100", // hàng được chọn
  //       dragClass: "opacity-50",   // khi kéo sẽ mờ
  //       onEnd: (evt) => {
  //         if (!visibleCustomers || visibleCustomers.length === 0) {
  //           console.log("visibleCustomers is empty or null");
  //           return;
  //         }
          
  //         // Lấy thứ tự mới từ DOM sau khi kéo thả
  //         const tableRows = tableBodyRef.current?.querySelectorAll('tr[data-id]');
          
  //         if (!tableRows || tableRows.length === 0) {
  //           console.log("No table rows found");
  //           return;
  //         }
          
  //         const newOrder = Array.from(tableRows).map((row, index) => {
  //           const customerId = row.getAttribute('data-id');
  //           const found = visibleCustomers.find(c => {
  //             return c.customer.id == customerId; // Sử dụng == thay vì === để so sánh string và number
  //           });
  //           return found;
  //         }).filter(Boolean) as DocumentCustomer[];
  
  //         console.log("Thứ tự mới:", newOrder.map(c => c.customer.full_name));
  //         // 👉 Có thể truyền callback để update state từ cha
  //       },
  //     });
  
  //     return () => sortable.destroy();
  //   }
  // }, []);

  const handleUpdateSttCustomer = async (customerList: any) => {
    console.log("customerList", customerList);
    // try {
    //   await updateSttCustomer(id, stt);
    // } catch (error) {
    //   console.error("Error updating customer:", error);
    //   toast.error("Có lý khi cập nhật thư tự khách hàng");
    // }
  };

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
              ref={tableBodyRef}
              // ✅ thêm ref
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
                  <TableRow key={documentCustomer.customer.id} data-id={documentCustomer.customer.id} className="cursor-move">
                    {/* <TableCell className="px-4 py-3 drag-handle cursor-move">☰</TableCell> */}
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
