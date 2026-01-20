import React, { useState } from 'react';
import CalendarNew from './CalendarNew';
import { useSchedule } from '../hooks/useSchedule';
import { useLiff } from '../context/LiffContext';

const MySchedulePage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { profile } = useLiff();
  
  // 使用新的 useSchedule Hook
  const { 
    shifts, 
    requests, 
    loading, 
    error,
    toggleLeaveRequest,
    refetch
  } = useSchedule(currentMonth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">載入失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 頁面標題 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            我的班表
          </h1>
          <p className="text-gray-600">
            歡迎回來，{profile?.displayName || '測試用戶'}！
          </p>
        </div>

        {/* 月曆 */}
        <CalendarNew
          shifts={shifts}
          requests={requests}
          toggleLeaveRequest={toggleLeaveRequest}
        />

        {/* 操作提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">操作提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 點擊未來日期可以申請劃假</li>
            <li>• 再次點擊已劃假日期可以取消申請</li>
            <li>• 彩色圓點表示您的班次</li>
            <li>• 🚫 圖示表示已申請劃假</li>
          </ul>
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
