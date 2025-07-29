import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DocumentCustomerPage from '@/components/listThongHanh/DocumentCustomer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

const ThongHanh = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Thông Hành" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách Thông hành">
          <DocumentCustomerPage />
        </ComponentCard>
      </div>
    </div>
  );
}
export default ThongHanh;