'use client';
import { createBooking } from "@/services/booking.service";
import { logoutAdmin } from "@/services/login.service";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type params = {
  id: string;
};
const CustomerBookingNew = (props: params) => {
  const { id } = props;
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referral_code");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      note: "",
      referral_code: referralCode || "",
    },
    onSubmit: async (values) => {
      // validate: (values) => {
      const errors: { frontImage?: string, backImage?: string } = {};
      if (!frontImage) {
        errors.frontImage = "Ảnh CCCD mặt trước không được để trống";
      }
      if (!backImage) {
        errors.backImage = "Ảnh CCCD mặt sau không được seksi trONGL";
      }
      if(Object.keys(errors).length > 0) {
        toast.error(errors.frontImage || errors.backImage || "");
        return;
      }
      // },
      const formData = new FormData();
      formData.append("note", values.note);
      formData.append("tour_id", id);
      formData.append("referral_code", values.referral_code);
      formData.append("status", 'confirmed');
      if (frontImage) formData.append("front_image", frontImage);
      if (backImage) formData.append("back_image", backImage);
      try {
        const res = await createBooking(formData);
        if(res.success) {
          toast.success(res?.message || "Đặt tour thành công!");
        }
      } catch (err) {
        console.error("Booking error", err);
      }
    },
  });
  const handleLogout = async () => {
    try {
      const response = await logoutAdmin();
      if(response.success) {
        localStorage.removeItem("accessTokenTravel");
        localStorage.removeItem("userLoginTravel");
        toast.success(response.message);
        setTimeout(() => {
          router.push("/user/signin");
        }, 1500);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Có thể hiển thị toast hoặc thông báo lỗi
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto space-y-6 p-4 border rounded-lg shadow"
    >
      <div>
        <label className="block mb-1 font-medium">Ghi chú</label>
        <input
          type="text"
          name="note"
          value={formik.values.note}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập ghi chú"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Ảnh CCCD mặt trước</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.currentTarget.files?.[0]) {
              setFrontImage(e.currentTarget.files[0]);
            }
          }}
          className="w-full"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Ảnh CCCD mặt sau</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.currentTarget.files?.[0]) {
              setBackImage(e.currentTarget.files[0]);
            }
          }}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Gửi thông tin
      </button>
      <button
        type="button"
        onClick={() => {handleLogout()}}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Đăng xuất
      </button>
    </form>
  );
};

export default CustomerBookingNew;
