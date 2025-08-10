'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Form from "@/components/form/Form";
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from "@/components/form/input/InputField";
import { scanIDCard } from '@/services/documentCustomer.service';
import { toast } from 'react-toastify';

interface ScanIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  document_id: string
}

const SanIDModal: React.FC<ScanIDModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  document_id,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);

    const handleClose = () => {
        if (!isLoading) {
        onClose();
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        const selectedFiles = Array.from(e.target.files).slice(0, 50);
        setImages(selectedFiles);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
          if (images.length > 0) {
              const uploaded = await scanIDCard(document_id, images);
              const [num1, num2] = uploaded.message.split("/").map(Number);
              onSuccess();
              onClose();
              if (num1 == 0) {
                toast.error("không có ảnh nào được xử lý thành công");
                await new Promise(resolve => setTimeout(resolve, 3000));
                await handleDownload(uploaded)
              } else if ( num1 < num2) {
                toast.error("Đã xử lý thành công " + num1 + " trong tổng số " + num2 + " ảnh");
                await new Promise(resolve => setTimeout(resolve, 3000));
                await handleDownload(uploaded)
              } else {
                toast.success("Đã xử lý thành công " + num1 + " ảnh");
              }
          }
      } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi quét CCCD';
          toast.error(errorMessage);
          console.log(error)
          onClose();
      } finally {
          setIsLoading(false);
      }
    }

    const handleDownload = async (apiData : any) => {
        let csvContent = "\uFEFFTên file,Kết quả\n";
        console.log(apiData)

        apiData.data.forEach((item: { [key: string]: string }) => {
            const fileName = fixEncoding(Object.keys(item)[0]);
            const result = Object.values(item)[0];
            csvContent += `"${fileName}","${result}"\n`;
        });
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const now = new Date();
        const timestamp = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
        link.setAttribute("download", "ket_qua_xu_ly_quet_cccd_" + timestamp + ".csv");
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const fixEncoding = (str: string) => {
        const bytes = new Uint8Array([...str].map(ch => ch.charCodeAt(0)));
        return new TextDecoder("utf-8").decode(bytes);
    }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
          Quét căn cước công dân
        </h2>
        
        <Form
            className="space-y-5 col-span-2 col-start-2"
            onSubmit={handleSubmit}
        >

            <div>
                <Label htmlFor="images">
                  Ảnh căn cước (tối đa 50 ảnh)
                  <span className="relative group ml-2 cursor-pointer align-middle">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-sm font-bold shadow-md">
                      ?
                    </span>
                    <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-60 p-2 text-sm text-white bg-gray-900 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      Vui lòng chọn những ảnh rõ nét và thấy rõ vùng QRCode
                    </span>
                  </span>
                </Label>
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

             <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang quét...' : 'Quét căn cước'}
                </button>
              </div>
        </Form>
      </div>
    </Modal>
  );
};

export default SanIDModal; 