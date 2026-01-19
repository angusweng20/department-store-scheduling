import { useState, useEffect } from 'react';
import { 
  staffService, 
  scheduleService, 
  leaveRequestService, 
  statsService, 
  realtimeService,
  type ScheduleData,
  type LeaveRequestData,
  type StaffData
} from '../services/supabaseService';

export const useSupabase = (userId?: string) => {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 獲取員工數據
  const fetchStaff = async () => {
    try {
      const data = await staffService.getAllStaff();
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取員工數據失敗');
    }
  };

  // 獲取排班數據
  const fetchSchedules = async (staffId?: string) => {
    try {
      if (staffId) {
        const data = await scheduleService.getSchedulesByStaff(staffId);
        setSchedules(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取排班數據失敗');
    }
  };

  // 獲取劃假數據
  const fetchLeaveRequests = async (userId?: string, startDate?: string, endDate?: string) => {
    try {
      if (userId) {
        const data = await leaveRequestService.getLeaveRequestsByUser(userId, startDate, endDate);
        setLeaveRequests(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取劃假數據失敗');
    }
  };

  // 獲取月份排班
  const fetchSchedulesByMonth = async (staffId: string, year: number, month: number) => {
    try {
      const data = await scheduleService.getSchedulesByMonth(staffId, year, month);
      setSchedules(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取月份排班失敗');
      return [];
    }
  };

  // 獲取月份劃假
  const fetchLeaveRequestsByMonth = async (userId: string, year: number, month: number) => {
    try {
      const data = await leaveRequestService.getLeaveRequestsByMonth(userId, year, month);
      setLeaveRequests(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取月份劃假失敗');
      return [];
    }
  };

  // 切換劃假狀態
  const toggleLeaveRequest = async (date: Date, reason?: string) => {
    if (!userId) throw new Error('用戶ID未提供');
    
    const dateStr = date.toISOString().split('T')[0];
    const existingRequest = leaveRequests.find((req: any) => req.date === dateStr);
    
    try {
      if (existingRequest) {
        // 取消劃假
        await leaveRequestService.cancelLeaveRequest(existingRequest.id);
        setLeaveRequests((prev: any) => prev.filter((req: any) => req.id !== existingRequest.id));
        return { action: 'cancelled', request: existingRequest };
      } else {
        // 申請劃假
        const newRequest = await leaveRequestService.createLeaveRequest({
          user_id: userId,
          date: dateStr,
          reason: reason || undefined,
          status: 'pending'
        });
        setLeaveRequests((prev: any) => [...prev, newRequest]);
        return { action: 'created', request: newRequest };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '劃假操作失敗');
      throw err;
    }
  };

  // 申請劃假
  const requestLeave = async (date: Date, reason?: string) => {
    if (!userId) throw new Error('用戶ID未提供');
    
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const newRequest = await leaveRequestService.createLeaveRequest({
        user_id: userId,
        date: dateStr,
        reason: reason || undefined,
        status: 'pending'
      });
      setLeaveRequests((prev: any) => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : '申請劃假失敗');
      throw err;
    }
  };

  // 取消劃假
  const cancelLeave = async (leaveRequestId: string) => {
    try {
      await leaveRequestService.cancelLeaveRequest(leaveRequestId);
      setLeaveRequests((prev: any) => prev.filter((req: any) => req.id !== leaveRequestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '取消劃假失敗');
      throw err;
    }
  };

  // 獲取統計數據
  const getStats = async (staffId?: string) => {
    try {
      if (staffId) {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        return await statsService.getScheduleStats(staffId, currentYear, currentMonth);
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取統計數據失敗');
      return null;
    }
  };

  // 初始化數據
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await fetchStaff();
        
        if (userId) {
          await fetchSchedules(userId);
          await fetchLeaveRequests(userId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '初始化數據失敗');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [userId]);

  // 設置即時監聽
  useEffect(() => {
    // 訂閱員工變更
    const staffSubscription = realtimeService.subscribeToStaff((payload: any) => {
      console.log('Staff change:', payload);
      fetchStaff();
    });

    // 訂閱排班變更
    const schedulesSubscription = realtimeService.subscribeToSchedules((payload: any) => {
      console.log('Schedule change:', payload);
      if (userId) {
        fetchSchedules(userId);
      }
    });

    // 訂閱劃假變更
    const leaveRequestsSubscription = realtimeService.subscribeToLeaveRequests((payload: any) => {
      console.log('Leave request change:', payload);
      if (userId) {
        fetchLeaveRequests(userId);
      }
    });

    // 清理訂閱
    return () => {
      staffSubscription.unsubscribe();
      schedulesSubscription.unsubscribe();
      leaveRequestsSubscription.unsubscribe();
    };
  }, [userId]);

  return {
    // 數據
    staff,
    schedules,
    leaveRequests,
    loading,
    error,
    
    // 方法
    fetchStaff,
    fetchSchedules,
    fetchLeaveRequests,
    fetchSchedulesByMonth,
    fetchLeaveRequestsByMonth,
    toggleLeaveRequest,
    requestLeave,
    cancelLeave,
    getStats,
    
    // 工具方法
    refetch: async () => {
      setLoading(true);
      setError(null);
      
      try {
        await fetchStaff();
        if (userId) {
          await fetchSchedules(userId);
          await fetchLeaveRequests(userId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '重新獲取數據失敗');
      } finally {
        setLoading(false);
      }
    },
    
    clearError: () => setError(null)
  };
};

  // 獲取劃假數據
  const fetchLeaveRequests = async (userId?: string, startDate?: string, endDate?: string) => {
    try {
      if (userId) {
        const data = await leaveRequestService.getLeaveRequestsByUser(userId, startDate, endDate);
        setLeaveRequests(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取劃假數據失敗');
    }
  };

  // 獲取月份排班
  const fetchSchedulesByMonth = async (staffId: string, year: number, month: number) => {
    try {
      const data = await scheduleService.getSchedulesByMonth(staffId, year, month);
      setSchedules(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取月份排班失敗');
      return [];
    }
  };

  // 獲取月份劃假
  const fetchLeaveRequestsByMonth = async (userId: string, year: number, month: number) => {
    try {
      const data = await leaveRequestService.getLeaveRequestsByMonth(userId, year, month);
      setLeaveRequests(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取月份劃假失敗');
      return [];
    }
  };
