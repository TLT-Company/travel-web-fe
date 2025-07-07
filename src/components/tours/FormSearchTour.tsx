"use client";

import React, { FC, ChangeEvent, FormEvent, useState } from "react";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import { Tour, tourService } from "@/services/tour.service";

interface FormSearchTourProps {
  onSearchResult: (tours: Tour[]) => void;
  loading?: boolean;
}

interface FormSearchTourParams {
  name?: string,
  location?: string,
  price_min?: string,
  price_max?: string,
  start_date?: string,
  end_date?: string
}

const FormSearchTour: FC<FormSearchTourProps> = ({
  onSearchResult, loading
}) => {
  const [formSearch, setFormSearch] = useState<FormSearchTourParams>({
    name: "",
    location: "",
    price_min: "",
    price_max: "",
    start_date: "",
    end_date: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await tourService.getTourBySearch(formSearch);

      onSearchResult(result.success ? result.data : []);
    } catch (error) {
      console.log(error);
      onSearchResult([]);
    }
  };

  return (
    <Form className="w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <div className="grid grid-cols-4 gap-2">
            <Label htmlFor="name" className="col-span-1 my-auto">
              Tên tour:
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                name="name"
                defaultValue={formSearch.name}
                onChange={handleChange}
                placeholder="Nhập tên tour..."
              />
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <div className="grid grid-cols-4 gap-2">
            <Label htmlFor="location" className="col-span-1 my-auto">
              Địa điểm:
            </Label>
            <div className="col-span-3">
              <Input
                id="location"
                name="location"
                defaultValue={formSearch.location}
                onChange={handleChange}
                placeholder="Nhập địa điểm"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-6">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3 my-auto">Giá:</div>
            <div className="col-span-4">
              <Input
                id="price_min"
                name="price_min"
                defaultValue={formSearch.price_min}
                onChange={handleChange}
                placeholder="Từ ..."
              />
            </div>
            <div className="col-span-1 my-auto mx-auto">~</div>
            <div className="col-span-4">
              <Input
                id="price_max"
                name="price_max"
                defaultValue={formSearch.price_max}
                onChange={handleChange}
                placeholder="Đến ..."
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
                placeholder="Chọn ngày bắt đầu"
                defaultDate={formSearch.start_date}
                onChange={([selected]) =>
                  setFormSearch((prev) => ({
                    ...prev,
                    start_date: selected
                      ? selected.toLocaleDateString("en-CA")
                      : "",
                  }))
                }
              />
            </div>
            <div className="col-span-1 my-auto mx-auto">~</div>
            <div className="col-span-4">
              <DatePicker
                id="end_date"
                placeholder="Chọn ngày kết thúc"
                defaultDate={formSearch.end_date}
                onChange={([selected]) =>
                  setFormSearch((prev) => ({
                    ...prev,
                    end_date: selected
                      ? selected.toLocaleDateString("en-CA")
                      : "",
                  }))
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
