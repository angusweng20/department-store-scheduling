import React, { useState } from 'react';
import { usePermission } from '../context/PermissionContext';
import ProtectedRoute from './ProtectedRoute';
import type { User, Store, Area } from '../types/permissions';

const SystemAdminPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stores' | 'system'>('overview');

  // Mock 系統統計資料
  const systemStats = {
    totalUsers: 156,
    activeUsers: 142,
    totalStores: 12,
    activeStores: 11,
    totalAreas: 3,
    totalShifts: 2847,
    totalWorkHours: 15420.5,
    systemUptime: '99.8%',
    lastBackup: '2026-02-02 06:00:00'
  };

  // Mock 用戶資料
  const mockUsers: User[] = [
    {
      id: '0',
      lineUserId: 'SYSTEM_ADMIN',
      name: '班班營運團隊',
      email: 'admin@banban.com',
      phone: '0911111111',
      role: 'system_admin' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: '5',
      lineUserId: 'TESTER_USER',
      name: '測試人員',
      email: 'tester@banban.com',
      phone: '0955555555',
      role: 'tester' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: '1',
      lineUserId: 'U1234567890',
      name: '總經理',
      email: 'hq@department-store.com',
      phone: '0912345678',
      role: 'hq_admin' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  // Mock 櫃點資料
  const mockStores: Store[] = [
    {
      id: 'store-1',
      name: '台中拉拉',
      code: 'TAICHUNG_LALA',
      areaId: 'area-1',
      managerId: '3',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'store-2',
      name: '南港拉拉',
      code: 'NANGANG_LALA',
      areaId: 'area-1',
      managerId: '5',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  // Mock 地區資料
  const mockAreas: Area[] = [
    {
      id: 'area-1',
      name: '中部地區',
      managerId: '2',
      stores: mockStores,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  const getRoleLabel = (role: string) => {
    const roleMap = {
      'system_admin': '班班營運團隊',
      'tester': '測試人員',
      'hq_admin': '公司管理',
      'area_manager': '地區經理',
      'store_manager': '專櫃櫃長',
      'staff': '專櫃人員'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap = {
      'system_admin': 'bg-purple-100 text-purple-800',
      'tester': 'bg-pink-100 text-pink-800',
      'hq_admin': 'bg-red-100 text-red-800',
      'area_manager': 'bg-orange-100 text-orange-800',
      'store_manager': 'bg-blue-100 text-blue-800',
      'staff': 'bg-green-100 text-green-800'
    };
    return colorMap[role as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'overview', label: '系統概覽', icon: '📊' },
    { id: 'users', label: '用戶管理', icon: '👥' },
    { id: 'stores', label: '櫃點管理', icon: '🏪' },
    { id: 'system', label: '系統設定', icon: '⚙️' }
  ];

  return (
    <ProtectedRoute requiredPermission="system_overview">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">系統管理</h1>
            <p className="text-gray-600">班班系統營運團隊 - 全覽所有狀態</p>
          </div>

          {/* 標籤導航 */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 系統概覽 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 系統統計卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">總用戶數</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers}</p>
                      <p className="text-xs text-green-600">活躍: {systemStats.activeUsers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">總櫃點數</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalStores}</p>
                      <p className="text-xs text-green-600">營運中: {systemStats.activeStores}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">總班次數</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalShifts}</p>
                      <p className="text-xs text-gray-500">本月統計</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">總工時</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalWorkHours.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">小時</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 系統狀態 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">系統狀態</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">系統指標</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">系統運行時間</span>
                        <span className="text-sm font-medium text-green-600">{systemStats.systemUptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">最後備份</span>
                        <span className="text-sm font-medium text-gray-900">{systemStats.lastBackup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">資料庫狀態</span>
                        <span className="text-sm font-medium text-green-600">正常</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">快速操作</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        🔄 執行系統備份
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        📊 生成系統報告
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        🔧 系統維護模式
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 用戶管理 */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">用戶管理</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用戶
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        角色
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        建立時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? '啟用' : '停用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">編輯</button>
                          <button className="text-red-600 hover:text-red-900">停用</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 櫃點管理 */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">櫃點管理</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockStores.map((store) => (
                    <div key={store.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                          <p className="text-sm text-gray-500">{store.code}</p>
                          <p className="text-sm text-gray-500 mt-1">地區: {mockAreas.find(a => a.id === store.areaId)?.name}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          store.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {store.isActive ? '營運中' : '停用'}
                        </span>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="text-sm text-indigo-600 hover:text-indigo-900">編輯</button>
                        <button className="text-sm text-gray-600 hover:text-gray-900">查看詳情</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 系統設定 */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">系統設定</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">備份設定</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm text-gray-600">自動每日備份</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm text-gray-600">備份加密</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">安全設定</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm text-gray-600">雙重驗證</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm text-gray-600">操作日誌記錄</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SystemAdminPage;
