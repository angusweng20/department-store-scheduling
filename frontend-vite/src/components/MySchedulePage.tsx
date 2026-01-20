import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import ShiftDetailCard from './ShiftDetailCard';
import { useSupabase } from '../hooks/useSupabase';
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

const MySchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | undefined>();
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequestData | undefined>();
  const [showDetailCard, setShowDetailCard] = useState(false);
  
  // 模擬用戶ID (實際應用中應該從認證系統獲取)
  const mockUserId = 'mock-user-id';
  
  // 使用 Supabase Hook
  const { 
    schedules, 
    leaveRequests, 
    loading, 
    error,
    fetchSchedulesByMonth,
    fetchLeaveRequestsByMonth,
    requestLeave,
    cancelLeave
  } = useSupabase();
  
  // 模擬資料 (當 Supabase 還沒有資料時使用)
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
      user_id: mockUserId, 
      date: '2026-01-10', 
      reason: '家裡有事', 
      status: 'pending', 
      created_at: '2026-01-01T00:00:00Z', 
      updated_at: '2026-01-01T00:00:00Z' 
    },
    { 
      id: '2', 
      user_id: mockUserId, 
      date: '2026-01-25', 
      reason: '身體不適', 
      status: 'approved', 
      created_at: '2026-01-01T00:00:00Z', 
      updated_at: '2026-01-01T00:00:00Z' 
    }
  ];
  
  // 獲取當前月份的數據
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    
    // 當 Supabase 設置完成時，使用真實數據
    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchSchedulesByMonth(mockUserId, year, month);
      fetchLeaveRequestsByMonth(mockUserId, year, month);
    }
  }, [fetchSchedulesByMonth, fetchLeaveRequestsByMonth]);
  
  // 轉換 Supabase 數據格式為組件所需格式
  const convertSchedules = (supabaseSchedules: any[]): ScheduleData[] => {
    return supabaseSchedules.map(schedule => ({
      date: schedule.shift_date,
      type: schedule.shift_type,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      shiftName: schedule.shift_name,
      colleagues: [] // 可以根據需要添加同事資訊
    }));
  };
  
  // 轉換 Supabase 劃假數據格式
  const convertLeaveRequests = (supabaseLeaveRequests: any[]): LeaveRequestData[] => {
    return supabaseLeaveRequests.map(request => ({
      id: request.id,
      user_id: request.user_id,
      date: request.date,
      reason: request.reason,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at
    }));
  };
  
  // 使用真實數據或模擬數據
  const displaySchedules = schedules.length > 0 ? convertSchedules(schedules) : mockSchedules;
  const displayLeaveRequests = leaveRequests.length > 0 ? convertLeaveRequests(leaveRequests) : mockLeaveRequests;
  
  const handleDateClick = (date: Date, schedule?: ScheduleData, leaveRequest?: LeaveRequestData) => {
    setSelectedDate(date);
    setSelectedSchedule(schedule);
    setSelectedLeaveRequest(leaveRequest);
    setShowDetailCard(true);
  };
  
  const handleCloseDetail = () => {
    setShowDetailCard(false);
    setSelectedDate(null);
    setSelectedSchedule(undefined);
    setSelectedLeaveRequest(undefined);
  };
  
  const handleRequestLeave = async (date: Date, reason?: string) => {
    try {
      await requestLeave(date, reason);
      // 重新獲取當前月份的劃假數據
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      await fetchLeaveRequestsByMonth(mockUserId, year, month);
    } catch (error) {
      console.error('申請劃假失敗:', error);
      throw error;
    }
  };
  
  const handleCancelLeave = async (leaveRequestId: string) => {
    try {
      await cancelLeave(leaveRequestId);
      // 重新獲取當前月份的劃假數據
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      await fetchLeaveRequestsByMonth(mockUserId, year, month);
    } catch (error) {
      console.error('取消劃假失敗:', error);
      throw error;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <p className="text-red-600 mb-2">載入失敗</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">我的班表</h1>
        
        <Calendar 
          schedules={displaySchedules} 
          leaveRequests={displayLeaveRequests}
          onDateClick={handleDateClick}
        />
        
        {/* 圖例說明 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">班次圖例</h3>
          <div className="flex justify-around mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">早班</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">晚班</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">全班</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <h3 className="text-sm font-medium text-gray-700 mb-3">劃假狀態</h3>
            <div className="flex justify-around">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs text-white">🚫</span>
                </div>
                <span className="text-sm text-gray-600">劃假</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 統計資訊 */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">本月統計</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{displaySchedules.length}</p>
              <p className="text-sm text-gray-600">排班天數</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{displayLeaveRequests.length}</p>
              <p className="text-sm text-gray-600">劃假天數</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 詳情卡片 */}
      {showDetailCard && selectedDate && (
        <ShiftDetailCard
          date={selectedDate}
          schedule={selectedSchedule}
          leaveRequest={selectedLeaveRequest}
          onClose={handleCloseDetail}
          onRequestLeave={handleRequestLeave}
          onCancelLeave={handleCancelLeave}
        />
      )}
    </div>
  );
};

export default MySchedulePage;
