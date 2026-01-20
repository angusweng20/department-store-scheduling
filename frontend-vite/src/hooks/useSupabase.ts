import { useState, useEffect } from 'react';
import { useLiff } from '../context/LiffContext';

interface ScheduleData {
  date: string;
  type: 'early' | 'late' | 'full';
  startTime: string;
  endTime: string;
  shiftName: string;
  colleagues?: string[];
}

interface LeaveRequestData {
  id: string;
  user_id: string;
  date: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useSupabase = () => {
  const { profile } = useLiff();
  const userId = profile?.userId || 'mock-user-id';
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 模擬資料
  const mockSchedules: ScheduleData[] = [
    { date: '2026-01-05', type: 'early', startTime: '08:00', endTime: '16:00', shiftName: '早班A', colleagues: ['王小美', '李小明'] },
    { date: '2026-01-06', type: 'late', startTime: '16:00', endTime: '00:00', shiftName: '晚班B', colleagues: ['張小華'] },
    { date: '2026-01-07', type: 'full', startTime: '08:00', endTime: '20:00', shiftName: '全班C', colleagues: ['陳小芳', '劉小強'] },
    { date: '2026-01-12', type: 'early', startTime: '08:00', endTime: '16:00', shiftName: '早班A', colleagues: [] },
    { date: '2026-01-15', type: 'late', startTime: '16:00', endTime: '00:00', shiftName: '晚班B', colleagues: ['黃小美'] },
    { date: '2026-01-20', type: 'full', startTime: '08:00', endTime: '20:00', shiftName: '全班C', colleagues: ['林小華', '吳小明'] },
  ];
  
  const mockLeaveRequests: LeaveRequestData[] = [
    { 
      id: '1', 
      user_id: 'mock-user-id', 
      date: '2026-01-10', 
      reason: '家裡有事', 
      status: 'pending', 
      created_at: '2026-01-01T00:00:00Z', 
      updated_at: '2026-01-01T00:00:00Z' 
    },
    { 
      id: '2', 
      user_id: 'mock-user-id', 
      date: '2026-01-25', 
      reason: '身體不適', 
      status: 'approved', 
      created_at: '2026-01-01T00:00:00Z', 
      updated_at: '2026-01-01T00:00:00Z' 
    }
  ];

  // 模擬 API 調用
  const fetchSchedulesByMonth = async (staffId: string, year: number, month: number): Promise<ScheduleData[]> => {
    console.log(`Fetching schedules for ${staffId} in ${year}-${month}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSchedules);
      }, 500);
    });
  };

  const fetchLeaveRequestsByMonth = async (userId: string, year: number, month: number): Promise<LeaveRequestData[]> => {
    console.log(`Fetching leave requests for ${userId} in ${year}-${month}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockLeaveRequests);
      }, 500);
    });
  };

  const requestLeave = async (date: Date, reason?: string): Promise<LeaveRequestData> => {
    return new Promise((resolve) => {
      const newRequest: LeaveRequestData = {
        id: Date.now().toString(),
        user_id: userId || 'mock-user-id',
        date: date.toISOString().split('T')[0],
        reason: reason || '',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setLeaveRequests(prev => [...prev, newRequest]);
      resolve(newRequest);
    });
  };

  const cancelLeave = async (leaveRequestId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setLeaveRequests(prev => prev.filter(req => req.id !== leaveRequestId));
        resolve();
      }, 300);
    });
  };

  // 初始化
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 使用模擬資料
        setSchedules(mockSchedules);
        setLeaveRequests(mockLeaveRequests);
      } catch (err) {
        setError('初始化數據失敗');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [userId]);

  return {
    schedules,
    leaveRequests,
    loading,
    error,
    fetchSchedulesByMonth,
    fetchLeaveRequestsByMonth,
    requestLeave,
    cancelLeave,
    clearError: () => setError(null)
  };
};
