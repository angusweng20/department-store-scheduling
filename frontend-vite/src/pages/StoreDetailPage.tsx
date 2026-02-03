import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Store } from '../types/permissions';

const StoreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [store, setStore] = useState<Store>({
    id: id || '',
    name: '南港專櫃',
    code: 'NG-001',
    areaId: 'area-1',
    areaName: '台北地區',
    managerId: 'manager-1',
    managerName: '張小華',
    companyId: 'company-1',
    companyName: '拉拉百貨股份有限公司',
    address: '台北市南港區重慶路四段123號',
    phone: '02-12345678',
    email: 'ng@banban.com',
    status: 'active',
    employeeCount: 15,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  });

  const handleSave = () => {
    console.log('保存專櫃:', store);
    alert('專櫃資料已更新！');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`確定要刪除專櫃「${store.name}」嗎？`)) {
      console.log('刪除專櫃:', store);
      alert('專櫃已刪除！');
      navigate('/system-admin/stores');
    }
  };

  const handleBack = () => {
    navigate('/system-admin/stores');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
          >
            ← 返回專櫃管理
          </button>
          <h1 className="text-3xl font-bold text-gray-900">專櫃詳情</h1>
          <p className="text-gray-600 mt-2">查看和編輯專櫃的詳細資訊</p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end space-x-3 mb-6">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                編輯專櫃
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                刪除專櫃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                保存變更
              </button>
            </>
          )}
        </div>

        {/* 專櫃資訊卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本資訊 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">專櫃名稱</label>
                  <input
                    type="text"
                    value={store.name}
                    onChange={(e) => setStore({...store, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">專櫃代碼</label>
                  <input
                    type="text"
                    value={store.code}
                    onChange={(e) => setStore({...store, code: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
                  <select
                    value={store.status}
                    onChange={(e) => setStore({...store, status: e.target.value as 'active' | 'inactive'})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="active">營運中</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 歸屬資訊 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">歸屬資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">所屬公司</label>
                  <select
                    value={store.companyId}
                    onChange={(e) => setStore({...store, companyId: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="company-1">拉拉百貨股份有限公司</option>
                    <option value="company-2">班班百貨股份有限公司</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地區</label>
                  <select
                    value={store.areaId}
                    onChange={(e) => setStore({...store, areaId: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  >
                    <option value="area-1">台北地區</option>
                    <option value="area-2">台中地區</option>
                    <option value="area-3">高雄地區</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">員工數量</label>
                  <input
                    type="number"
                    value={store.employeeCount}
                    onChange={(e) => setStore({...store, employeeCount: parseInt(e.target.value)})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* 人員資訊 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">人員資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">櫃長姓名</label>
                  <input
                    type="text"
                    value={store.managerName}
                    onChange={(e) => setStore({...store, managerName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">聯絡資訊</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <input
                    type="text"
                    value={store.address}
                    onChange={(e) => setStore({...store, address: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
                  <input
                    type="tel"
                    value={store.phone}
                    onChange={(e) => setStore({...store, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">郵箱</label>
                  <input
                    type="email"
                    value={store.email}
                    onChange={(e) => setStore({...store, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
