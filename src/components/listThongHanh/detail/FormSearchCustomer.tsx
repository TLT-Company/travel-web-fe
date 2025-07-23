"use client";

import React, { FC, ChangeEvent, FormEvent } from "react";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { FormSearchCustomerParams } from "@/services/documentCustomer.service";
import Link from "next/link";

interface FormSearchCustomerProps {
  formSearch: FormSearchCustomerParams;
  setFormSearch: (params: FormSearchCustomerParams) => void;
  onSubmitSearch: (params: FormSearchCustomerParams) => void;
  loading?: boolean;
  id?: string;
}

const FormSearchCustomer: FC<FormSearchCustomerProps> = ({
  formSearch, setFormSearch, onSubmitSearch, loading, id
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSearch({ ...formSearch, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmitSearch(formSearch);
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
            <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="id" className="col-span-1 my-auto">
                ID thẻ:
                </Label>
                <div className="col-span-3">
                <Input
                    id="card_id"
                    name="card_id"
                    value={formSearch.card_id}
                    onChange={handleChange}
                    placeholder="Tìm ID thẻ..."
                />
                </div>
            </div>
        </div>
        <div className="col-span-6">
            <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="id" className="col-span-1 my-auto">
                Tên khách hàng:
                </Label>
                <div className="col-span-3">
                <Input
                    id="full_name"
                    name="full_name"
                    value={formSearch.full_name}
                    onChange={handleChange}
                    placeholder="Tìm tên khách hàng..."
                />
                </div>
            </div>
        </div>
      </div>

      <div className="relative w-full my-4">
        <div className="flex justify-center">
          <Button className="col-span-full px-4 py-2 w-1/4" disabled={loading}>
            Tìm kiếm
          </Button>
        </div>

        <div className="absolute right-0 top-0">
          <Link href={`/admin/thong-hanh/${id}/customer/new`} passHref>
            <Button className="px-4 py-2" disabled={loading}>
              Thêm mới
            </Button>
          </Link>
        </div>
      </div>
    </Form>
  )
};

export default FormSearchCustomer;