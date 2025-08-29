"use client";

import React, { FC, useState, useEffect } from "react";
import {
  CustomerRequest,
} from "@/services/documentCustomer.service";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from "formik";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import { getAllCommunesByProvinceID, getProvinces } from "@/services/province.service";
import { useRouter } from "next/navigation";

interface Props {
  formData: CustomerRequest;
  onSubmit: (params: CustomerRequest) => void;
  submitLabel?: string;
  isLoading?: boolean;
}

const CustomerForm: FC<Props> = ({
  formData,
  onSubmit,
  submitLabel,
  isLoading
}) => {

  const router = useRouter();
  const genderOptions = [
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
  ];

  const nationalOptions = [
    { value: 'Việt Nam', label: 'Việt Nam' },
    { value: 'Trung Quốc', label: 'Trung Quốc' },
  ];

  const [provinceOptions, setProvinceOptions] = useState<{ value: string; label: string; code: string }[]>([]);
  // const [districtOptions, setDistrictOptions] = useState<{ value: string; label: string; code: string }[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [communeOptions, setCommuneOptions] = useState<{ value: string; label: string }[]>([]);
  // const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);

  useEffect(() => {
  const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = data.data.map((item: any) => ({
          value: cleanLocationName(item.tentinh),
          label: cleanLocationName(item.tentinh),
          code: item.mahc,
        }));
        setProvinceOptions(options);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);


  function cleanLocationName (name: string) {
    return name.replace(/^(Thủ đô |tỉnh |Tỉnh |thành phố |Thành phố |Quận |Huyện |Thị xã |Phường |Xã |Thị trấn )/, '').trim();
  }

  useEffect(() => {
  const fetchCommunes = async () => {
      if (!selectedProvinceCode) return;
      try {
        const data = await getAllCommunesByProvinceID(selectedProvinceCode);

        const options = [
          { value: "", label: "Chọn Xã/ Phường" },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...data.data.map((item: any) => ({
            value: item.tenhc,
            label: item.tenhc,
          }))
        ];
        setCommuneOptions(options);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchCommunes();
  }, [selectedProvinceCode]);

  // useEffect(() => {
  // const fetchDistricts = async () => {
  //     if (!selectedProvinceCode) return;
  //     try {
  //       const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`);
  //       const data = await res.json();

  //       const options = [
  //         { value: "", label: "Chọn Quận/Huyện" },
  //         ...data.districts.map((item: any) => ({
  //           value: item.name,
  //           label: item.name,
  //           code: item.code,
  //         }))
  //       ];
  //       setDistrictOptions(options);
  //     } catch (error) {
  //       console.error("Error fetching districts:", error);
  //     }
  //   };
  //   fetchDistricts();
  // }, [selectedProvinceCode]);

  // useEffect(() => {
  // const fetchCommunes = async () => {
  //   if (!selectedDistrictCode) return;
  //     try {
  //       const res = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrictCode}?depth=2`);
  //       const data = await res.json();

  //       const options = [
  //         { value: "", label: "Chọn Xã/Phường" },
  //         ...data.wards.map((item: any) => ({
  //           value: item.name,
  //           label: item.name,
  //         }))
  //       ];
  //       setCommuneOptions(options);
  //     } catch (error) {
  //       console.error("Error fetching communes:", error);
  //     }
  //   };
  //   fetchCommunes();
  // }, [selectedDistrictCode]);

  useEffect(() => {
    if (formData.province) {
      const province = provinceOptions.find(p => p.value === formData.province);
      if (province) {
        setSelectedProvinceCode(Number(province.code));
      }
    }
  }, [formData.province, provinceOptions]);

  // useEffect(() => {
  //   if (formData.district) {
  //     const district = districtOptions.find(d => d.value === formData.district);
  //     if (district) {
  //       setSelectedDistrictCode(Number(district.code));
  //     }
  //   }
  // }, [formData.district, districtOptions]);

  const handleSubmit = async (values: {
        card_id: string;
        full_name: string;
        day_of_birth: string;
        gender: string;
        national: string;
        place_of_birth: string;
        village: string;
        card_created_at: string;
        province: string;
        // district: string;
        commune: string
      }) => {
        formData.card_id = values.card_id;
        formData.full_name = values.full_name;
        formData.day_of_birth = values.day_of_birth;
        formData.gender = values.gender;
        formData.national = values.national;
        formData.place_of_birth = values.place_of_birth;
        formData.village = values.village;
        formData.card_created_at = values.card_created_at;
        formData.province = values.province;
        // formData.district = values.district;
        formData.commune = values.commune;

        onSubmit(formData);
  };

  const validationSchema = Yup.object({
    card_id: Yup.string()
      .required('CCCD là bắt buộc'),
    card_created_at: Yup.string()
      .required('Ngày làm thẻ là bắt buộc'),
    full_name: Yup.string()
      .required('Họ và tên là bắt buộc'),
    day_of_birth: Yup.string()
      .required('Ngày sinh là bắt buộc'),
    gender: Yup.string()
      .required('Giới tính là bắt buộc'),
    national: Yup.string()
      .required('Quốc tịch là bắt buộc'),
    village: Yup.string()
      .required('Địa chỉ là bắt buộc'),
    province: Yup.string()
      .required('Tỉnh/Thành phố là bắt buộc'),
    // district: Yup.string()
    //   .required('Huyện là bắt buộc'),
    commune: Yup.string()
      .required('Xã/Phường là bắt buộc'),
  });

  if (isLoading) return <LoadingOverlay shown={isLoading} />;

  return (
      <div className="mx-auto">
        <Formik<CustomerRequest>
          initialValues={{
            card_id: formData.card_id || "",
            full_name: formData.full_name || "",
            day_of_birth: formData.day_of_birth || "",
            gender: formData.gender || "",
            national: formData.national || "",
            place_of_birth: formData.place_of_birth || "",
            village: formData.village || "",
            card_created_at: formData.card_created_at || "",
            province: formData.province || "",
            district: formData.district || "",
            commune: formData.commune || "",
            address: formData.address || ""
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Họ và tên <span className="text-error-500">*</span></Label>
                  <Field
                    type="full_name"
                    name="full_name"
                    placeholder="Nhập họ và tên"
                    as={Input}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="full_name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label>Ngày sinh <span className="text-error-500">*</span></Label>

                  <DatePicker
                    id="day_of_birth"
                    placeholder="Nhập ngày sinh"
                    defaultDate={values.day_of_birth}
                    onChange={([selected]) => 
                      {
                        setFieldValue('day_of_birth',  selected
                            ? selected.toLocaleDateString("en-CA") :"");
                      }
                    }
                  />

                  <ErrorMessage
                    name="day_of_birth"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label>Giới tính<span className="text-error-500">*</span></Label>
                  <Select
                    options={genderOptions}
                    placeholder="Chọn giới tính"
                    onChange={(value) => setFieldValue('gender', value)}
                    defaultValue={values.gender}
                  />
                  {touched.gender && errors.gender && (
                    <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Số CCCD <span className="text-error-500">*</span></Label>
                  <Field
                    type="card_id"
                    name="card_id"
                    placeholder="Nhập Số CCCD"
                    as={Input}
                    disabled={submitLabel === "Cập nhật"}
                  />
                  <ErrorMessage
                    name="card_id"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label>Ngày làm thẻ <span className="text-error-500">*</span></Label>
                  <DatePicker
                    key={values.card_created_at}
                    id="card_created_at"
                    placeholder="Nhập ngày làm thẻ"
                    defaultDate={values.card_created_at}
                    onChange={([selected]) =>
                      {
                        setFieldValue('card_created_at', selected
                            ? selected.toLocaleDateString("en-CA") :"");
                      }
                    }
                  />
                  <ErrorMessage
                    name="card_created_at"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Quốc tịch<span className="text-error-500">*</span></Label>
                  <Select
                    options={nationalOptions}
                    placeholder="Chọn quốc tịch"
                    onChange={(value) => setFieldValue('national', value)}
                    defaultValue={values.national}
                  />
                  {touched.national && errors.national && (
                    <div className="text-red-500 text-sm mt-1">{errors.national}</div>
                  )}
                </div>

                <div>
                  <Label>Nơi sinh <span className="text-error-500"></span></Label>
                  <Field
                    type="place_of_birth"
                    name="place_of_birth"
                    placeholder="Nhập nơi sinh"
                    as={Input}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="place_of_birth"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {submitLabel === "Cập nhật" && values.address && (
                <div className="grid grid-cols-1 gap-6">
                  <Label>
                    Địa chỉ cũ quét được từ căn cước công dân: {values.address}
                  </Label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Địa chỉ <span className="text-error-500">*</span></Label>
                  <Field
                    type="village"
                    name="village"
                    placeholder="Nhập địa chỉ"
                    as={Input}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="village"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label>Tỉnh/Thành Phố <span className="text-error-500">*</span></Label>
                  <Select
                    options={provinceOptions}
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={ (value) =>
                    {
                      setFieldValue('province', value)
                      const selected = provinceOptions.find(p => p.value === value);
                      setSelectedProvinceCode(Number(selected?.code) || null);
                      setCommuneOptions([])
                      // setFieldValue('district', '');
                      setFieldValue('commune', '');
                    }}
                    defaultValue={values.province}
                  />
                  <ErrorMessage
                    name="province"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label>Xã/Phường <span className="text-error-500">*</span></Label>
                  <Select
                    options={communeOptions}
                    onChange={(value) => setFieldValue('commune', value)}
                    defaultValue={values.commune}
                  />
                  <ErrorMessage
                    name="commune"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* <div>
                <Label>Quận/Huyện <span className="text-error-500">*</span></Label>
                <Select
                  options={districtOptions}
                  onChange={(value) => {
                    setFieldValue('district', value);
                    const selected = districtOptions.find(p => p.value === value);
                    setSelectedDistrictCode(Number(selected?.code) || null);
                    setFieldValue('commune', '');
                  }}
                  defaultValue={values.district}
                />
                <ErrorMessage
                  name="district"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Label>Xã/Phường <span className="text-error-500">*</span></Label>
                <Select
                  options={communeOptions}
                  onChange={(value) => setFieldValue('commune', value)}
                  defaultValue={values.commune}
                />
                <ErrorMessage
                  name="commune"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div> */}

              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-gray-400 text-white hover:bg-gray-500"
                  onClick={() => router.back()}
                >
                  Quay về
                </button>

                <Button
                  className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang thêm...' : `${submitLabel}`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
  );
};

export default CustomerForm;
