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
    lastBackup: '2026-01-15 02:30:00'
  };

  // Mock 用戶資料
  const mockUsers: User[] = [
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
    },
    {
      id: '2',
      lineUserId: 'AREA_MANAGER_USER',
      name: '地區經理張三',
      email: 'zhang@banban.com',
      phone: '0923456789',
      role: 'area_manager' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: '3',
      lineUserId: 'STORE_MANAGER_USER',
      name: '櫃長李四',
      email: 'li@banban.com',
      phone: '0934567890',
      role: 'store_manager' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: '4',
      lineUserId: 'STAFF_USER',
      name: '專員王五',
      email: 'wang@banban.com',
      phone: '0945678901',
      role: 'staff' as any,
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
    }
  ];

  // Mock 櫃點資料
  const mockStores: Store[] = [
    {
      id: 'store-1',
      name: '化妝品專櫃A',
      code: 'COS-001',
      areaId: 'area-1',
      areaName: '台北地區',
      managerId: 'manager-1',
      managerName: '張小華',
      companyId: 'company-1',
      companyName: '班班百貨股份有限公司',
      address: '台北市信義區忠孝東路四段123號1樓',
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
      companyName: '拉拉百貨股份有限公司',
      address: '台北市信義區忠孝東路四段123號2樓',
      phone: '02-12345679',
      email: 'clo002@banban.com',
      status: 'active',
      employeeCount: 6,
      isActive: true,
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

  // 專櫃管理函數
  const handleAddStore = () => {
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
      alert(`專櫃「${store.name}」已刪除`);
    }
  };

  // Mock 百貨資料
  const mockDepartments = [
    {
      id: 'dept-1',
      name: '班班百貨台北店',
      code: 'TP-001',
      address: '台北市信義區忠孝東路四段123號',
      phone: '02-12345678',
      manager: '陳經理',
      email: 'taipei@banban.com',
      floors: 12,
      stores: 85,
      status: 'active',
      operatingHours: '11:00-22:00',
      establishedDate: '2020-01-15',
      monthlyRevenue: '12,500,000',
      employeeCount: 320,
      parkingSpaces: 500,
      description: '旗艦店，位於信義區核心商圈'
    },
    {
      id: 'dept-2',
      name: '班班百貨台中店',
      code: 'TC-001',
      address: '台中市西區美村路一段456號',
      phone: '04-23456789',
      manager: '林經理',
      email: 'taichung@banban.com',
      floors: 8,
      stores: 62,
      status: 'active',
      operatingHours: '11:00-21:30',
      establishedDate: '2021-03-20',
      monthlyRevenue: '8,200,000',
      employeeCount: 245,
      parkingSpaces: 300,
      description: '中部地區主要據點'
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
    alert(`${modalMode === 'add' ? '新增' : '更新'}公司成功！`);
    setShowCompanyModal(false);
    setSelectedCompany(null);
  };

  const handleCloseModal = () => {
    setShowCompanyModal(false);
    setShowCompanyDetail(false);
    setSelectedCompany(null);
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">系統管理</h1>
            <p className="text-gray-600 mt-2">管理系統設定、用戶權限、百貨公司和專櫃資訊</p>
          </div>

          {/* 分頁導航 */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
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
                      <p className="text-sm font-medium text-gray-600">總專櫃數</p>
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalStores}</p>
                      <p className="text-xs text-green-600">營運: {systemStats.activeStores}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <span className="text-2xl">📊</span>
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
                      <p className="text-2xl font-bold text-gray-900">{systemStats.totalWorkHours}</p>
                      <p className="text-xs text-gray-500">小時</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 系統狀態 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">系統狀態</h3>
                  <div className="space-y-3">
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

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
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
          )}

          {/* 百貨管理 */}
          {activeTab === 'department' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">百貨管理</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{mockDepartments.length}</div>
                    <div className="text-sm text-blue-800">總百貨數</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{mockDepartments.reduce((sum, dept) => sum + dept.floors, 0)}</div>
                    <div className="text-sm text-green-800">總樓層數</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{mockDepartments.reduce((sum, dept) => sum + dept.stores, 0)}</div>
                    <div className="text-sm text-purple-800">總專櫃數</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((mockDepartments.filter(dept => dept.status === 'active').length / mockDepartments.length) * 100)}%
                    </div>
                    <div className="text-sm text-orange-800">營運率</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">百貨名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">代碼</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">經理</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">樓層/專櫃</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockDepartments.map((dept) => (
                        <tr key={dept.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                            <div className="text-sm text-gray-500">{dept.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.address}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.manager}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.floors}樓/{dept.stores}櫃</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {dept.status === 'active' ? '營運中' : '維護中'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">編輯</button>
                            <button className="text-gray-600 hover:text-gray-900 mr-3">查看</button>
                            <button className="text-red-600 hover:text-red-900">刪除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 公司管理 */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">公司管理</h2>
                    <p className="text-gray-600">管理百貨公司資訊，包括新增、編輯、刪除等功能。</p>
                  </div>
                  <button onClick={handleAddCompany} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    ➕ 新增公司
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockCompanies.map((company) => (
                    <div key={company.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">統一編號: {company.taxId}</p>
                          <p className="text-sm text-gray-500">負責人: {company.manager}</p>
                          <p className="text-sm text-gray-500">電話: {company.phone}</p>
                          <p className="text-sm text-gray-500">地址: {company.address}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{company.storeCount} 專櫃</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">{company.employeeCount} 員工</span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{company.status === 'active' ? '營運中' : '停用'}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditCompany(company)} className="text-sm text-blue-600 hover:text-blue-900">編輯</button>
                          <button onClick={() => handleViewCompany(company)} className="text-sm text-gray-600 hover:text-gray-900">查看櫃點</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <button onClick={handleAddStore} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    ➕ 新增專櫃
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{mockStores.length}</div>
                    <div className="text-sm text-blue-800">總專櫃數</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{mockStores.filter(store => store.status === 'active').length}</div>
                    <div className="text-sm text-green-800">營運中</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{mockStores.reduce((sum, store) => sum + (store.employeeCount || 0), 0)}</div>
                    <div className="text-sm text-orange-800">總員工數</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((mockStores.filter(store => store.status === 'active').length / mockStores.length) * 100)}%
                    </div>
                    <div className="text-sm text-purple-800">營運率</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">專櫃名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">專櫃代碼</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所屬公司</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地區</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">櫃長</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">員工數</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockStores.map((store) => (
                        <tr key={store.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{store.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.companyName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.areaName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.managerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.employeeCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              store.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {store.status === 'active' ? '營運中' : '停用'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleEditStore(store)} className="text-blue-600 hover:text-blue-900 mr-3">編輯</button>
                            <button onClick={() => handleViewStore(store)} className="text-gray-600 hover:text-gray-900 mr-3">查看</button>
                            <button onClick={() => handleDeleteStore(store)} className="text-red-600 hover:text-red-900">刪除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 用戶管理 */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">用戶管理</h2>
                    <p className="text-gray-600">管理系統用戶，包括角色分配、權限設定等功能。</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    ➕ 新增用戶
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{mockUsers.length}</div>
                    <div className="text-sm text-blue-800">總用戶數</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{mockUsers.filter(user => user.isActive).length}</div>
                    <div className="text-sm text-green-800">活躍用戶</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{mockUsers.filter(user => user.role === 'staff').length}</div>
                    <div className="text-sm text-purple-800">專櫃人員</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">{mockUsers.filter(user => ['store_manager', 'area_manager', 'hq_admin'].includes(user.role)).length}</div>
                    <div className="text-sm text-orange-800">管理人員</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用戶</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立時間</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
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
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                              {getRoleLabel(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? '活躍' : '停用'}
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司名稱</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={selectedCompany?.name || ''}
              placeholder="請輸入公司名稱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">統一編號</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={selectedCompany?.taxId || ''}
              placeholder="請輸入統一編號"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">負責人</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={selectedCompany?.manager || ''}
              placeholder="請輸入負責人姓名"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={() => handleSaveCompany(selectedCompany)}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {modalMode === 'add' ? '新增' : '更新'}
            </button>
          </div>
        </div>
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
    </ProtectedRoute>
  );
};

export default SystemAdminPage;
