import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateTourPage from "@/components/tours/CreateTourPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function NewTour() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tour" />
      <div className="space-y-6">
        <ComponentCard title="Tạo mới tour">
          <CreateTourPage />
        </ComponentCard>
      </div>
    </div>
  );
}
