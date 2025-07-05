'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/button/Button';
import { documentExportService, ApiResponse } from '../../services/api';

interface DocumentExport {
  id: number;
  kind: string;
  file_path: string;
  file_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}



const ListThongHanh = () => {
  const [data, setData] = useState<DocumentExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await documentExportService.getAll();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getKindDisplayName = (kind: string) => {
    const kindMap: { [key: string]: string } = {
      'groupListCN': 'Danh sách nhóm CN',
      'groupListVN': 'Danh sách nhóm VN',
      'declarationList': 'Danh sách khai báo',
      // 'encryptedList': 'Danh sách mã hóa'
    };
    return kindMap[kind] || kind;
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: { text: string; className: string } } = {
      'success': { text: 'Thành công', className: 'bg-green-100 text-green-800' },
      'pending': { text: 'Đang xử lý', className: 'bg-yellow-100 text-yellow-800' },
      'failed': { text: 'Thất bại', className: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredData = data.filter((item) =>
    item.file_name.toLowerCase().includes(search.toLowerCase()) ||
    getKindDisplayName(item.kind).toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const response = await documentExportService.download(id);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Có lỗi xảy ra khi tải xuống file');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button 
            onClick={fetchData}
            className="mt-2"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách thông hành đã xuất</h1>
        <Button onClick={fetchData} className="bg-blue-500 hover:bg-blue-600">
          Làm mới
        </Button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên file hoặc loại tài liệu..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tên file</th>
              <th className="px-4 py-3">Loại tài liệu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Ngày cập nhật</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const statusInfo = getStatusDisplay(item.status);
                return (
                  <tr key={item.id} className="text-sm border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.id}</td>
                    <td className="px-4 py-3">{item.file_name}</td>
                    <td className="px-4 py-3">{getKindDisplayName(item.kind)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3">{formatDate(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <Button 
                        onClick={() => handleDownload(item.id, item.file_name)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                        disabled={item.status !== 'success'}
                      >
                        Tải xuống
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                  {search ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListThongHanh;
