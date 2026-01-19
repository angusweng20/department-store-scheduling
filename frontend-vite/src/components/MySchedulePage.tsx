import React, { useState } from 'react';
import Calendar from './Calendar';
import ShiftDetailCard from './ShiftDetailCard';

interface ScheduleData {
  date: string;
  type: 'early' | 'late' | 'full';
  startTime: string;
  endTime: string;
  shiftName: string;
  colleagues?: string[];
}

const MySchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  
  // 模擬資料
  const mockSchedules: ScheduleData[] = [
    { date: '2026-01-05', type: 'early', startTime: '08:00', endTime: '16:00', shiftName: '早班A', colleagues: ['王小美', '李小明'] },
    { date: '2026-01-06', type: 'late', startTime: '16:00', endTime: '00:00', shiftName: '晚班B', colleagues: ['張小華'] },
    { date: '2026-01-07', type: 'full', startTime: '08:00', endTime: '20:00', shiftName: '全班C', colleagues: ['陳小芳', '劉小強'] },
    { date: '2026-01-12', type: 'early', startTime: '08:00', endTime: '16:00', shiftName: '早班A', colleagues: [] },
    { date: '2026-01-15', type: 'late', startTime: '16:00', endTime: '00:00', shiftName: '晚班B', colleagues: ['黃小美'] },
    { date: '2026-01-20', type: 'full', startTime: '08:00', endTime: '20:00', shiftName: '全班C', colleagues: ['林小華', '吳小明'] },
  ];
  
  const handleDateClick = (date: Date, schedule?: ScheduleData) => {
    setSelectedDate(date);
    setShowDetailCard(true);
    console.log('Selected date:', date, 'Schedule:', schedule);
  };
  
  const handleCloseDetail = () => {
    setShowDetailCard(false);
    setSelectedDate(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">我的班表</h1>
        
        <Calendar 
          schedules={mockSchedules} 
          onDateClick={handleDateClick}
        />
        
        {/* 圖例說明 */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">班次圖例</h3>
          <div className="flex justify-around">
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
        </div>
      </div>
      
      {/* 詳情卡片 */}
      {showDetailCard && selectedDate && (
        <ShiftDetailCard
          date={selectedDate}
          schedule={mockSchedules.find(s => s.date === selectedDate.toISOString().split('T')[0])}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default MySchedulePage;
