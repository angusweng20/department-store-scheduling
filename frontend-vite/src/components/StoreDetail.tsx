import React from 'react';

interface Store {
  id: string;
  name: string;
  code: string;
  companyId: string;
  companyName: string;
  areaId: string;
  areaName: string;
  managerId: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface StoreDetailProps {
  stores: Store[];
  companyName: string;
  onBack: () => void;
  onEditStore: (store: Store) => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ stores, companyName, onBack, onEditStore }) => {
  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
          >
            ← 返回公司詳情
          </button>
          <h3 className="text-lg font-medium text-gray-900">{companyName} - 專櫃管理</h3>
          <p className="text-sm text-gray-500">管理該公司下的所有專櫃</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
          ➕ 新增專櫃
        </button>
      </div>

      {/* 專櫃統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stores.length}</div>
          <div className="text-sm text-blue-800">總專櫃數</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {stores.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-green-800">營運中</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {stores.reduce((sum, s) => sum + s.employeeCount, 0)}
          </div>
          <div className="text-sm text-orange-800">總員工數</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((stores.filter(s => s.status === 'active').length / stores.length) * 100)}%
          </div>
          <div className="text-sm text-purple-800">營運率</div>
        </div>
      </div>

      {/* 專櫃列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">專櫃列表</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  專櫃名稱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  專櫃代碼
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地區
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  櫃長
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  員工數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                    <div className="text-sm text-gray-500">{store.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.areaName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.managerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.employeeCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      store.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {store.status === 'active' ? '營運中' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEditStore(store)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      編輯
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 專櫃分佈 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">地區分佈</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(new Set(stores.map(s => s.areaName))).map(areaName => {
            const areaStores = stores.filter(s => s.areaName === areaName);
            return (
              <div key={areaName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">{areaName}</h5>
                    <p className="text-sm text-gray-500">{areaStores.length} 個專櫃</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{areaStores.length}</div>
                    <div className="text-xs text-blue-800">專櫃數</div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {areaStores.map(store => (
                    <div key={store.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{store.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        store.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.status === 'active' ? '營運中' : '停用'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
