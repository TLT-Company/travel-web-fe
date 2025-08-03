"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "../../common/LoadingOverlay";
import {
  Custommer,
  getListCustommersByDocumentId,
  FormSearchCustomerParams,
  deleteCustomerById,
  DocumentCustommer
} from "@/services/documentCustomer.service";
import Pagination from "../../tables/Pagination";
import CustomerTable from "./CustomerTable"
import FormSearchCustomer from "./FormSearchCustomer";
import { toast } from 'react-toastify';
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import { format } from "date-fns";


const DocumentDetailPage = () => {
  // const [customers, setCustomers] = useState<Custommer[]>([]);
  const [documentCustomer, setDocumentCustomer] = useState<DocumentCustommer>();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [
    searchParams, setSearchParams
  ] = useState<FormSearchCustomerParams | null>(null);
  const [formSearch, setFormSearch] = useState<FormSearchCustomerParams>({
    card_id : '',
    full_name : ''
  });
  const customersPerPage = 20;
  const params = useParams<{ document_id: string }>()

  const fetchCustomers = useCallback(async () => {
      setLoading(true);
      try {
        const result = await getListCustommersByDocumentId(
          params.document_id,
          {
            ...searchParams,
            page: currentPage,
            limit: customersPerPage,
          });

        if (result.success) {
          // setCustomers(result.data);
          setDocumentCustomer(result.data)
          setTotalCustomers(result.count);
        } else {
          // setCustomers([]);
          setTotalCustomers(0);
        }
      } catch (e) {
        console.log("Error get documents: ", e)
        toast.error("Lỗi khi lấy danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    }, [params.document_id, currentPage, searchParams]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  if (loading) return <LoadingOverlay shown={loading} />;

  const totalPages = Math.ceil(totalCustomers / customersPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSubmit = async (customnerId: string) => {

    if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
      try {
        setLoading(true);
        await deleteCustomerById(params.document_id, Number(customnerId));
        fetchCustomers();
        toast.success('Xóa khách hàng thành công!');
      } catch (error: any) {
          // console.error('Error delete customer:', error);
          // const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa khách hàng';
          // toast.error(errorMessage);
          toast.error(error.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-2">Số thông hành:</div>
          <div className="col-span-10">{documentCustomer?.document_number}</div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-2">Ngày tạo:</div>
          <div className="col-span-10">
            {documentCustomer?.created_at
              ? format(new Date(documentCustomer.created_at), 'dd/MM/yyyy')
              : ''}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-2">Tổng số khách hàng:</div>
          <div className="col-span-10">{documentCustomer?.customer_count}</div>
        </div>
      </div>

      
      <ComponentCard title="Danh sách khách hàng">
        <FormSearchCustomer
          formSearch={formSearch}
          setFormSearch={setFormSearch}
          onSubmitSearch={(params) => {
            setCurrentPage(1);
            setSearchParams(params);
          }}
          loading={loading}
          id= {params.document_id}
        />

        <div className="my-4 text-right">
          <p className="text-sm text-gray-600 mr-1">
            số lượng tìm kiếm: <span className="text-black">{totalCustomers}</span>
          </p>
        </div>

        <CustomerTable 
          // customers={customers} 
          customers={documentCustomer?.customers ?? []} 
          loading={loading} 
          document_id={params.document_id} 
          onSubmitDelete={(customerID) => {
            handleSubmit(customerID);
          }}/>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

      </ComponentCard>
      
    </div>
  );
}

export default DocumentDetailPage;
