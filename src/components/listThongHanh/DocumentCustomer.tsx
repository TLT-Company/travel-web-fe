"use client";

import React, { useEffect, useState } from "react";
import LoadingOverlay from "../common/LoadingOverlay";
import {
  DocumentCustommer,
  FormSearchDocumentCustomerParams,
  getListDocumentCustommers
} from "@/services/documentCustomer.service";
import Pagination from "../tables/Pagination";
import DocumentCustomerTable from "./DocumentCustomerTable";
import FormSearchDocumentCustomer from "./FormSearchDocumentCustomer";
import { toast } from 'react-toastify';


const DocumentCustomerPage = () => {
  const [tours, setTours] = useState<DocumentCustommer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalTours, setTotalTours] = useState<number>(0);
  const [
    searchParams, setSearchParams
  ] = useState<FormSearchDocumentCustomerParams | null>(null);
  const [formSearch, setFormSearch] = useState<FormSearchDocumentCustomerParams>({
    id: "",
    create_date: ''
  });
  const toursPerPage = 20;

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const result = await getListDocumentCustommers({
          ...searchParams,
          page: currentPage,
          limit: toursPerPage,
        });

        if (result.success) {
          setTours(result.data);
          setTotalTours(result.count);
        } else {
          setTours([]);
          setTotalTours(0);
        }
      } catch (e) {
        console.log("Error get tours: ", e)
        toast.error("Lỗi khi lấy danh sách tour");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentPage, searchParams]);

  if (loading) return <LoadingOverlay shown={loading} />;

  const totalPages = Math.ceil(totalTours / toursPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <FormSearchDocumentCustomer
        formSearch={formSearch}
        setFormSearch={setFormSearch}
        onSubmitSearch={(params) => {
          setCurrentPage(1);
          setSearchParams(params);
        }}
        loading={loading}
      />

      <DocumentCustomerTable documentCustomers={tours} loading={loading} />

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

export default DocumentCustomerPage;
