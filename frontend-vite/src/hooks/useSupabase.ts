import { useState, useEffect } from 'react';
import { staffService, scheduleService, leaveRequestService, statsService, realtimeService } from '../services/supabaseService';
import type { Database } from '../utils/supabase';

type Staff = Database['public']['Tables']['staff']['Row'];
type Schedule = Database['public']['Tables']['schedules']['Row'];
type LeaveRequest = Database['public']['Tables']['leave_requests']['Row'];

// 員工 Hook
export const useStaff = () => {
  const [data, setData] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const staffData = await staffService.getAllStaff();
      setData(staffData);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('載入員工資料失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};

// 排班 Hook
export const useSchedules = () => {
  const [data, setData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const scheduleData = await scheduleService.getAllSchedules();
      setData(scheduleData);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('載入排班資料失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};

// 請假申請 Hook
export const useLeaveRequests = () => {
  const [data, setData] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const leaveRequestData = await leaveRequestService.getAllLeaveRequests();
      setData(leaveRequestData);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('載入請假申請失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};

// 統計 Hook
export const useStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await statsService.getStats();
      setData(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('載入統計資料失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, error, refetch };
};

// 實時訂閱 Hook
export const useRealtime = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 訂閱所有表的變更
    const staffSubscription = realtimeService.subscribeToStaff((payload: any) => {
      console.log('Staff change:', payload);
      // 可以在這裡觸發其他組件更新
    });

    const schedulesSubscription = realtimeService.subscribeToSchedules((payload: any) => {
      console.log('Schedule change:', payload);
      // 可以在這裡觸發其他組件更新
    });

    const leaveRequestsSubscription = realtimeService.subscribeToLeaveRequests((payload: any) => {
      console.log('Leave request change:', payload);
      // 可以在這裡觸發其他組件更新
    });

    setIsConnected(true);

    // 清理訂閱
    return () => {
      staffSubscription.unsubscribe();
      schedulesSubscription.unsubscribe();
      leaveRequestsSubscription.unsubscribe();
    };
  }, []);

  return { isConnected };
};
