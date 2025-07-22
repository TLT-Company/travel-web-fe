"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  const [documents, setDocuments] = useState<DocumentCustommer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [
    searchParams, setSearchParams
  ] = useState<FormSearchDocumentCustomerParams | null>(null);
  const [formSearch, setFormSearch] = useState<FormSearchDocumentCustomerParams>({
    document_number: "",
    start_date: '',
    end_date: ''
  });
  const documentsPerPage = 20;

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getListDocumentCustommers({
        ...searchParams,
        page: currentPage,
        limit: documentsPerPage,
      });

      if (result.success) {
        setDocuments(result.data);
        setTotalDocuments(result.count);
      } else {
        setDocuments([]);
        setTotalDocuments(0);
      }
    } catch (e) {
      console.log("Error get documents: ", e)
      toast.error("Lỗi khi lấy danh sách thông hành");
    } finally {
      setLoading(false);
    } 
  }, [currentPage, searchParams]);
    
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (loading) return <LoadingOverlay shown={loading} />;

  const totalPages = Math.ceil(totalDocuments / documentsPerPage);

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

      <DocumentCustomerTable documentCustomers={documents} loading={loading} />

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
