import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Store } from '../types/permissions';

const FloorManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('dept-1');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Mock 百貨資料
  const departments = [
    { id: 'dept-1', name: '班班百貨台北店', storeCount: 12 },
    { id: 'dept-2', name: '班班百貨台中店', storeCount: 8 },
    { id: 'dept-3', name: '班班百貨高雄店', storeCount: 10 }
  ];

  // Mock 專櫃資料
  const stores: Store[] = [
    {
      id: 'store-1',
      name: '化妝品專櫃A',
      code: 'COS-001',
      areaId: 'area-1',
      areaName: '台北地區',
      managerId: 'manager-1',
      managerName: '張小華',
      companyId: 'company-1',
      companyName: '拉拉百貨股份有限公司',
      address: '台北市信義區忠孝東路四段123號',
      phone: '02-12345678',
      email: 'cos001@banban.com',
      status: 'active',
      employeeCount: 8,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'store-2',
      name: '服飾專櫃B',
      code: 'CLO-002',
      areaId: 'area-1',
      areaName: '台北地區',
      managerId: 'manager-2',
      managerName: '李小明',
      companyId: 'company-2',
      companyName: '班班百貨股份有限公司',
      address: '台北市信義區忠孝東路四段456號',
      phone: '02-23456789',
      email: 'clo002@banban.com',
      status: 'active',
      employeeCount: 6,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'store-3',
      name: '珠寶專櫃C',
      code: 'JEW-003',
      areaId: 'area-1',
      areaName: '台北地區',
      managerId: 'manager-3',
      managerName: '王小美',
      companyId: 'company-1',
      companyName: '拉拉百貨股份有限公司',
      address: '台北市信義區忠孝東路四段789號',
      phone: '02-34567890',
      email: 'jew003@banban.com',
      status: 'active',
      employeeCount: 4,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  // Mock 排班資料
  const scheduleData = [
    {
      storeId: 'store-1',
      storeName: '化妝品專櫃A',
      staff: [
        { name: '張小華', position: '櫃長', schedule: '早班 09:00-18:00' },
        { name: '林小芳', position: '專員', schedule: '早班 09:00-18:00' },
        { name: '陳小美', position: '專員', schedule: '晚班 14:00-23:00' },
        { name: '劉小強', position: '專員', schedule: '晚班 14:00-23:00' }
      ]
    },
    {
      storeId: 'store-2',
      storeName: '服飾專櫃B',
      staff: [
        { name: '李小明', position: '櫃長', schedule: '早班 09:00-18:00' },
        { name: '黃小華', position: '專員', schedule: '早班 09:00-18:00' },
        { name: '周小美', position: '專員', schedule: '晚班 14:00-23:00' }
      ]
    },
    {
      storeId: 'store-3',
      storeName: '珠寶專櫃C',
      staff: [
        { name: '王小美', position: '櫃長', schedule: '早班 09:00-18:00' },
        { name: '吳小明', position: '專員', schedule: '早班 09:00-18:00' },
        { name: '鄭小芳', position: '專員', schedule: '晚班 14:00-23:00' }
      ]
    }
  ];

  const currentDepartment = departments.find(dept => dept.id === selectedDepartment);
  const currentSchedule = selectedStore 
    ? scheduleData.filter(item => item.storeId === selectedStore)
    : scheduleData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">百貨樓管管理</h1>
          <p className="text-gray-600 mt-2">查看所屬百貨旗下所有專櫃的人員排班情況</p>
        </div>

        {/* 百貨選擇 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">選擇百貨</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept.id);
                  setSelectedStore(null);
                }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedDepartment === dept.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{dept.name}</div>
                <div className="text-sm text-gray-600 mt-1">{dept.storeCount} 個專櫃</div>
              </button>
            ))}
          </div>
        </div>

        {/* 專櫃列表 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDepartment?.name} - 專櫃列表
            </h2>
            <div className="text-sm text-gray-600">
              共 {stores.length} 個專櫃
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedStore === store.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{store.name}</div>
                <div className="text-sm text-gray-600 mt-1">{store.code}</div>
                <div className="text-sm text-gray-600">櫃長: {store.managerName}</div>
                <div className="text-sm text-gray-600">員工: {store.employeeCount} 人</div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    store.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.status === 'active' ? '營運中' : '停用'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 排班情況 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedStore 
                ? `${stores.find(s => s.id === selectedStore)?.name} - 排班情況`
                : `${currentDepartment?.name} - 所有專櫃排班情況`
              }
            </h2>
            <div className="text-sm text-gray-600">
              {currentSchedule.reduce((total, item) => total + item.staff.length, 0)} 位員工
            </div>
          </div>

          <div className="space-y-6">
            {currentSchedule.map((storeSchedule) => (
              <div key={storeSchedule.storeId} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">{storeSchedule.storeName}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          員工姓名
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          職位
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          排班時間
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {storeSchedule.staff.map((staff, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {staff.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {staff.position}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {staff.schedule}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 操作說明 */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">操作說明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 點擊百貨卡片切換不同百貨</li>
            <li>• 點擊專櫃卡片查看單個專櫃排班</li>
            <li>• 百貨樓管僅能查看排班資訊，無法修改</li>
            <li>• 如需修改排班，請聯繫專櫃櫃長</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FloorManagerPage;
