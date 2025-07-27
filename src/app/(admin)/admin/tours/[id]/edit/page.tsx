import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EditTourPage from "@/components/tours/EditTourPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function EditTour() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <PageBreadcrumb pageTitle="Tour" />
      <div className="space-y-6">
        <ComponentCard title="Chi tiết tour">
          <EditTourPage />
        </ComponentCard>
      </div>
    </div>
  );
}
