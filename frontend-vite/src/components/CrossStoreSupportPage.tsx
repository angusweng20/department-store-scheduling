import React, { useState } from 'react';
import { useCrossStoreSupport } from '../hooks/useCrossStoreSupport';
import { usePermission } from '../context/PermissionContext';
import ProtectedRoute from './ProtectedRoute';
import type { Shift } from '../types/permissions';

const CrossStoreSupportPage: React.FC = () => {
  const { 
    supportShifts, 
    loading, 
    error, 
    createSupportShift, 
    updateSupportShift, 
    cancelSupportShift,
    getSupportShiftsForStore,
    validateSupportRequest
  } = useCrossStoreSupport();
  
  const { hasPermission, currentUser, userStore } = usePermission();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    date: '',
    shiftType: 'full' as 'morning' | 'evening' | 'full',
    startTime: '09:00',
    endTime: '18:00',
    breakTime: 1.5,
    targetStoreId: ''
  });

  // Mock 用戶選項
  const userOptions = [
    { id: '4', name: '專櫃人員', storeId: 'store-1' },
    { id: '3', name: '櫃長', storeId: 'store-1' }
  ];

  // Mock 櫃點選項
  const storeOptions = [
    { id: 'store-1', name: '台中拉拉' },
    { id: 'store-2', name: '南港拉拉' }
  ];

  // 班次類型選項
  const shiftTypeOptions = [
    { value: 'morning', label: '早班 (09:00-13:00)' },
    { value: 'evening', label: '晚班 (14:00-18:00)' },
    { value: 'full', label: '全天 (09:00-18:00)' }
  ];

  // 處理班次類型變更
  const handleShiftTypeChange = (shiftType: string) => {
    const timeSettings = {
      morning: { startTime: '09:00', endTime: '13:00', breakTime: 0.5 },
      evening: { startTime: '14:00', endTime: '18:00', breakTime: 0.5 },
      full: { startTime: '09:00', endTime: '18:00', breakTime: 1.5 }
    };

    setFormData(prev => ({
      ...prev,
      shiftType: shiftType as any,
      ...timeSettings[shiftType as keyof typeof timeSettings]
    }));
  };

  // 計算實際工時
  const calculateActualHours = () => {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0, totalHours - formData.breakTime);
  };

  // 建立支援班次
  const handleCreateSupportShift = async () => {
    try {
      // 驗證請求
      const validation = validateSupportRequest(
        formData.userId,
        formData.date,
        formData.targetStoreId
      );

      if (!validation.isValid) {
        alert('驗證失敗：' + validation.error);
        return;
      }

      const selectedUser = userOptions.find(u => u.id === formData.userId);
      const shiftData: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: formData.userId,
        storeId: formData.targetStoreId,
        date: formData.date,
        shiftType: formData.shiftType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakTime: formData.breakTime,
        actualHours: calculateActualHours(),
        isSupportShift: true,
        originalStoreId: selectedUser?.storeId,
        targetStoreId: formData.targetStoreId,
        status: 'scheduled'
      };

      await createSupportShift(shiftData);
      
      // 重置表單
      setFormData({
        userId: '',
        date: '',
        shiftType: 'full',
        startTime: '09:00',
        endTime: '18:00',
        breakTime: 1.5,
        targetStoreId: ''
      });
      setShowCreateForm(false);
      
      alert('支援班次建立成功！');
    } catch (err) {
      console.error('建立支援班次失敗:', err);
      alert('建立失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  // 取消支援班次
  const handleCancelSupportShift = async (shiftId: string) => {
    if (!confirm('確定要取消這個支援班次嗎？')) {
      return;
    }

    try {
      await cancelSupportShift(shiftId);
      alert('支援班次已取消！');
    } catch (err) {
      console.error('取消支援班次失敗:', err);
      alert('取消失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">載入失敗</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredPermission="manage_store_schedule">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* 頁面標題 */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">跨店支援管理</h1>
              <p className="text-gray-600">管理員工跨店支援班次</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ➕ 新增支援班次
            </button>
          </div>

          {/* 新增支援班次表單 */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">新增支援班次</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    支援人員 *
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">請選擇人員</option>
                    {userOptions.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} (所屬: {user.storeId === 'store-1' ? '台中拉拉' : '南港拉拉'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    支援日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    班次類型 *
                  </label>
                  <select
                    value={formData.shiftType}
                    onChange={(e) => handleShiftTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {shiftTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目標櫃點 *
                  </label>
                  <select
                    value={formData.targetStoreId}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetStoreId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">請選擇目標櫃點</option>
                    {storeOptions.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    開始時間
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    結束時間
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    休息時間 (小時)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="4"
                    value={formData.breakTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakTime: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    實際工時
                  </label>
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                    {calculateActualHours().toFixed(1)} 小時
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateSupportShift}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  建立支援班次
                </button>
              </div>
            </div>
          )}

          {/* 支援班次列表 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">支援班次列表</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支援人員
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支援日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      班次類型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      原屬櫃點
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      目標櫃點
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      工時
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
                  {supportShifts.map((shift) => {
                    const user = userOptions.find(u => u.id === shift.userId);
                    const originalStore = storeOptions.find(s => s.id === shift.originalStoreId);
                    const targetStore = storeOptions.find(s => s.id === shift.targetStoreId);
                    
                    return (
                      <tr key={shift.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user?.name || '未知'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shift.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shift.shiftType === 'morning' ? '早班' : 
                           shift.shiftType === 'evening' ? '晚班' : '全天'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {originalStore?.name || '未知'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {targetStore?.name || '未知'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shift.actualHours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            shift.status === 'scheduled' 
                              ? 'bg-blue-100 text-blue-800'
                              : shift.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {shift.status === 'scheduled' ? '已排定' : 
                             shift.status === 'completed' ? '已完成' : '已取消'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {shift.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancelSupportShift(shift.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              取消
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 調試資訊 */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">調試資訊</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>當前用戶:</strong> {currentUser?.name}</div>
              <div><strong>所屬櫃點:</strong> {userStore?.name || '無'}</div>
              <div><strong>支援班次數量:</strong> {supportShifts.length}</div>
              <div><strong>管理權限:</strong> {hasPermission('manage_store_schedule') ? '有' : '無'}</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CrossStoreSupportPage;
