"use client";

import React, { FC, ChangeEvent, FormEvent } from "react";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import { FormSearchTourParams } from "@/services/tour.service";
import { EyeIcon } from "@/icons";

interface FormSearchTourProps {
  formSearch: FormSearchTourParams;
  setFormSearch: (params: FormSearchTourParams) => void;
  onSubmitSearch: (params: FormSearchTourParams) => void;
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

  const handleReset = () => {
    const resetForm = {
      name: "",
      location: "",
      price_min: "",
      price_max: "",
      start_date: "",
      end_date: "",
    };
    setFormSearch(resetForm);
    onSubmitSearch(resetForm);
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tên tour */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tên tour
          </Label>
          <Input
            id="name"
            name="name"
            value={formSearch.name}
            onChange={handleChange}
            placeholder="Nhập tên tour..."
            className="w-full"
          />
        </div>

        {/* Địa điểm */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Địa điểm
          </Label>
          <Input
            id="location"
            name="location"
            value={formSearch.location}
            onChange={handleChange}
            placeholder="Nhập địa điểm"
            className="w-full"
          />
        </div>

        {/* Khoảng giá */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Khoảng giá (VND)
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="price_min"
              name="price_min"
              value={formSearch.price_min}
              onChange={handleChange}
              placeholder="Từ"
              className="flex-1"
            />
            <span className="text-gray-500">-</span>
            <Input
              id="price_max"
              name="price_max"
              value={formSearch.price_max}
              onChange={handleChange}
              placeholder="Đến"
              className="flex-1"
            />
          </div>
        </div>

        {/* Khoảng thời gian */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Khoảng thời gian
          </Label>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <DatePicker
                id="start_date"
                placeholder="Từ ngày"
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
            <span className="text-gray-500">-</span>
            <div className="flex-1">
              <DatePicker
                id="end_date"
                placeholder="Đến ngày"
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

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={loading}
          className="px-6"
        >
          Làm mới
        </Button>
        <Button
          className="bg-brand-500 hover:bg-brand-600 px-6"
          disabled={loading}
        >
          <EyeIcon className="w-5 h-5" />
          Tìm kiếm
        </Button>
      </div>
    </Form>
  )
};

export default FormSearchTour;
