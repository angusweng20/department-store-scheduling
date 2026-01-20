import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths, isFuture } from 'date-fns';
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
  onDateClick: (date: Date) => void;
  toggleLeaveRequest: (date: Date) => Promise<void>;
}

const Calendar: React.FC<CalendarProps> = ({ shifts, requests, onDateClick, toggleLeaveRequest }) => {
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
  };
  
  // 獲取班次顏色
  const getShiftColor = (type: string): string => {
    switch (type) {
      case 'early':
        return 'bg-orange-500';
      case 'late':
        return 'bg-blue-500';
      case 'full':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  // 計算本月累計工時
  const calculateMonthlyHours = (): number => {
    return schedules.reduce((total, schedule) => {
      const start = new Date(`2000-01-01T${schedule.startTime}`);
      const end = new Date(`2000-01-01T${schedule.endTime}`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      
      // 處理跨日情況
      if (diff < 0) diff += 24;
      
      return total + diff;
    }, 0);
  };
  
  // 計算本月劃假天數
  const calculateMonthlyLeaveDays = (): number => {
    return leaveRequests.filter(request => 
      request.status === 'approved' || request.status === 'pending'
    ).length;
  };
  
  const monthlyHours = calculateMonthlyHours();
  const monthlyLeaveDays = calculateMonthlyLeaveDays();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* 月份導航 */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'yyyy年 MMMM', { locale: zhTW })}
          </h2>
          <div className="flex justify-center space-x-4 text-sm text-gray-600">
            <span>工時: {monthlyHours.toFixed(1)}h</span>
            <span>劃假: {monthlyLeaveDays}天</span>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* 星期標題 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* 月曆網格 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 空白天數 */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {/* 月份天數 */}
        {monthDays.map((date) => {
          const schedule = getScheduleForDate(date);
          const leaveRequest = getLeaveRequestForDate(date);
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick(date, schedule, leaveRequest)}
              className={`
                aspect-square flex flex-col items-center justify-center
                rounded-lg border border-gray-200
                transition-all duration-200
                ${isCurrentMonth ? 'hover:bg-gray-50' : 'opacity-40'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                ${leaveRequest ? 'bg-gray-50 border-gray-300' : ''}
                ${schedule || leaveRequest ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className={`
                text-sm font-medium
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isToday ? 'text-blue-600' : ''}
                ${leaveRequest ? 'text-gray-500 line-through' : ''}
              `}>
                {format(date, 'd')}
              </span>
              
              {/* 標記顯示 */}
              <div className="flex items-center space-x-1 mt-1">
                {/* 班次圓點 */}
                {schedule && (
                  <div className={`
                    w-2 h-2 rounded-full
                    ${getShiftColor(schedule.type)}
                  `} />
                )}
                
                {/* 劃假標記 */}
                {leaveRequest && (
                  <div className="w-2 h-2 rounded bg-gray-400 flex items-center justify-center">
                    <span className="text-xs text-white">🚫</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
