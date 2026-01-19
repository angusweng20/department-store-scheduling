import React from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ScheduleData {
  date: string;
  type: 'early' | 'late' | 'full';
  startTime: string;
  endTime: string;
  shiftName: string;
  colleagues?: string[];
}

interface ShiftDetailCardProps {
  date: Date;
  schedule?: ScheduleData;
  onClose: () => void;
}

const ShiftDetailCard: React.FC<ShiftDetailCardProps> = ({ date, schedule, onClose }) => {
  const getShiftTypeName = (type: string): string => {
    switch (type) {
      case 'early':
        return '早班';
      case 'late':
        return '晚班';
      case 'full':
        return '全班';
      default:
        return '未知班次';
    }
  };
  
  const getShiftColor = (type: string): string => {
    switch (type) {
      case 'early':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'late':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl w-full max-w-md animate-slide-up">
        {/* 卡片頭部 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(date, 'M月d日 EEEE', { locale: zhTW })}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 卡片內容 */}
        <div className="p-4">
          {schedule ? (
            <div className="space-y-4">
              {/* 班次類型 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">班次類型</span>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium border
                  ${getShiftColor(schedule.type)}
                `}>
                  {getShiftTypeName(schedule.type)}
                </span>
              </div>
              
              {/* 班次名稱 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">班次名稱</span>
                <span className="text-sm font-medium text-gray-900">
                  {schedule.shiftName}
                </span>
              </div>
              
              {/* 工作時間 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">工作時間</span>
                <span className="text-sm font-medium text-gray-900">
                  {schedule.startTime} - {schedule.endTime}
                </span>
              </div>
              
              {/* 工作時長 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">工作時長</span>
                <span className="text-sm font-medium text-gray-900">
                  {(() => {
                    const start = new Date(`2000-01-01T${schedule.startTime}`);
                    const end = new Date(`2000-01-01T${schedule.endTime}`);
                    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                    if (diff < 0) diff += 24;
                    return `${diff.toFixed(1)} 小時`;
                  })()}
                </span>
              </div>
              
              {/* 搭班同事 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">搭班同事</span>
                </div>
                {schedule.colleagues && schedule.colleagues.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {schedule.colleagues.map((colleague, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1"
                      >
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {colleague.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700">{colleague}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    今日無搭班同事
                  </p>
                )}
              </div>
              
              {/* 操作按鈕 */}
              <div className="flex space-x-3 pt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  申請換班
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                  查看詳情
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">這天沒有排班</p>
              <p className="text-sm text-gray-500">好好休息吧！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftDetailCard;
