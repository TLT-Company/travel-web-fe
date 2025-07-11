"use client";

import React, { FC, ChangeEvent, FormEvent } from "react";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import { FormSearchDocumentCustomerParams } from "@/services/documentCustomer.service";

interface FormSearchTourProps {
  formSearch: FormSearchDocumentCustomerParams;
  setFormSearch: (params: FormSearchDocumentCustomerParams) => void;
  onSubmitSearch: (params: FormSearchDocumentCustomerParams) => void;
  loading?: boolean;
}

const FormSearchTour: FC<FormSearchTourProps> = ({
  formSearch, setFormSearch, onSubmitSearch, loading
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
              Tên tour:
            </Label>
            <div className="col-span-3">
              <Input
                id="id"
                name="id"
                value={formSearch.id}
                onChange={handleChange}
                placeholder="Tìm mã thông hành..."
              />
            </div>
          </div>
        </div>
        <div className="col-span-6">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 my-auto">Ngày:</div>
                <div className="col-span-4">
                <DatePicker
                    id="start_date"
                    placeholder="Chọn ngày tạo"
                    defaultDate={formSearch.create_date}
                    onChange={([selected]) =>
                    setFormSearch({
                        ...formSearch,
                        create_date: selected
                        ? selected.toLocaleDateString("en-CA") :
                        "",
                    })
                    }
                />
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <Button
          className="col-span-full px-4 py-2 w-1/4 "
          disabled={loading}
        >
          Tìm kiếm
        </Button>
      </div>
    </Form>
  )
};

export default FormSearchTour;