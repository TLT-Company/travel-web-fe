"use client";
import React, { useEffect, useState } from "react";
import FormCustomer from "@/components/customers/CustomerForm";
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
  commune: ""
};

const CreateCustomerPage = () => {
  const [formData, setFormData] = useState<CustomerRequest>(defaultData);
  const params = useParams<{ document_id: string }>()
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: CustomerRequest) => {
      setIsLoading(true);
      try {
        const reponse = await addCustomer(values, params.document_id);

        toast.success('Thêm khách hàng thành công!');
        formData.card_id = ""
        formData.full_name = ""
        formData.day_of_birth = ""
        formData.gender = ""
        formData.national = ""
        formData.place_of_birth = ""
        formData.village = ""
        formData.card_created_at = "",
        formData.province = ""
        formData.district = ""
        formData.commune = ""
        
        router.push(`/admin/thong-hanh/${params.document_id}`);
        
      } catch (error: unknown) {
        console.error('Error registering customer:', error);
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm nhân viên';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <FormCustomer
      formData={formData}
      onSubmit={(params) => {
        handleSubmit(params);
      }}
      submitLabel="Thêm mới"
      isLoading = {isLoading}
    />
  );
};

export default CreateCustomerPage;
