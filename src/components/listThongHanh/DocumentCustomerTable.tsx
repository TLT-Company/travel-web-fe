"use client";

import React, { FC, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

import { DocumentCustommer } from "@/services/documentCustomer.service";
import { documentExportService } from "@/services/export-tour.service";
import { toast } from "react-toastify";
import EditDocumentModal from "./EditDocumentModal";

interface DocumentCustomerProps {
  documentCustomers: DocumentCustommer[];
  loading: boolean;
  onSuccess: () => void;
}

const DocumentCustomerTable: FC<DocumentCustomerProps> = ({
  documentCustomers, loading, onSuccess
}) => {
  const [exportingCSV, setExportingCSV] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentCustommer | null>(null);

  const handleExport = async (documentNumber: string) => {
    try {
      const response = await documentExportService.performAnalysis(documentNumber);

      if (response.success) {
        toast.success(response.message || "Trích xuất thông tin thành công!");
      } else {
        toast.error(response.message || "Trích xuất thông tin thất bại!");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Có lỗi xảy ra khi trích xuất thông tin!");
    }
  };

  const handleExportCSV = async (documentId: string, documentNumber: string) => {
    if (exportingCSV === documentId) return; // Prevent multiple clicks

    setExportingCSV(documentId);
    try {
      const response = await documentExportService.exportCustomerCSV(documentId);

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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="px-4 py-3">Số thông hành</th>
            <th className="px-4 py-3">Ngày tạo</th>
            <th className="px-4 py-3">Số lượng khách hàng</th>
            <th className="px-4 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {documentCustomers.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                Không có số thông hành nào.
              </td>
            </tr>
          ) : (
            documentCustomers.map((documentCustomer, index) => (
              <tr key={index} className="text-sm border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  {documentCustomer.document_number}
                </td>
                <td className="px-4 py-3">
                  {format(new Date(documentCustomer.created_at), 'dd/MM/yyyy')}
                </td>
                <td className="px-4 py-3">
                  {documentCustomer.customer_count}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/thong-hanh/${documentCustomer.id}`} passHref>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
                        disabled={loading}
                      >
                        Chi tiết
                      </Button>
                    </Link>
                    <Button
                      className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1"
                      onClick={() => {
                        setSelectedDocument(documentCustomer);
                        setIsEditModalOpen(true)
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                      onClick={() => handleExport(documentCustomer.document_number)}
                      disabled={loading}
                    >
                      Trích xuất
                    </Button>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1"
                      onClick={() => handleExportCSV(documentCustomer.id, documentCustomer.document_number)}
                      disabled={loading || exportingCSV === documentCustomer.id}
                    >
                      {exportingCSV === documentCustomer.id ? "Đang xuất..." : "Xuất CSV"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <EditDocumentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onSuccess}
        documentId={selectedDocument?.id}
      />
    </div>
  );
};

export default DocumentCustomerTable;