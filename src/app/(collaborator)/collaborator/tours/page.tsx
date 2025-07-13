import ToursPage from "@/components/collaborator/tours/ToursPage";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ToursPage from "@/components/tours/ToursPage";
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
        <ComponentCard title="Danh sách tour">
          <ToursPage />
        </ComponentCard>
      </div>
    </div>
  );
}
