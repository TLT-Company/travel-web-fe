"use client";
import React, { useEffect, useState } from "react";
import FormCustomer from "./CustomerForm";
import { CustomerRequest, getCustomerById, updateCustomer} from "@/services/documentCustomer.service";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

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

const EditCustomerPage = () => {
  const params = useParams<{ customer_id: string, document_id: string }>();
  const [formData, setFormData] = useState<CustomerRequest>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customer = await getCustomerById(Number(params.customer_id));
        setFormData(customer.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Không thể tải dữ liệu khách hàng");
        router.push(`/admin/thong-hanh/${params.document_id}`);
      } finally {
        setIsLoading(false)
      }
    };

    fetchCustomer();
  }, [params.customer_id, params.document_id, router]);

  const handleSubmit = async (values: CustomerRequest) => {
    setIsLoading(true);
    try {
      await updateCustomer(values, Number(params.customer_id));
      toast.success("Cập nhật thông tin khách hàng thành công!");
      router.push(`/admin/thong-hanh/${params.document_id}`);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Có lỗi khi cập nhật thông tin khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormCustomer
      formData={formData}
      onSubmit={handleSubmit}
      submitLabel="Cập nhật"
      isLoading={isLoading}
    />
  );
};

export default EditCustomerPage;
