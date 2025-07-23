"use client";

import React, { FC, ChangeEvent, FormEvent } from "react";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import { FormSearchDocumentCustomerParams } from "@/services/documentCustomer.service";

interface FormSearchDocumentProps {
  formSearch: FormSearchDocumentCustomerParams;
  setFormSearch: (params: FormSearchDocumentCustomerParams) => void;
  onSubmitSearch: (params: FormSearchDocumentCustomerParams) => void;
  loading?: boolean;
}

const FormSearchDocumentCustomer: FC<FormSearchDocumentProps> = ({
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
              Số thông hành:
            </Label>
            <div className="col-span-3">
              <Input
                id="document_number"
                name="document_number"
                value={formSearch.document_number}
                onChange={handleChange}
                placeholder="Tìm mã thông hành..."
              />
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3 my-auto">Ngày tạo:</div>
            <div className="col-span-4">
              <DatePicker
                id="start_date"
                placeholder="ngày bắt đầu"
                defaultDate={formSearch.start_date}
                onChange={([selected]) =>
                  setFormSearch({
                    ...formSearch,
                    start_date: selected
                      ? selected.toLocaleDateString("en-CA") :
                      "",
                  })
                }
              />
            </div>
            <div className="col-span-1 my-auto mx-auto">~</div>
              <div className="col-span-4">
                <DatePicker
                  id="end_date"
                  placeholder="ngày kết thúc"
                  defaultDate={formSearch.end_date}
                  onChange={([selected]) =>
                    setFormSearch({
                      ...formSearch,
                      end_date: selected
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

export default FormSearchDocumentCustomer;