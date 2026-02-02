import React from 'react';

interface Company {
  id: string;
  name: string;
  code: string;
  taxId: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  storeCount: number;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CompanyDetailProps {
  company: Company;
  onEdit: () => void;
  onClose: () => void;
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onEdit, onClose }) => {
  return (
    <div className="space-y-6">
      {/* 公司基本資訊 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">公司基本資訊</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">公司名稱</label>
            <p className="text-gray-900">{company.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">公司代碼</label>
            <p className="text-gray-900">{company.code}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">統一編號</label>
            <p className="text-gray-900">{company.taxId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">負責人</label>
            <p className="text-gray-900">{company.manager}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">電話</label>
            <p className="text-gray-900">{company.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <p className="text-gray-900">{company.email}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">地址</label>
            <p className="text-gray-900">{company.address}</p>
          </div>
        </div>
      </div>

      {/* 營運狀態 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">營運狀態</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{company.storeCount}</div>
            <div className="text-sm text-blue-800">總櫃點數</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{company.employeeCount}</div>
            <div className="text-sm text-green-800">總員工數</div>
          </div>
          <div className={`rounded-lg p-4 ${
            company.status === 'active' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className={`text-2xl font-bold ${
              company.status === 'active' ? 'text-green-600' : 'text-red-600'
            }`}>
              {company.status === 'active' ? '營運中' : '停用'}
            </div>
            <div className={`text-sm ${
              company.status === 'active' ? 'text-green-800' : 'text-red-800'
            }`}>
              公司狀態
            </div>
          </div>
        </div>
      </div>

      {/* 櫃點列表 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">所屬櫃點</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Mock 櫃點資料 */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">台中拉拉</h4>
                  <p className="text-sm text-gray-500">櫃點代碼: TAICHUNG_LALA</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">營運中</span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">南港拉拉</h4>
                  <p className="text-sm text-gray-500">櫃點代碼: NANGANG_LALA</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">營運中</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              查看全部 {company.storeCount} 個櫃點 →
            </button>
          </div>
        </div>
      </div>

      {/* 系統記錄 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">系統記錄</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">建立時間</label>
            <p className="text-gray-900">{new Date(company.createdAt).toLocaleString('zh-TW')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">最後更新</label>
            <p className="text-gray-900">{new Date(company.updatedAt).toLocaleString('zh-TW')}</p>
          </div>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          關閉
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          編輯公司
        </button>
      </div>
    </div>
  );
};

export default CompanyDetail;
