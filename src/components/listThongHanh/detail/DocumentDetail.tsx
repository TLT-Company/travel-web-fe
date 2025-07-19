"use client";

import React, { useEffect, useState } from "react";
import LoadingOverlay from "../../common/LoadingOverlay";
import {
  Custommer,
  getListCustommersByDocumentId,
  FormSearchCustomerParams,
  deleteCustomerById
} from "@/services/documentCustomer.service";
import Pagination from "../../tables/Pagination";
import CustomerTable from "./CustomerTable"
import FormSearchCustomer from "./FormSearchCustomer";
import { toast } from 'react-toastify';
import { useParams } from "next/navigation";


const DocumentDetailPage = () => {
  const [customers, setCustomers] = useState<Custommer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [
    searchParams, setSearchParams
  ] = useState<FormSearchCustomerParams | null>(null);
  const [formSearch, setFormSearch] = useState<FormSearchCustomerParams>({});
  const customersPerPage = 5;
  const params = useParams<{ document_id: string }>()

  const fetchCustomers = async () => {
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
          console.log(result.data)
          setCustomers(result.data);
          setTotalCustomers(result.count);
        } else {
          setCustomers([]);
          setTotalCustomers(0);
        }
      } catch (e) {
        console.log("Error get documents: ", e)
        toast.error("Lỗi khi lấy danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCustomers();
  }, [params.document_id, currentPage, searchParams]);

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
      } catch (error: unknown) {
          console.error('Error delete customer:', error);
          const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa khách hàng';
          toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div>
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

      <CustomerTable 
        customers={customers} 
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
      
    </div>
  );
}

export default DocumentDetailPage;
