import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ScheduleData {
  date: string;
  type: 'early' | 'late' | 'full';
  startTime: string;
  endTime: string;
  shiftName: string;
  colleagues?: string[];
}

interface CalendarProps {
  schedules: ScheduleData[];
  onDateClick: (date: Date, schedule?: ScheduleData) => void;
}

const Calendar: React.FC<CalendarProps> = ({ schedules, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // 計算月份開始前的空白天數
  const startDayOfWeek = getDay(monthStart);
  const emptyDays = Array(startDayOfWeek).fill(null);
  
  // 獲取指定日期的班表
  const getScheduleForDate = (date: Date): ScheduleData | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return schedules.find(schedule => schedule.date === dateStr);
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
  
  const monthlyHours = calculateMonthlyHours();
  
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
          <p className="text-sm text-gray-600">
            本月累計工時: {monthlyHours.toFixed(1)} 小時
          </p>
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
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick(date, schedule)}
              className={`
                aspect-square flex flex-col items-center justify-center
                rounded-lg border border-gray-200
                transition-all duration-200
                ${isCurrentMonth ? 'hover:bg-gray-50' : 'opacity-40'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                ${schedule ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className={`
                text-sm font-medium
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isToday ? 'text-blue-600' : ''}
              `}>
                {format(date, 'd')}
              </span>
              
              {/* 班次圓點 */}
              {schedule && (
                <div className={`
                  w-2 h-2 rounded-full mt-1
                  ${getShiftColor(schedule.type)}
                `} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
