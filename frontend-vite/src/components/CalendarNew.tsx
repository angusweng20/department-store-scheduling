import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isFuture } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface Shift {
  id: string;
  user_id: string;
  date: string;
  shift_type: 'morning' | 'evening' | 'full';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface LeaveRequest {
  id: string;
  user_id: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  created_at: string;
  updated_at: string;
}

interface CalendarProps {
  shifts: Shift[];
  requests: LeaveRequest[];
  toggleLeaveRequest: (date: Date) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({ shifts, requests, toggleLeaveRequest }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // 計算月份開始前的空白天數
  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);
  
  // 獲取指定日期的班表
  const getShiftForDate = (date: Date): Shift | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return shifts.find(shift => shift.date === dateStr);
  };
  
  // 獲取指定日期的劃假
  const getLeaveRequestForDate = (date: Date): LeaveRequest | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return requests.find(request => request.date === dateStr);
  };
  
  // 獲取班次顏色
  const getShiftColor = (type: string): string => {
    switch (type) {
      case 'morning':
        return 'bg-orange-500';
      case 'evening':
        return 'bg-blue-500';
      case 'full':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // 獲取班次名稱
  const getShiftName = (type: string): string => {
    switch (type) {
      case 'morning':
        return '早班';
      case 'evening':
        return '晚班';
      case 'full':
        return '全日班';
      default:
        return '未知';
    }
  };
  
  // 處理日期點擊
  const handleDateClick = async (date: Date) => {
    // 只允許對未來日期進行劃假操作
    if (isFuture(date)) {
      await toggleLeaveRequest(date);
    }
  };
  
  // 計算統計資訊
  const monthlyHours = shifts.reduce((total, shift) => {
    const hours = shift.shift_type === 'full' ? 12 : 8;
    return total + hours;
  }, 0);
  
  const monthlyLeaveDays = requests.filter(req => req.status !== 'rejected').length;
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* 月份標題 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentMonth, 'yyyy年MM月', { locale: zhTW })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* 星期標題 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期網格 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 空白天數 */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-20"></div>
        ))}
        
        {/* 月份天數 */}
        {monthDays.map(date => {
          const shift = getShiftForDate(date);
          const leaveRequest = getLeaveRequestForDate(date);
          const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
          const isFutureDate = isFuture(date);
          
          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`
                h-20 border rounded-lg p-2 relative cursor-pointer transition-all
                ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${isFutureDate ? 'hover:bg-gray-50' : 'bg-gray-50'}
                ${leaveRequest ? 'bg-red-50 border-red-200' : ''}
              `}
            >
              {/* 日期號碼 */}
              <div className="text-sm font-medium text-gray-700">
                {format(date, 'd')}
              </div>
              
              {/* 班表指示器 */}
              {shift && (
                <div className="mt-1">
                  <div className={`w-2 h-2 rounded-full ${getShiftColor(shift.shift_type)}`}></div>
                  <div className="text-xs text-gray-600 mt-1">
                    {getShiftName(shift.shift_type)}
                  </div>
                </div>
              )}
              
              {/* 劃假指示器 */}
              {leaveRequest && (
                <div className="absolute top-1 right-1">
                  <span className="text-red-500 text-sm">🚫</span>
                </div>
              )}
              
              {/* 未來日期可點擊提示 */}
              {isFutureDate && !shift && !leaveRequest && (
                <div className="absolute bottom-1 right-1">
                  <div className="w-2 h-2 border-2 border-gray-300 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 圖例 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600">早班</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">晚班</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">全日班</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-500">🚫</span>
            <span className="text-gray-600">劃假</span>
          </div>
        </div>
      </div>
      
      {/* 統計資訊 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <div className="text-gray-600">
            本月工時: <span className="font-semibold text-gray-800">{monthlyHours}小時</span>
          </div>
          <div className="text-gray-600">
            劃假天數: <span className="font-semibold text-gray-800">{monthlyLeaveDays}天</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
