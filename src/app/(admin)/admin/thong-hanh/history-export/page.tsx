import ListThongHanh from '@/components/listThongHanh/history-export';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "TRAVEL TOUR",
  description: "",
};

const ThongHanh = () => {
  return (
    <>
      <ListThongHanh />
    </>
  );
}
export default ThongHanh;