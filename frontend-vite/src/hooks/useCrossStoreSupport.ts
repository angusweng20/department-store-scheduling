import { useState, useEffect } from 'react';
import { usePermission } from '../context/PermissionContext';
import type { Shift, Store, User } from '../types/permissions';

interface UseCrossStoreSupportReturn {
  supportShifts: Shift[];
  loading: boolean;
  error: string | null;
  createSupportShift: (shiftData: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSupportShift: (id: string, shiftData: Partial<Shift>) => Promise<void>;
  cancelSupportShift: (id: string) => Promise<void>;
  getSupportShiftsForStore: (storeId: string, date: string) => Shift[];
  getSupportShiftsByUser: (userId: string, startDate: string, endDate: string) => Shift[];
  validateSupportRequest: (userId: string, date: string, targetStoreId: string) => {
    isValid: boolean;
    error?: string;
  };
}

export const useCrossStoreSupport = (): UseCrossStoreSupportReturn => {
  const { hasPermission, currentUser, userStore } = usePermission();
  const [supportShifts, setSupportShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock 資料 - 實際應用中應從 API 取得
  const mockSupportShifts: Shift[] = [
    {
      id: 'support-1',
      userId: '4', // 專櫃人員
      storeId: 'store-2', // 目標店 (南港拉拉)
      date: '2026-02-15',
      shiftType: 'full',
      startTime: '09:00',
      endTime: '18:00',
      breakTime: 1.5,
      actualHours: 7.5,
      isSupportShift: true,
      originalStoreId: 'store-1', // 原屬店 (台中拉拉)
      targetStoreId: 'store-2',
      status: 'scheduled',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z'
    },
    {
      id: 'support-2',
      userId: '3', // 櫃長
      storeId: 'store-1', // 目標店 (台中拉拉)
      date: '2026-02-20',
      shiftType: 'morning',
      startTime: '09:00',
      endTime: '13:00',
      breakTime: 0.5,
      actualHours: 3.5,
      isSupportShift: true,
      originalStoreId: 'store-2', // 原屬店 (南港拉拉)
      targetStoreId: 'store-1',
      status: 'scheduled',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z'
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

  // 載入支援班次
  const fetchSupportShifts = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 從 API 取得資料
      await new Promise(resolve => setTimeout(resolve, 500));

      setSupportShifts(mockSupportShifts);
      console.log('✅ 支援班次載入完成:', mockSupportShifts.length);
    } catch (err) {
      console.error('❌ 載入支援班次失敗:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  // 建立支援班次
  const createSupportShift = async (shiftData: Omit<Shift, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!hasPermission('manage_store_schedule')) {
      throw new Error('沒有權限建立支援班次');
    }

    try {
      const newShift: Shift = {
        ...shiftData,
        id: `support-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // TODO: 呼叫 API 建立
      await new Promise(resolve => setTimeout(resolve, 300));

      setSupportShifts(prev => [...prev, newShift]);
      console.log('✅ 支援班次建立成功:', newShift.id);
    } catch (err) {
      console.error('❌ 建立支援班次失敗:', err);
      throw err;
    }
  };

  // 更新支援班次
  const updateSupportShift = async (id: string, shiftData: Partial<Shift>) => {
    if (!hasPermission('manage_store_schedule')) {
      throw new Error('沒有權限更新支援班次');
    }

    try {
      // TODO: 呼叫 API 更新
      await new Promise(resolve => setTimeout(resolve, 300));

      setSupportShifts(prev => 
        prev.map(shift => 
          shift.id === id 
            ? { ...shift, ...shiftData, updatedAt: new Date().toISOString() }
            : shift
        )
      );
      console.log('✅ 支援班次更新成功:', id);
    } catch (err) {
      console.error('❌ 更新支援班次失敗:', err);
      throw err;
    }
  };

  // 取消支援班次
  const cancelSupportShift = async (id: string) => {
    if (!hasPermission('manage_store_schedule')) {
      throw new Error('沒有權限取消支援班次');
    }

    try {
      // TODO: 呼叫 API 取消
      await new Promise(resolve => setTimeout(resolve, 300));

      setSupportShifts(prev => 
        prev.map(shift => 
          shift.id === id 
            ? { ...shift, status: 'cancelled', updatedAt: new Date().toISOString() }
            : shift
        )
      );
      console.log('✅ 支援班次取消成功:', id);
    } catch (err) {
      console.error('❌ 取消支援班次失敗:', err);
      throw err;
    }
  };

  // 取得特定櫃點的支援班次
  const getSupportShiftsForStore = (storeId: string, date: string): Shift[] => {
    return supportShifts.filter(shift => 
      shift.targetStoreId === storeId && 
      shift.date === date && 
      shift.status === 'scheduled'
    );
  };

  // 取得特定用戶的支援班次
  const getSupportShiftsByUser = (userId: string, startDate: string, endDate: string): Shift[] => {
    return supportShifts.filter(shift => 
      shift.userId === userId &&
      shift.date >= startDate &&
      shift.date <= endDate &&
      shift.status === 'scheduled'
    );
  };

  // 驗證支援請求
  const validateSupportRequest = (userId: string, date: string, targetStoreId: string) => {
    // 檢查是否為同店支援 (不允許)
    const user = mockUsers.find(u => u.id === userId);
    if (user?.storeId === targetStoreId) {
      return {
        isValid: false,
        error: '無法向所屬櫃點申請支援'
      };
    }

    // 檢查是否已有相同日期的班次
    const existingShift = supportShifts.find(shift => 
      shift.userId === userId && 
      shift.date === date && 
      shift.status === 'scheduled'
    );

    if (existingShift) {
      return {
        isValid: false,
        error: '該日期已有排班，無法重複申請支援'
      };
    }

    // 檢查目標櫃點是否存在
    const targetStore = mockStores.find(store => store.id === targetStoreId);
    if (!targetStore) {
      return {
        isValid: false,
        error: '目標櫃點不存在'
      };
    }

    return {
      isValid: true
    };
  };

  useEffect(() => {
    fetchSupportShifts();
  }, []);

  return {
    supportShifts,
    loading,
    error,
    createSupportShift,
    updateSupportShift,
    cancelSupportShift,
    getSupportShiftsForStore,
    getSupportShiftsByUser,
    validateSupportRequest
  };
};
