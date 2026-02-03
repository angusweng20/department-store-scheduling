import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../context/PermissionContext';
import ProtectedRoute from './ProtectedRoute';
import Modal from './Modal';
import type { User, Store } from '../types/permissions';

const SystemAdminPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'department' | 'company' | 'stores' | 'users' | 'system'>('overview');
  
  // 模態框狀態
  const [showCompanyModal, setShowCompanyModal] = useState(false);
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

  // Mock 用戶資料 - 完整結構
  const mockUsers: User[] = [
    {
      id: 'user-001',
      uid: 'USR-2026-001',
      name: '系統管理員',
      phone: '0912345678',
      employeeId: 'EMP001',
      lineUserId: 'U1234567890',
      position: '系統管理員',
      originalRole: 'system_admin', // 系統管理員、測試人員、百貨樓管、公司管理等
     所属单位: null, // 系統管理員不隸屬特定單位
      currentStore: null, // 系統管理員不駐點專櫃
      managementScope: ['dept-001', 'dept-002', 'dept-003'], // 管理所有百貨
      status: '在職', // 在職、離職、留職停薪
      testModeEnabled: true, // 是否具備身分切換權限
      currentSimulatedRole: null, // 目前模擬身分
      temporaryTarget: null, // 臨時掛載對象
      email: 'admin@department-store.com',
      role: 'system_admin' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'user-002',
      uid: 'USR-2026-002',
      name: '張總經理',
      phone: '0923456789',
      employeeId: 'EMP002',
      lineUserId: 'AREA_MANAGER_USER',
      position: '總經理',
      originalRole: 'hq_admin',
      所属单位: 'company-001', // 隸屬耐克公司
      currentStore: null,
      managementScope: ['store-001', 'store-002', 'store-003'], // 管理耐克所有專櫃
      status: '在職',
      testModeEnabled: false,
      currentSimulatedRole: null,
      temporaryTarget: null,
      email: 'zhang@nike.com.tw',
      role: 'hq_admin' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'user-003',
      uid: 'USR-2026-003',
      name: '陳樓管',
      phone: '0934567890',
      employeeId: 'EMP003',
      lineUserId: 'FLOOR_MANAGER_USER',
      position: '樓管',
      originalRole: 'floor_manager',
      所属单位: 'dept-001', // 隸屬A11百貨
      currentStore: null,
      managementScope: ['store-001', 'store-002'], // 管理4F部分專櫃
      status: '在職',
      testModeEnabled: false,
      currentSimulatedRole: null,
      temporaryTarget: null,
      email: 'chen@skm-a11.com.tw',
      role: 'floor_manager' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'user-004',
      uid: 'USR-2026-004',
      name: '李櫃長',
      phone: '0945678901',
      employeeId: 'EMP004',
      lineUserId: 'STORE_MANAGER_USER',
      position: '櫃長',
      originalRole: 'store_manager',
      所属单位: 'company-001', // 隸屬耐克公司
      currentStore: 'store-001', // 駐點Nike A11店
      managementScope: ['store-001'], // 管理該專櫃
      status: '在職',
      testModeEnabled: false,
      currentSimulatedRole: null,
      temporaryTarget: null,
      email: 'li@nike-a11.com.tw',
      role: 'store_manager' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'user-005',
      uid: 'USR-2026-005',
      name: '王專員',
      phone: '0955555555',
      employeeId: 'EMP005',
      lineUserId: 'STAFF_USER',
      position: '銷售專員',
      originalRole: 'staff',
      所属单位: 'company-001', // 隸屬耐克公司
      currentStore: 'store-001', // 駐點Nike A11店
      managementScope: [], // 專員無管理範圍
      status: '在職',
      testModeEnabled: false,
      currentSimulatedRole: null,
      temporaryTarget: null,
      email: 'wang@nike-a11.com.tw',
      role: 'staff' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'user-006',
      uid: 'USR-2026-006',
      name: '測試人員',
      phone: '0966666666',
      employeeId: 'EMP006',
      lineUserId: 'TESTER_USER',
      position: '測工程師',
      originalRole: 'tester',
      所属单位: null,
      currentStore: null,
      managementScope: ['dept-001', 'dept-002'], // 測試用，可管理部分百貨
      status: '在職',
      testModeEnabled: true,
      currentSimulatedRole: 'store_manager', // 目前模擬為櫃長
      temporaryTarget: 'store-001', // 臨時掛載到Nike A11店
      email: 'tester@department-store.com',
      role: 'tester' as any,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  // Mock 櫃點資料 - 完整結構
  const mockStores: Store[] = [
    {
      id: 'store-001',
      uid: 'ST-2026-001',
      counterCode: 'V1023',
      name: 'Nike A11 店',
      brandName: 'Nike',
      companyId: 'company-001',
      companyName: '耐克台灣股份有限公司',
      departmentId: 'dept-001',
      departmentName: '新光三越台北信義新天地A11館',
      location: '4F 區域 A',
      type: '正櫃', // 正櫃、臨時櫃、花車、快閃櫃
      area: 25, // 坪數
      floorManagerId: 'user-006',
      floorManagerName: '陳樓管',
      staff: ['user-003', 'user-004', 'user-005'],
      entryDate: '2023-01-15',
      exitDate: null,
      status: 'active' as any, // 裝修中、營業中、已撤櫃
      phone: '02-8101-2123',
      email: 'nike-a11@nike.com.tw',
      monthlyRevenue: '2,500,000',
      employeeCount: 8,
      isActive: true,
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2026-01-15T00:00:00Z'
    },
    {
      id: 'store-002',
      uid: 'ST-2026-002',
      counterCode: 'V1024',
      name: 'Adidas A11 店',
      brandName: 'Adidas',
      companyId: 'company-002',
      companyName: '阿迪達斯台灣股份有限公司',
      departmentId: 'dept-001',
      departmentName: '新光三越台北信義新天地A11館',
      location: '4F 區域 B',
      type: '正櫃',
      area: 30,
      floorManagerId: 'user-006',
      floorManagerName: '陳樓管',
      staff: ['user-011', 'user-012'],
      entryDate: '2023-02-01',
      exitDate: null,
      status: '營業中',
      phone: '02-8101-2124',
      email: 'adidas-a11@adidas.com.tw',
      monthlyRevenue: '2,200,000',
      employeeCount: 6,
      isActive: true,
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2026-01-15T00:00:00Z'
    },
    {
      id: 'store-003',
      uid: 'ST-2026-003',
      counterCode: 'V1025',
      name: 'Uniqlo A11 店',
      brandName: 'Uniqlo',
      companyId: 'company-003',
      companyName: '優衣庫台灣股份有限公司',
      departmentId: 'dept-001',
      departmentName: '新光三越台北信義新天地A11館',
      location: '5F 區域 C',
      type: '正櫃',
      area: 45,
      floorManagerId: 'user-007',
      floorManagerName: '林樓管',
      staff: ['user-015', 'user-016', 'user-017'],
      entryDate: '2023-03-15',
      exitDate: null,
      status: '營業中',
      phone: '02-8101-2125',
      email: 'uniqlo-a11@uniqlo.com.tw',
      monthlyRevenue: '3,800,000',
      employeeCount: 12,
      isActive: true,
      createdAt: '2023-03-15T00:00:00Z',
      updatedAt: '2026-01-15T00:00:00Z'
    },
    {
      id: 'store-004',
      uid: 'ST-2026-004',
      counterCode: 'V1026',
      name: 'Nike 快閃店',
      brandName: 'Nike',
      companyId: 'company-001',
      companyName: '耐克台灣股份有限公司',
      departmentId: 'dept-002',
      departmentName: '新光三越台北信義新天地A8館',
      location: '1F 中庭',
      type: '快閃櫃',
      area: 15,
      floorManagerId: 'user-008',
      floorManagerName: '黃樓管',
      staff: ['user-018'],
      entryDate: '2025-12-01',
      exitDate: '2026-02-28',
      status: '營業中',
      phone: '02-8101-2226',
      email: 'nike-popup@nike.com.tw',
      monthlyRevenue: '800,000',
      employeeCount: 3,
      isActive: true,
      createdAt: '2025-12-01T00:00:00Z',
      updatedAt: '2026-01-15T00:00:00Z'
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

  // Mock 百貨資料 - 完整結構
  const mockDepartments = [
    {
      id: 'dept-001',
      uid: 'DS-2026-001',
      code: 'SKM-A11',
      name: '新光三越台北信義新天地A11館',
      address: '台北市信義區松高路12號',
      region: '台北市信義區',
      operatingHours: '11:00-22:00',
      floors: ['B2', 'B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F'],
      stores: ['store-001', 'store-002', 'store-003', 'store-004', 'store-005'],
      floorManagers: ['user-006', 'user-007'],
      contactPerson: '陳經理',
      contactPhone: '0912345678',
      mainPhone: '02-8101-2111',
      operatingStatus: '營業中', // 營業中、整修中、結束營業
      establishedDate: '2020-01-15',
      monthlyRevenue: '45,000,000',
      totalEmployees: 850,
      parkingSpaces: 1200,
      description: '信義區旗艦百貨，13層樓高，包含國際精品與時尚品牌'
    },
    {
      id: 'dept-002',
      uid: 'DS-2026-002',
      code: 'SKM-A8',
      name: '新光三越台北信義新天地A8館',
      address: '台北市信義區松高路19號',
      region: '台北市信義區',
      operatingHours: '11:00-22:00',
      floors: ['B2', 'B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F'],
      stores: ['store-006', 'store-007', 'store-008'],
      floorManagers: ['user-008'],
      contactPerson: '林經理',
      contactPhone: '0923456789',
      mainPhone: '02-8101-2211',
      operatingStatus: '營業中',
      establishedDate: '2019-03-20',
      monthlyRevenue: '28,000,000',
      totalEmployees: 620,
      parkingSpaces: 800,
      description: '時尚生活百貨，以年輕族群為主要客層'
    },
    {
      id: 'dept-003',
      uid: 'DS-2026-003',
      code: 'SKM-TC',
      name: '新光三越台中中港店',
      address: '台中市西區台灣大道二段459號',
      region: '台中市西區',
      operatingHours: '11:00-21:30',
      floors: ['B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F'],
      stores: ['store-009', 'store-010', 'store-011'],
      floorManagers: ['user-009'],
      contactPerson: '黃經理',
      contactPhone: '0934567890',
      mainPhone: '04-2226-1818',
      operatingStatus: '整修中',
      establishedDate: '2018-09-10',
      monthlyRevenue: '18,000,000',
      totalEmployees: 450,
      parkingSpaces: 600,
      description: '中部地區主要百貨據點，目前正在進行部分樓層整修'
    }
  ];

  // Mock 公司資料 - 完整結構
  const mockCompanies = [
    {
      id: 'company-001',
      uid: 'CO-2026-001',
      taxId: '12345678',
      name: '耐克台灣股份有限公司',
      legalName: '耐克台灣股份有限公司',
      managerId: 'user-002',
      managerName: '張總經理',
      address: '台北市信義區松仁路100號12樓',
      phone: '02-8789-1234',
      email: 'contact@nike.com.tw',
      systemAccountId: 'user-002',
      stores: ['store-001', 'store-002', 'store-003'],
      employees: ['user-003', 'user-004', 'user-005'],
      accountStatus: '啟用', // 啟用、停權、試用中
      businessStatus: '營運中', // 營運中、歇業、倒閉
      establishedDate: '2015-06-15',
      registeredCapital: '50,000,000',
      description: '全球知名運動品牌台灣分公司'
    },
    {
      id: 'company-002',
      uid: 'CO-2026-002',
      taxId: '87654321',
      name: '阿迪達斯台灣股份有限公司',
      legalName: '阿迪達斯台灣股份有限公司',
      managerId: 'user-010',
      managerName: '李總經理',
      address: '台北市大安區敦化南路二段76號15樓',
      phone: '02-2700-5678',
      email: 'info@adidas.com.tw',
      systemAccountId: 'user-010',
      stores: ['store-004', 'store-005', 'store-006'],
      employees: ['user-011', 'user-012', 'user-013'],
      accountStatus: '啟用',
      businessStatus: '營運中',
      establishedDate: '2014-03-20',
      registeredCapital: '45,000,000',
      description: '德國運動品牌台灣總代理'
    },
    {
      id: 'company-003',
      uid: 'CO-2026-003',
      taxId: '98765432',
      name: '優衣庫台灣股份有限公司',
      legalName: '優衣庫台灣股份有限公司',
      managerId: 'user-014',
      managerName: '王總經理',
      address: '台北市中山區南京東路三段217號14樓',
      phone: '02-2508-1234',
      email: 'service@uniqlo.com.tw',
      systemAccountId: 'user-014',
      stores: ['store-007', 'store-008'],
      employees: ['user-015', 'user-016'],
      accountStatus: '試用中',
      businessStatus: '營運中',
      establishedDate: '2018-09-01',
      registeredCapital: '30,000,000',
      description: '日本服飾品牌台灣分公司'
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

  const handleViewCompanyStores = (company: any) => {
    // 跳轉到專櫃管理頁面，並傳遞公司參數
    navigate(`/system-admin/stores?company=${company.id}&companyName=${encodeURIComponent(company.name)}`);
    console.log('🏢 查看公司櫃點:', company);
  };

  const handleSaveCompany = (company: any) => {
    console.log('保存公司:', company);
    alert(`${modalMode === 'add' ? '新增' : '更新'}公司成功！`);
    setShowCompanyModal(false);
    setSelectedCompany(null);
  };

  const handleCloseModal = () => {
    setShowCompanyModal(false);
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
                    <div className="text-2xl font-bold text-green-600">{mockDepartments.reduce((sum, dept) => sum + dept.floors.length, 0)}</div>
                    <div className="text-sm text-green-800">總樓層數</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">{mockDepartments.reduce((sum, dept) => sum + dept.stores.length, 0)}</div>
                    <div className="text-sm text-purple-800">總專櫃數</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((mockDepartments.filter(dept => dept.operatingStatus === '營業中').length / mockDepartments.length) * 100)}%
                    </div>
                    <div className="text-sm text-orange-800">營運率</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">百貨代碼</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">百貨名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址/區域</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">營業時間</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">樓層數</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">專櫃數</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">聯絡窗口</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">營運狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockDepartments.map((dept) => (
                        <tr key={dept.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.uid}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                            <div className="text-sm text-gray-500">{dept.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{dept.address}</div>
                            <div className="text-xs text-gray-400">{dept.region}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.operatingHours}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.floors.length}層</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.stores.length}櫃</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{dept.contactPerson}</div>
                            <div className="text-xs text-gray-400">{dept.contactPhone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              dept.operatingStatus === '營業中' ? 'bg-green-100 text-green-800' : 
                              dept.operatingStatus === '整修中' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {dept.operatingStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">編輯</button>
                            <button className="text-gray-600 hover:text-gray-900 mr-3">查看樓層</button>
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
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">{company.uid}</span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">統編:</span> {company.taxId}</p>
                            <p><span className="font-medium">負責人:</span> {company.managerName}</p>
                            <p><span className="font-medium">公司地址:</span> {company.address}</p>
                            <p><span className="font-medium">公司電話:</span> {company.phone}</p>
                            <p><span className="font-medium">聯絡Email:</span> {company.email}</p>
                            <p><span className="font-medium">資本額:</span> NT${company.registeredCapital}</p>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{company.stores.length} 專櫃</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">{company.employees.length} 人員</span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              company.accountStatus === '啟用' ? 'bg-green-100 text-green-800' : 
                              company.accountStatus === '試用中' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {company.accountStatus}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              company.businessStatus === '營運中' ? 'bg-green-100 text-green-800' : 
                              company.businessStatus === '歇業' ? 'bg-orange-100 text-orange-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {company.businessStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button onClick={() => handleEditCompany(company)} className="text-sm text-blue-600 hover:text-blue-900">編輯</button>
                          <button onClick={() => handleViewCompanyStores(company)} className="text-sm text-gray-600 hover:text-gray-900">查看櫃點</button>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">櫃位代號</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">專櫃名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所屬公司</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所在百貨</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所在位置</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">型態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">坪數</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">負責樓管</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">櫃上人員</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockStores.map((store) => (
                        <tr key={store.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).uid || store.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).counterCode || store.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                            <div className="text-sm text-gray-500">{(store as any).phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).brandName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.companyName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).departmentName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).location || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).type || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).area ? `${(store as any).area}坪` : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).floorManagerName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(store as any).staff ? `${(store as any).staff.length}人` : store.employeeCount || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              store.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {store.status === 'active' ? '營業中' : '停用'}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名/職稱</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">員工編號</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LINE UID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">原始身分</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所屬單位</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所在專櫃</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">測試模式</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(user as any).uid || user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{(user as any).position || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(user as any).employeeId || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lineUserId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                              {getRoleLabel(user.role)}
                            </span>
                            <div className="text-xs text-gray-400 mt-1">{(user as any).originalRole || user.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(user as any).所属单位 || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(user as any).currentStore || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                (user as any).testModeEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {(user as any).testModeEnabled ? '啟用' : '停用'}
                              </span>
                              {(user as any).currentSimulatedRole && (
                                <span className="text-xs text-blue-600 mt-1">模擬: {(user as any).currentSimulatedRole}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {(user as any).status || (user.isActive ? '在職' : '離職')}
                            </span>
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
    </ProtectedRoute>
  );
};

export default SystemAdminPage;
