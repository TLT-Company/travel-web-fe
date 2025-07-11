import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import DocumentCustomerPage from '@/components/listThongHanh/DocumentCustomer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table page for TailAdmin Tailwind CSS Admin Dashboard Template",
};
const ThongHanh = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tour" />
      <div className="space-y-6">
        <ComponentCard title="Danh sách tour">
          <DocumentCustomerPage />
        </ComponentCard>
      </div>
    </div>
  );
}
export default ThongHanh;