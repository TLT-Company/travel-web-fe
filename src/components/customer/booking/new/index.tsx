'use client';
import { createBooking } from "@/services/booking.service";
import { getCurrentUser, logoutAdmin } from "@/services/login.service";
import { useFormik } from "formik";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ApiResponse } from "@/lib/http";

type params = {
  id: string;
};
const CustomerBookingNew = (props: params) => {
  const { id } = props;
  const [pictureAvatar, setPictureAvatar] = useState<File | null>(null);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referral_code");
  const router = useRouter();

  useEffect(() => {
    fetchAdminCurrent();
  }, []);

const fetchAdminCurrent = async () => {
    try {
      const data = await getCurrentUser();
      if (!data.success) {
        console.error("Failed to fetch current admin data");
        localStorage.removeItem("accessTokenTravel");
        localStorage.removeItem("userLoginTravel");
        redirect("/user/signin");
      }else{
        const user = data.data;
        if (!user || !user.id || user.role !== 'user') {
          localStorage.removeItem("accessTokenTravel");
          localStorage.removeItem("userLoginTravel");
          redirect("/user/signin");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
      localStorage.removeItem("accessTokenTravel");
      localStorage.removeItem("userLoginTravel");
      redirect("/user/signin");
    }
  }

  const formik = useFormik({
    initialValues: {
      note: "",
      referral_code: referralCode || "",
      cccd: "",
    },
    onSubmit: async (values) => {
      // validate: (values) => {
      const errors: { frontImage?: string, backImage?: string, cccd?: string, pictureAvatar?: string } = {};
      if(!values.cccd) {
        errors.cccd = "CCCD không được để trống";
      }
      if (!frontImage) {
        errors.frontImage = "Ảnh CCCD mặt trước không được để trống";
      }
      if (!backImage) {
        errors.backImage = "Ảnh CCCD mặt sau không được seksi trONGL";
      }
      if (!pictureAvatar) {
        errors.pictureAvatar = "Ảnh chân dung không được để trống";
      }
      if(Object.keys(errors).length > 0) {
        toast.error(errors.frontImage || errors.backImage || "");
        return;
      }
      // },
      const formData = new FormData();
      formData.append("cccd", values.cccd);
      formData.append("note", values.note);
      formData.append("tour_id", id);
      formData.append("referral_code", values.referral_code);
      formData.append("status", 'confirmed');
      if (pictureAvatar) formData.append("picture_avatar", pictureAvatar);
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
      const response = await logoutAdmin() as ApiResponse<unknown>;
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
        <label className="block mb-1 font-medium">CCCD</label>
        <input
          type="text"
          name="cccd"
          value={formik.values.cccd}
          onChange={formik.handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập cccd"
        />
      </div>
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
        <label className="block mb-1 font-medium">Ảnh chân dung</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.currentTarget.files?.[0]) {
              setPictureAvatar(e.currentTarget.files[0]);
            }
          }}
          className="w-full"
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
