import { useState, useEffect } from 'react';
import { usePermission } from '../context/PermissionContext';
import { useCrossStoreSupport } from './useCrossStoreSupport';
import type { WorkHourStats, Shift, User } from '../types/permissions';

interface UseWorkHoursReturn {
  workHourStats: WorkHourStats[];
  loading: boolean;
  error: string | null;
  calculateWorkHours: (userId: string, period: string) => Promise<WorkHourStats>;
  getWorkHoursByStore: (storeId: string, period: string) => Promise<{
    storeId: string;
    storeName: string;
    totalHours: number;
    regularHours: number;
    supportHours: number;
    staffCount: number;
  }>;
  exportToExcel: (period: string, storeId?: string) => Promise<void>;
  getMonthlyStats: (userId: string, year: number, month: number) => Promise<WorkHourStats[]>;
}

export const useWorkHours = (): UseWorkHoursReturn => {
  const { hasPermission } = usePermission();
  const { supportShifts } = useCrossStoreSupport();
  const [workHourStats, setWorkHourStats] = useState<WorkHourStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock 一般班次資料
  const mockRegularShifts: Shift[] = [
    {
      id: 'regular-1',
      userId: '4',
      storeId: 'store-1',
      date: '2026-02-01',
      shiftType: 'full',
      startTime: '09:00',
      endTime: '18:00',
      breakTime: 1.5,
      actualHours: 7.5,
      isSupportShift: false,
      status: 'completed',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z'
    },
    {
      id: 'regular-2',
      userId: '4',
      storeId: 'store-1',
      date: '2026-02-05',
      shiftType: 'morning',
      startTime: '09:00',
      endTime: '13:00',
      breakTime: 0.5,
      actualHours: 3.5,
      isSupportShift: false,
      status: 'completed',
      createdAt: '2026-02-05T00:00:00Z',
      updatedAt: '2026-02-05T00:00:00Z'
    },
    {
      id: 'regular-3',
      userId: '4',
      storeId: 'store-1',
      date: '2026-02-10',
      shiftType: 'evening',
      startTime: '14:00',
      endTime: '18:00',
      breakTime: 0.5,
      actualHours: 3.5,
      isSupportShift: false,
      status: 'completed',
      createdAt: '2026-02-10T00:00:00Z',
      updatedAt: '2026-02-10T00:00:00Z'
    }
  ];

  // Mock 用戶資料
  const mockUsers: User[] = [
    {
      id: '4',
      lineUserId: 'U4567890123',
      name: '專櫃人員',
      email: 'staff@department-store.com',
      phone: '0945678901',
      role: 'staff' as any,
      storeId: 'store-1',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    }
  ];

  // Mock 櫃點資料
  const mockStores = [
    { id: 'store-1', name: '台中拉拉' },
    { id: 'store-2', name: '南港拉拉' }
  ];

  // 計算工作時數
  const calculateWorkHours = async (userId: string, period: string): Promise<WorkHourStats> => {
    try {
      // 取得該用戶在該期間的所有班次
      const [year, month] = period.split('-').map(Number);
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

      const userRegularShifts = mockRegularShifts.filter(shift => 
        shift.userId === userId && 
        shift.date >= startDate && 
        shift.date <= endDate &&
        shift.status === 'completed'
      );

      const userSupportShifts = supportShifts.filter(shift => 
        shift.userId === userId && 
        shift.date >= startDate && 
        shift.date <= endDate &&
        shift.status === 'completed'
      );

      // 計算原店工時
      const regularHours = userRegularShifts.reduce((total, shift) => total + shift.actualHours, 0);

      // 計算支援工時
      const supportHours = userSupportShifts.reduce((total, shift) => total + shift.actualHours, 0);

      // 計算支援詳情
      const supportDetails = userSupportShifts.reduce((details, shift) => {
        const targetStore = mockStores.find(store => store.id === shift.targetStoreId);
        if (targetStore) {
          const existingDetail = details.find(d => d.targetStoreId === shift.targetStoreId);
          if (existingDetail) {
            existingDetail.hours += shift.actualHours;
          } else {
            details.push({
              targetStoreId: shift.targetStoreId || '',
              targetStoreName: targetStore.name,
              hours: shift.actualHours
            });
          }
        }
        return details;
      }, [] as { targetStoreId: string; targetStoreName: string; hours: number }[]);

      const user = mockUsers.find(u => u.id === userId);
      const stats: WorkHourStats = {
        userId,
        userName: user?.name || '未知用戶',
        storeId: user?.storeId || '',
        period,
        regularHours,
        supportHours,
        totalHours: regularHours + supportHours,
        supportDetails
      };

      console.log('✅ 工時計算完成:', stats);
      return stats;

    } catch (err) {
      console.error('❌ 計算工時失敗:', err);
      throw err;
    }
  };

  // 取得櫃點工時統計
  const getWorkHoursByStore = async (storeId: string, period: string) => {
    try {
      // 取得該櫃點所有用戶的工時
      const storeUsers = mockUsers.filter(user => user.storeId === storeId);
      const userStats = await Promise.all(
        storeUsers.map(user => calculateWorkHours(user.id, period))
      );

      const totalRegularHours = userStats.reduce((total, stats) => total + stats.regularHours, 0);
      const totalSupportHours = userStats.reduce((total, stats) => total + stats.supportHours, 0);

      const store = mockStores.find(s => s.id === storeId);

      return {
        storeId,
        storeName: store?.name || '未知櫃點',
        totalHours: totalRegularHours + totalSupportHours,
        regularHours: totalRegularHours,
        supportHours: totalSupportHours,
        staffCount: storeUsers.length
      };

    } catch (err) {
      console.error('❌ 取得櫃點工時統計失敗:', err);
      throw err;
    }
  };

  // 匯出 Excel 功能
  const exportToExcel = async (period: string, storeId?: string) => {
    if (!hasPermission('view_area_stats') && !hasPermission('view_own_hours')) {
      throw new Error('沒有權限匯出工時報表');
    }

    try {
      // 準備匯出資料
      let exportData: any[] = [];

      if (storeId) {
        // 單一櫃點匯出
        const storeStats = await getWorkHoursByStore(storeId, period);
        const storeUsers = mockUsers.filter(user => user.storeId === storeId);
        
        for (const user of storeUsers) {
          const userStats = await calculateWorkHours(user.id, period);
          exportData.push({
            '員工姓名': userStats.userName,
            '員工ID': userStats.userId,
            '所屬櫃點': storeStats.storeName,
            '統計期間': period,
            '原店工時': userStats.regularHours,
            '支援工時': userStats.supportHours,
            '總工時': userStats.totalHours,
            '支援詳情': userStats.supportDetails.map(d => `${d.targetStoreName}: ${d.hours}小時`).join(', ') || '無'
          });
        }
      } else {
        // 全部匯出
        for (const user of mockUsers) {
          const userStats = await calculateWorkHours(user.id, period);
          const userStore = mockStores.find(s => s.id === user.storeId);
          exportData.push({
            '員工姓名': userStats.userName,
            '員工ID': userStats.userId,
            '所屬櫃點': userStore?.name || '未知',
            '統計期間': period,
            '原店工時': userStats.regularHours,
            '支援工時': userStats.supportHours,
            '總工時': userStats.totalHours,
            '支援詳情': userStats.supportDetails.map(d => `${d.targetStoreName}: ${d.hours}小時`).join(', ') || '無'
          });
        }
      }

      // 模擬下載 Excel (實際應用中會使用如 xlsx 庫)
      console.log('📊 Excel 匯出資料:', exportData);
      
      // 建立並下載 CSV 檔案 (簡化版本)
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `工時統計_${period}${storeId ? `_${storeId}` : ''}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Excel 匯出完成');

    } catch (err) {
      console.error('❌ Excel 匯出失敗:', err);
      throw err;
    }
  };

  // 取得月度統計
  const getMonthlyStats = async (userId: string, year: number, month: number): Promise<WorkHourStats[]> => {
    const period = `${year}-${month.toString().padStart(2, '0')}`;
    const stats = await calculateWorkHours(userId, period);
    return [stats];
  };

  // 載入工時統計
  const fetchWorkHourStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // 載入當前月份的所有用戶工時統計
      const currentPeriod = '2026-02';
      const allStats = await Promise.all(
        mockUsers.map(user => calculateWorkHours(user.id, currentPeriod))
      );

      setWorkHourStats(allStats);
      console.log('✅ 工時統計載入完成:', allStats.length);

    } catch (err) {
      console.error('❌ 載入工時統計失敗:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkHourStats();
  }, [supportShifts]);

  return {
    workHourStats,
    loading,
    error,
    calculateWorkHours,
    getWorkHoursByStore,
    exportToExcel,
    getMonthlyStats
  };
};
