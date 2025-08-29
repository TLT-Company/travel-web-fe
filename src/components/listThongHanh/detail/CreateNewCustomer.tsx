"use client";
import React, { useEffect, useState } from "react";
import FormCustomer from "./CustomerForm";
import {
  CustomerRequest,
  addCustomer
} from "@/services/documentCustomer.service";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

const defaultData: CustomerRequest = {
  card_id: "",
  full_name: "",
  day_of_birth: "",
  gender: "",
  national: "",
  place_of_birth: "",
  village: "",
  card_created_at: "",
  province: "",
  district: "",
  commune: "",
  address: ""
};

const CreateCustomerPage = () => {
  const [formData, setFormData] = useState<CustomerRequest>(defaultData);
  const params = useParams<{ document_id: string }>()
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setFormData({ ...defaultData });
  }, []);

  const handleSubmit = async (values: CustomerRequest) => {
    setIsLoading(true);
    try {
      await addCustomer(values, params.document_id);
      toast.success('Thêm khách hàng thành công!');
      
      router.push(`/admin/thong-hanh/${params.document_id}`);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormCustomer
      formData={formData}
      onSubmit={handleSubmit}
      submitLabel="Thêm mới"
      isLoading = {isLoading}
    />
  );
};

export default CreateCustomerPage;
