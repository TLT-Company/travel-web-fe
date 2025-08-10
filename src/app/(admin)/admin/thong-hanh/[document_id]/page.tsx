import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DocumentDetailPage from '@/components/listThongHanh/detail/DocumentDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

const ThongHanh = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Quản lý Thông Hành" />
      <div className="space-y-6">
        {/* <ComponentCard title="Danh sách khách hàng"> */}
          <DocumentDetailPage />
        {/* </ComponentCard> */}
      </div>
    </div>
  );
}
export default ThongHanh;