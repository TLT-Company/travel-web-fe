import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CompletedToursPage from "@/components/tours/CompletedToursPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function Tours() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tour" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách tours đã hoàn thành">
          <CompletedToursPage />
        </ComponentCard>
      </div>
    </div>
  );
}
