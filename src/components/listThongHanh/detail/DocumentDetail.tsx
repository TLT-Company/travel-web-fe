"use client";

import React, { useCallback, useEffect, useState } from "react";
import LoadingOverlay from "../../common/LoadingOverlay";
import {
  getListCustommersByDocumentId,
  FormSearchCustomerParams,
  deleteCustomerById,
  Document
} from "@/services/documentCustomer.service";
import { documentExportService } from "@/services/export-tour.service";
import Pagination from "../../tables/Pagination";
import CustomerTable from "./CustomerTable"
import FormSearchCustomer from "./FormSearchCustomer";
import { toast } from 'react-toastify';
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import { format } from "date-fns";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import SanIDModal from "./IdCardScanPage";


const DocumentDetailPage = () => {
  // const [customers, setCustomers] = useState<Custommer[]>([]);
  const [documentCustomer, setDocumentCustomer] = useState<Document>();
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [exportingCSV, setExportingCSV] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
      setLoading(true);
      try {
        const result = await getListCustommersByDocumentId(
          params.document_id,
          {
            ...searchParams,
            // page: currentPage,
            // limit: customersPerPage,
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
    // }, [params.document_id, currentPage, searchParams]);
    }, [params.document_id, searchParams]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Calculate the customer array to display per page
  const paginatedCustomers = React.useMemo(() => {
    if (!documentCustomer?.document_customers) return [];
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    return documentCustomer.document_customers.slice(startIndex, endIndex);
  }, [documentCustomer, currentPage, customersPerPage]);

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
      } catch (error) {
          // console.error('Error delete customer:', error);
          // const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa khách hàng';
          // toast.error(errorMessage);
          toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExportCSV = async (documentId: string, documentNumber: string) => {
      if (exportingCSV === documentId) return; // Prevent multiple clicks
  
      setExportingCSV(documentId);
      try {
        const response = await documentExportService.exportCustomerCSV(documentId, selectedCustomers, formSearch.card_id, formSearch.full_name);
  
        if (response.ok) {
          // Get the CSV content directly from the response
          const csvContent = await response.text();
  
          // Add BOM for proper UTF-8 encoding (especially for Vietnamese characters)
          const BOM = '\uFEFF';
          const csvWithBOM = BOM + csvContent;
  
          // Create and download CSV file
          const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${documentNumber}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
  
          toast.success("Xuất CSV thành công!");

          fetchCustomers();
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.message || `Xuất CSV thất bại! (${response.status})`;
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("CSV export error:", error);
        toast.error("Có lỗi xảy ra khi xuất CSV!");
      } finally {
        setExportingCSV(null);
      }
    };

  const handleAddSuccess = () => {
    fetchCustomers();
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
          <div className="col-span-2">Ngày khởi hành:</div>
          <div className="col-span-10">
            {documentCustomer?.departure_date
              ? format(new Date(documentCustomer.departure_date), 'dd/MM/yyyy')
              : ''}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-2">Tổng số khách hàng:</div>
          <div className="col-span-10">{documentCustomer?.customer_count}</div>
        </div>
      </div>

      <div className="relative">
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
            Số lượng khách hàng: <span className="text-black">{totalCustomers}</span>
          </p>
        </div>

        <CustomerTable
          // customers={customers}
          documentCustomers={documentCustomer?.document_customers ?? []}
          visibleCustomers={paginatedCustomers ?? []}
          loading={loading}
          document_id={params.document_id}
          onSubmitDelete={(customerID) => {
            handleSubmit(customerID);
          }}
          selectedCustomers={selectedCustomers}
          onChangeSelectedCustomers={setSelectedCustomers}
          />

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <Button
          className="absolute top-4 right-6 z-10 px-4 py-2 bg-green-500 hover:bg-green-600"
          onClick={() => handleExportCSV(documentCustomer!.id, documentCustomer!.document_number)}
          disabled={loading || exportingCSV === documentCustomer!.id}
        >
          {exportingCSV === documentCustomer!.id ? "Đang xuất..." : "Xuất CSV"}
        </Button>

        <Link href={`/admin/thong-hanh/${params.document_id}/customer/new`} passHref>
          <Button  className="absolute top-4 right-35 z-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>
            Thêm mới
          </Button>
        </Link>

        <Button  className="absolute top-4 right-65 z-10 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
            disabled={loading}
             onClick={() => setIsAddModalOpen(true)}
             >
            Quét căn cước công dân
        </Button>

         <SanIDModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
          document_id = {params.document_id}
        />

      </ComponentCard>
      </div>
      
    </div>
  );
}

export default DocumentDetailPage;
