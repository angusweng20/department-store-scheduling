import React, { useState } from 'react';
import { useWorkHours } from '../hooks/useWorkHours';
import { usePermission } from '../context/PermissionContext';
import ProtectedRoute from './ProtectedRoute';

const WorkHoursReportPage: React.FC = () => {
  const { workHourStats, loading, error, getWorkHoursByStore, exportToExcel } = useWorkHours();
  const { hasPermission, userRole } = usePermission();
  const [selectedPeriod, setSelectedPeriod] = useState('2026-02');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [storeStats, setStoreStats] = useState<any>(null);
  const [exporting, setExporting] = useState(false);

  // Mock 櫃點選項
  const storeOptions = [
    { id: '', name: '全部櫃點' },
    { id: 'store-1', name: '台中拉拉' },
    { id: 'store-2', name: '南港拉拉' }
  ];

  // 月份選項
  const monthOptions = [
    { value: '2026-01', label: '2026年1月' },
    { value: '2026-02', label: '2026年2月' },
    { value: '2026-03', label: '2026年3月' }
  ];

  // 載入櫃點統計
  const loadStoreStats = async () => {
    if (selectedStore) {
      try {
        const stats = await getWorkHoursByStore(selectedStore, selectedPeriod);
        setStoreStats(stats);
      } catch (err) {
        console.error('載入櫃點統計失敗:', err);
      }
    } else {
      setStoreStats(null);
    }
  };

  // 匯出報表
  const handleExport = async () => {
    try {
      setExporting(true);
      await exportToExcel(selectedPeriod, selectedStore || undefined);
    } catch (err) {
      console.error('匯出失敗:', err);
      alert('匯出失敗：' + (err instanceof Error ? err.message : '未知錯誤'));
    } finally {
      setExporting(false);
    }
  };

  React.useEffect(() => {
    loadStoreStats();
  }, [selectedStore, selectedPeriod]);

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
    <ProtectedRoute requiredPermission="view_area_stats">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">工時統計報表</h1>
            <p className="text-gray-600">查看和匯出員工工時統計資料</p>
          </div>

          {/* 篩選條件 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  統計月份
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {monthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  櫃點篩選
                </label>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {storeOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? '匯出中...' : '📊 匯出 Excel'}
                </button>
              </div>
            </div>
          </div>

          {/* 櫃點統計 */}
          {storeStats && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {storeStats.storeName} - {selectedPeriod} 統計
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{storeStats.staffCount}</div>
                  <div className="text-sm text-blue-800">員工人數</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{storeStats.totalHours.toFixed(1)}</div>
                  <div className="text-sm text-green-800">總工時</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">{storeStats.regularHours.toFixed(1)}</div>
                  <div className="text-sm text-purple-800">原店工時</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{storeStats.supportHours.toFixed(1)}</div>
                  <div className="text-sm text-orange-800">支援工時</div>
                </div>
              </div>
            </div>
          )}

          {/* 員工工時明細 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              員工工時明細
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      員工姓名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      所屬櫃點
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      原店工時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支援工時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      總工時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      支援詳情
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workHourStats
                    .filter(stats => !selectedStore || stats.storeId === selectedStore)
                    .map((stats) => (
                      <tr key={stats.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stats.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.storeId === 'store-1' ? '台中拉拉' : '南港拉拉'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.regularHours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.supportHours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stats.totalHours.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {stats.supportDetails.length > 0 ? (
                            <div className="space-y-1">
                              {stats.supportDetails.map((detail, index) => (
                                <div key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  {detail.targetStoreName}: {detail.hours.toFixed(1)}h
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">無</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 調試資訊 */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">調試資訊</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>當前角色:</strong> {userRole}</div>
              <div><strong>統計期間:</strong> {selectedPeriod}</div>
              <div><strong>選擇櫃點:</strong> {selectedStore || '全部'}</div>
              <div><strong>員工數量:</strong> {workHourStats.length}</div>
              <div><strong>匯出權限:</strong> {hasPermission('view_area_stats') ? '有' : '無'}</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WorkHoursReportPage;
