"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type Employer = {
  id: string;
  admin_id: string;
  full_name: string;
  referral_code: string;
  phone_number: string;
  picture: string;
  gender: string;
  address: string;
  day_of_birth: string;
  created_at: string;
};

type Admin = {
  id: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  employer: Employer;
};

type AdminContextType = {
  admin: Admin | null;
  setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
