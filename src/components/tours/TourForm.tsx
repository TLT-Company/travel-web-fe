"use client";

import React, { FC, useState, ChangeEvent, FormEvent, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import type { Tour, TourFormData } from "@/services/tour.service";

interface TourFormProps {
  isCreate: boolean;
  tour?: Tour;
  onSubmit: (data: {
    formData: TourFormData;
    images: File[];
  }) => void;
  loading: boolean;
}

const TourForm: FC<TourFormProps> = ({ isCreate, tour, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    start_date: "",
    end_date: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const text = isCreate ? "Tạo" : "Chỉnh sửa";

  useEffect(() => {
    if (tour) {
      setFormData({
        name: tour.name || "",
        description: tour.description || "",
        location: tour.location || "",
        price: String(tour.price || ""),
        start_date: tour.start_date ? tour.start_date.slice(0, 10) : "",
        end_date: tour.end_date ? tour.end_date.slice(0, 10) : "",
      });
    }
  }, [tour]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    field: "start_date" | "end_date", date: Date | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toLocaleDateString("en-CA") : "",
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 10);
      setImages(selectedFiles);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ formData, images });
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <Form
        className="space-y-5 col-span-2 col-start-2"
        onSubmit={handleSubmit}
      >
        <div>
          <Label htmlFor="name">Tên tour</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên tour"
          />
        </div>

        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả"
          />
        </div>

        <div>
          <Label htmlFor="location">Địa điểm</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Địa điểm"
          />
        </div>

        <div>
          <Label htmlFor="price">Giá</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Giá tour"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ngày bắt đầu</Label>
            <DatePicker
              id="start_date"
              placeholder="Chọn ngày bắt đầu"
              defaultDate={formData.start_date}
              onChange={([date]) => handleDateChange("start_date", date)}
            />
          </div>

          <div>
            <Label>Ngày kết thúc</Label>
            <DatePicker
              id="end_date"
              placeholder="Chọn ngày kết thúc"
              defaultDate={formData.end_date}
              onChange={([date]) => handleDateChange("end_date", date)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="images">Ảnh tour (tối đa 10 ảnh)</Label>
          <Input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {images.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {images.length} ảnh đã chọn
            </p>
          )}
        </div>

        <div className="flex justify-center my-4">
          <Button className="col-span-full px-4 py-2 w-1/4 " disabled={loading}>
            {loading ? `Đang ${text}...` : `${text} tour`}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TourForm;
