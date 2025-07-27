import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ToursPage from "@/components/tours/ToursPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function Tours() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <PageBreadcrumb pageTitle="Tour" />
      <div className="space-y-6">
        <ComponentCard
          title="Danh sách tour"
          buttonText="Tạo mới"
          linkHref="/admin/tours/new"
        >
          <ToursPage />
        </ComponentCard>
      </div>
    </div>
  );
}
