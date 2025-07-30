// import ToursPage from "@/components/tours/ToursPage";
import CollaboratorInfoCard from "@/components/collaborator/profile/CollaboratorInfoCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

export default function Tours() {
  return (
    <div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Profile
        </h3>
        <div className="space-y-6">
            <CollaboratorInfoCard />
        </div>
        </div>
    </div>
  );
}
