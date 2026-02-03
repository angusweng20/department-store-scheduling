import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../context/PermissionContext';
import ProtectedRoute from './ProtectedRoute';
import Modal from './Modal';
import { departmentService, companyService, storeService, userService } from '../services/databaseService';

const SystemAdminPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'department' | 'company' | 'stores' | 'users' | 'system'>('overview');
  
  // 模態框狀態
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // 資料狀態
  const [departments, setDepartments] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入資料
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [departmentsData, companiesData, storesData, usersData] = await Promise.all([
        departmentService.getAll(),
        companyService.getAll(),
        storeService.getAll(),
        userService.getAll()
      ]);

      setDepartments(departmentsData);
      setCompanies(companiesData);
      setStores(storesData);
      setUsers(usersData);
    } catch (err) {
      console.error('載入資料失敗:', err);
      setError('載入資料失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

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

  const getRoleLabel = (role: string) => {
    const roleMap = {
      'system_admin': '系統管理員',
      'tester': '測試人員',
      'hq_admin': '公司管理',
      'area_manager': '地區經理',
      'floor_manager': '百貨樓管',
      'store_manager': '櫃長',
      'staff': '櫃員'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap = {
      'system_admin': 'bg-purple-100 text-purple-800',
      'tester': 'bg-gray-100 text-gray-800',
      'hq_admin': 'bg-red-100 text-red-800',
      'area_manager': 'bg-orange-100 text-orange-800',
      'floor_manager': 'bg-blue-100 text-blue-800',
      'store_manager': 'bg-green-100 text-green-800',
      'staff': 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[role as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  // 處理櫃點操作
  const handleEditStore = (store: any) => {
    console.log('🏪 編輯專櫃:', store);
  };

  const handleViewStore = (store: any) => {
    console.log('🏪 查看專櫃:', store);
  };

  const handleAddStore = () => {
    console.log('🏪 新增專櫃');
    alert('新增專櫃功能開發中...');
  };

  const handleDeleteStore = (store: any) => {
    if (window.confirm(`確定要刪除專櫃「${store.name}」嗎？`)) {
      console.log('🏪 刪除專櫃:', store);
      alert(`專櫃「${store.name}」已刪除`);
    }
  };

  // 處理公司操作
  const handleAddCompany = async () => {
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
    navigate(`/system-admin/stores?company=${company.id}&companyName=${encodeURIComponent(company.name)}`);
    console.log('🏢 查看公司櫃點:', company);
  };

  const handleSaveCompany = async (company: any) => {
    try {
      console.log('保存公司:', company);
      if (modalMode === 'add') {
        await companyService.create(company);
        alert('新增公司成功！');
      } else {
        await companyService.update(selectedCompany.id, company);
        alert('更新公司成功！');
      }
      setShowCompanyModal(false);
      setSelectedCompany(null);
      loadData();
    } catch (error) {
      console.error('保存公司失敗:', error);
      alert('保存公司失敗，請稍後再試');
    }
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
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* 載入狀態 */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">載入資料中...</p>
              </div>
            </div>
          )}

          {/* 錯誤狀態 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">載入失敗</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={loadData}
                      className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      重新載入
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 主要內容 */}
          {!loading && !error && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">系統管理</h1>
                <p className="text-gray-600">管理百貨系統的所有設定和資料</p>
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
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">系統概覽</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{systemStats.totalUsers}</div>
                        <div className="text-sm text-blue-800">總用戶數</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</div>
                        <div className="text-sm text-green-800">活躍用戶</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{systemStats.totalStores}</div>
                        <div className="text-sm text-purple-800">總專櫃數</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-600">{systemStats.totalShifts}</div>
                        <div className="text-sm text-orange-800">總班次數</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 簡化版其他標籤 */}
              {activeTab !== 'overview' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">此功能正在開發中...</p>
                    <p className="text-sm text-gray-500">資料庫整合已完成，UI 正在完善中</p>
                  </div>
                </div>
              )}
            </>
          )}

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
                  defaultValue={selectedCompany?.tax_id || ''}
                  placeholder="請輸入統一編號"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">負責人</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedCompany?.manager_name || ''}
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
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SystemAdminPage;
