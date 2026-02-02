import React, { useState } from 'react';
import StoreDetail from './StoreDetail';

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
  console.log(' CompanyDetail 組件載入 - VERSION 3.0 -', new Date().toISOString());
  
  const [showStoreDetail, setShowStoreDetail] = useState(false);
  const [companyStores] = useState([
    {
      id: 'store-1',
      name: '南港專櫃',
      code: 'NG-001',
      companyId: company.id,
      companyName: company.name,
      areaId: 'area-1',
      areaName: '南港區',
      managerId: 'user-1',
      managerName: '王小明',
      phone: '02-1234-5678',
      email: 'nangang@lala.com',
      address: '台北市南港區重陽路456號',
      status: 'active' as const,
      employeeCount: 18,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'store-2',
      name: '南港拉拉',
      code: 'NANGANG_LALA',
      companyId: company.id,
      companyName: company.name,
      areaId: 'area-1',
      areaName: '北部地區',
      managerId: 'manager-2',
      managerName: '李櫃長',
      phone: '02-87654321',
      email: 'nangang@lala.com',
      address: '台北市南港區重陽路456號',
      status: 'active' as const,
      employeeCount: 18,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ]);

  const handleViewStores = () => {
    console.log('🔥🔥🔥 handleViewStores 開始 (VERSION 3.0) 🔥🔥🔥');
    console.log('當前 showStoreDetail 狀態:', showStoreDetail);
    console.log('companyStores 數量:', companyStores.length);
    console.log('當前時間:', new Date().toISOString());
    setShowStoreDetail(true);
    console.log('設置 showStoreDetail 為 true');
    console.log('🔥🔥🔥 handleViewStores 結束 (VERSION 3.0) 🔥🔥🔥');
  };

  const handleBackToCompany = () => {
    setShowStoreDetail(false);
  };

  const handleEditStore = (store: any) => {
    console.log('🔥🔥🔥 handleEditStore 被調用 (VERSION 3.0) 🔥🔥🔥');
    console.log('編輯專櫃:', store);
    console.log('準備進入 StoreDetail 組件進行編輯');
    
    // 設置要編輯的專櫃並進入專櫃詳情頁面
    setShowStoreDetail(true);
    console.log('設置 showStoreDetail 為 true，進入專櫃管理頁面');
  };

  if (showStoreDetail) {
    return (
      <StoreDetail
        stores={companyStores}
        companyName={company.name}
        onBack={handleBackToCompany}
      />
    );
  }
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">所屬專櫃</h3>
          <button
            onClick={(e) => {
              console.log('🔥🔥🔥 管理專櫃按鈕被點擊 (VERSION 3.0) 🔥🔥🔥');
              e.preventDefault();
              e.stopPropagation();
              console.log('管理專櫃按鈕被點擊');
              handleViewStores();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            🏪 管理專櫃
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companyStores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{store.name}</h4>
                    <p className="text-sm text-gray-500">櫃點代碼: {store.code}</p>
                    <p className="text-sm text-gray-500">地區: {store.areaName}</p>
                    <p className="text-sm text-gray-500">櫃長: {store.managerName}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {store.status === 'active' ? '營運中' : '停用'}
                  </span>
                </div>
                <div className="mt-2 flex space-x-2">
                  <button 
                    onClick={(e) => {
                      console.log('🔥🔥🔥 公司詳情中的編輯按鈕被點擊 (VERSION 3.0) 🔥🔥🔥');
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('公司詳情中的編輯按鈕被點擊:', store);
                      handleEditStore(store);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    編輯
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('公司詳情中的查看詳情按鈕被點擊:', store);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    查看詳情
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('查看全部專櫃按鈕被點擊');
                handleViewStores();
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium bg-white px-4 py-2 rounded-lg border border-blue-300 hover:border-blue-500 transition-colors"
            >
              查看全部 {companyStores.length} 個專櫃 →
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
