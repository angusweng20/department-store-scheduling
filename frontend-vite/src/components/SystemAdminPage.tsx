import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../context/PermissionContext';
import ProtectedRoute from './ProtectedRoute';
import Modal from './Modal';
import CompanyForm from './CompanyForm';
import CompanyDetail from './CompanyDetail';
import type { User, Store } from '../types/permissions';

const SystemAdminPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'department' | 'company' | 'stores' | 'users' | 'system'>('overview');
  
  // 模態框狀態
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showCompanyDetail, setShowCompanyDetail] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // 專櫃管理狀態
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [storeModalMode, setStoreModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedStore, setSelectedStore] = useState<any>(null);

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
      id: '6',
      lineUserId: 'FLOOR_MANAGER_USER',
      name: '樓管王大明',
      email: 'wang@banban.com',
      phone: '0966666666',
      role: 'floor_manager' as any,
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

  // Mock 公司資料
  const mockCompanies = [
    {
      id: 'company-1',
      name: '班班百貨股份有限公司',
      code: 'BANBAN_DEPT',
      taxId: '12345678',
      manager: '總經理',
      phone: '02-12345678',
      email: 'contact@banban-dept.com',
      address: '台北市信義區信義路五段7號',
      status: 'active',
      storeCount: 12,
      employeeCount: 156,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'company-2',
      name: '拉拉百貨股份有限公司',
      code: 'LALA_DEPT',
      taxId: '87654321',
      manager: '地區經理',
      phone: '02-87654321',
      email: 'contact@lala-dept.com',
      address: '台北市大安區敦化南路二段76號',
      status: 'active',
      storeCount: 8,
      employeeCount: 98,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  const getRoleLabel = (role: string) => {
    const roleMap = {
      'system_admin': '系統管理員',
      'tester': '測試人員',
      'hq_admin': '公司管理',
      'area_manager': '地區經理',
      'floor_manager': '百貨樓管',
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
      'floor_manager': 'bg-teal-100 text-teal-800',
      'store_manager': 'bg-blue-100 text-blue-800',
      'staff': 'bg-green-100 text-green-800'
    };
    return colorMap[role as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  // 處理公司操作
  const handleAddCompany = () => {
    setModalMode('add');
    setSelectedCompany(null);
    setShowCompanyModal(true);
  };

  const handleEditCompany = (company: any) => {
    setModalMode('edit');
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  const handleViewCompany = (company: any) => {
    setSelectedCompany(company);
    setShowCompanyDetail(true);
  };

  const handleSaveCompany = (company: any) => {
    console.log('保存公司:', company);
    // 這裡應該調用 API 保存公司資料
    alert(`${modalMode === 'add' ? '新增' : '更新'}公司成功！`);
    setShowCompanyModal(false);
    setSelectedCompany(null);
  };

  const handleCloseModal = () => {
    console.log('🚨🚨🚨 SystemAdminPage handleCloseModal 被調用！🚨🚨🚨');
    console.log('🚨🚨🚨 當前 showCompanyModal:', showCompanyModal);
    console.log('🚨🚨🚨 當前 showCompanyDetail:', showCompanyDetail);
    console.log('🚨🚨🚨 當前 selectedCompany:', selectedCompany);
    
    setShowCompanyModal(false);
    setShowCompanyDetail(false);
    setSelectedCompany(null);
    
    console.log('🚨🚨🚨 handleCloseModal 執行完成！🚨🚨🚨');
  };

  // 專櫃管理函數
  const handleAddStore = () => {
    setStoreModalMode('add');
    setSelectedStore(null);
    setShowStoreModal(true);
    console.log('🏪 新增專櫃');
  };

  const handleEditStore = (store: Store) => {
    navigate(`/system-admin/stores/${store.id}`);
    console.log('🏪 編輯專櫃:', store);
  };

  const handleViewStore = (store: Store) => {
    navigate(`/system-admin/stores/${store.id}`);
    console.log('🏪 查看專櫃:', store);
  };

  const handleDeleteStore = (store: Store) => {
    if (window.confirm(`確定要刪除專櫃「${store.name}」嗎？`)) {
      console.log('🏪 刪除專櫃:', store);
      // 這裡應該調用 API 刪除專櫃
      alert(`專櫃「${store.name}」已刪除`);
    }
  };

  const handleCloseStoreModal = () => {
    setShowStoreModal(false);
    setSelectedStore(null);
    setStoreModalMode('add');
  };

  const tabs = [
    { id: 'overview', label: '系統概覽', icon: '📊' },
    { id: 'department', label: '百貨管理', icon: '🏬' },
    { id: 'company', label: '公司管理', icon: '🏢' },
    { id: 'stores', label: '專櫃管理', icon: '🏪' },
    { id: 'users', label: '用戶管理', icon: '👥' },
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

          {/* 百貨管理 */}
          {activeTab === 'department' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">百貨管理</h2>
                
                {/* 百貨統計 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-blue-800">總百貨數</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">20</div>
                    <div className="text-sm text-green-800">總樓層數</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-purple-800">總專櫃數</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">98%</div>
                    <div className="text-sm text-orange-800">營運率</div>
                  </div>
                </div>

                {/* 百貨列表 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">百貨列表</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      ➕ 新增百貨
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">班班百貨</h4>
                          <p className="text-sm text-gray-500">地址: 台北市信義區信義路五段7號</p>
                          <p className="text-sm text-gray-500">營業時間: 11:00-22:00</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">12樓層</span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">85專櫃</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">營運中</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-900">編輯</button>
                          <button className="text-sm text-gray-600 hover:text-gray-900">查看樓層</button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">拉拉百貨</h4>
                          <p className="text-sm text-gray-500">地址: 台北市大安區敦化南路二段76號</p>
                          <p className="text-sm text-gray-500">營業時間: 11:00-22:00</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">8樓層</span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">71專櫃</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">營運中</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-900">編輯</button>
                          <button className="text-sm text-gray-600 hover:text-gray-900">查看樓層</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 百貨設定 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-4">百貨設定</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">營運設定</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">啟用節假日營業</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">啟用線上預約系統</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-600">啟用會員積點系統</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">服務設定</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">提供停車服務</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">提供免費WiFi</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">提供顧客服務中心</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 公司管理 */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">公司管理</h2>
                
                {/* 公司統計 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-blue-800">總公司數</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-green-800">總櫃點數</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-purple-800">總員工數</div>
                  </div>
                </div>

                {/* 公司列表 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">公司列表</h3>
                    <button 
                      onClick={handleAddCompany}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      ➕ 新增公司
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockCompanies.map((company) => (
                      <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{company.name}</h4>
                            <p className="text-sm text-gray-500">統一編號: {company.taxId}</p>
                            <p className="text-sm text-gray-500">負責人: {company.manager}</p>
                            <p className="text-sm text-gray-500">電話: {company.phone}</p>
                            <p className="text-sm text-gray-500">地址: {company.address}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{company.storeCount} 櫃點</span>
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{company.employeeCount} 員工</span>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                {company.status === 'active' ? '營運中' : '停用'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditCompany(company)}
                              className="text-sm text-blue-600 hover:text-blue-900"
                            >
                              編輯
                            </button>
                            <button 
                              onClick={() => handleViewCompany(company)}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              查看櫃點
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 公司設定 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-4">公司設定</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">全域設定</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">啟用跨店支援功能</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">啟用自動排班建議</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">啟用工時統計功能</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">權限設定</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">地區經理可跨區管理</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">櫃長可管理員工請假</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm text-gray-600">員工可自行調換班次</span>
                        </label>
                      </div>
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

          {/* 專櫃管理 */}
          {activeTab === 'stores' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">專櫃管理</h2>
                    <p className="text-gray-600">管理所有公司的專櫃資訊，包括新增、編輯、刪除專櫃等功能。</p>
                  </div>
                  <button 
                    onClick={handleAddStore}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    ➕ 新增專櫃
                  </button>
                </div>
                
                {/* 專櫃統計 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-blue-800">總專櫃數</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">10</div>
                    <div className="text-sm text-green-800">營運中</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">85</div>
                    <div className="text-sm text-orange-800">總員工數</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">83%</div>
                    <div className="text-sm text-purple-800">營運率</div>
                  </div>
                </div>

                {/* 專櫃列表 */}
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
                          所屬公司
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
                      {mockStores.map((store) => (
                        <tr key={store.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {store.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {store.companyName}
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
                              onClick={() => handleEditStore(store)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              編輯
                            </button>
                            <button 
                              onClick={() => handleViewStore(store)}
                              className="text-gray-600 hover:text-gray-900 mr-3"
                            >
                              查看
                            </button>
                            <button 
                              onClick={() => handleDeleteStore(store)}
                              className="text-red-600 hover:text-red-900"
                            >
                              刪除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      {/* 公司表單模態框 */}
      <Modal
        isOpen={showCompanyModal}
        onClose={handleCloseModal}
        title={modalMode === 'add' ? '新增公司' : '編輯公司'}
        size="lg"
      >
        <CompanyForm
          company={selectedCompany}
          onSave={handleSaveCompany}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* 公司詳情模態框 */}
      <Modal
        isOpen={showCompanyDetail}
        onClose={handleCloseModal}
        title="公司詳情"
        size="full"
      >
        {selectedCompany && (
          <CompanyDetail
            key={`company-${selectedCompany.id}`}
            company={selectedCompany}
            onEdit={() => {
              setShowCompanyDetail(false);
              handleEditCompany(selectedCompany);
            }}
            onClose={handleCloseModal}
          />
        )}
      </Modal>

      {/* 專櫃模態框 */}
      <Modal
        isOpen={showStoreModal}
        onClose={handleCloseStoreModal}
        title={storeModalMode === 'add' ? '新增專櫃' : storeModalMode === 'edit' ? '編輯專櫃' : '查看專櫃'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">專櫃名稱</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.name || ''}
                disabled={storeModalMode === 'view'}
                placeholder="請輸入專櫃名稱"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">專櫃代碼</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.code || ''}
                disabled={storeModalMode === 'view'}
                placeholder="請輸入專櫃代碼"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所屬公司</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.companyId || ''}
                disabled={storeModalMode === 'view'}
              >
                <option value="">請選擇公司</option>
                <option value="company-1">拉拉百貨股份有限公司</option>
                <option value="company-2">班班百貨股份有限公司</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地區</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.areaId || ''}
                disabled={storeModalMode === 'view'}
              >
                <option value="">請選擇地區</option>
                <option value="area-1">台北地區</option>
                <option value="area-2">台中地區</option>
                <option value="area-3">高雄地區</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">櫃長姓名</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.managerName || ''}
                disabled={storeModalMode === 'view'}
                placeholder="請輸入櫃長姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">員工數量</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.employeeCount || ''}
                disabled={storeModalMode === 'view'}
                placeholder="請輸入員工數量"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={selectedStore?.address || ''}
              disabled={storeModalMode === 'view'}
              placeholder="請輸入專櫃地址"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.phone || ''}
                disabled={storeModalMode === 'view'}
                placeholder="請輸入專櫃電話"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selectedStore?.status || 'active'}
                disabled={storeModalMode === 'view'}
              >
                <option value="active">營運中</option>
                <option value="inactive">停用</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleCloseStoreModal}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              {storeModalMode === 'view' ? '關閉' : '取消'}
            </button>
            {storeModalMode !== 'view' && (
              <button
                onClick={() => {
                  console.log(`${storeModalMode === 'add' ? '新增' : '更新'}專櫃`);
                  alert(`${storeModalMode === 'add' ? '新增' : '更新'}專櫃成功！`);
                  handleCloseStoreModal();
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {storeModalMode === 'add' ? '新增' : '更新'}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
};

export default SystemAdminPage;
