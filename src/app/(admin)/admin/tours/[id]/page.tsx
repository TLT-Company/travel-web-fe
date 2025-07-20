import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ShowTourPage from "@/components/tours/ShowTourPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function ShowTour() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tour" />
      <div className="space-y-6">
        <ComponentCard title="Chi tiết tour">
          <ShowTourPage />
        </ComponentCard>
      </div>
    </div>
  );
}
