import React from 'react';
import { Link } from 'react-router-dom';
import { useStaff, useSchedules, useLeaveRequests } from '../hooks/useApi';

const Dashboard: React.FC = () => {
  const { data: staff, loading: staffLoading, error: staffError } = useStaff();
  const { data: schedules, loading: schedulesLoading, error: schedulesError } = useSchedules();
  const { data: leaveRequests, loading: leaveRequestsLoading, error: leaveRequestsError } = useLeaveRequests();

  // 計算統計數據
  const stats = {
    totalStaff: staff?.length || 0,
    todaySchedules: schedules?.filter(s => s.schedule_date === new Date().toISOString().split('T')[0]).length || 0,
    pendingLeaves: leaveRequests?.filter(l => l.status === 'pending').length || 0,
    conflicts: 0, // 後續可以實現衝突檢測邏輯
  };

  // 獲取今日排班
  const todaySchedules = schedules?.filter(s => s.schedule_date === new Date().toISOString().split('T')[0]) || [];

  // 獲取最近請假申請
  const recentLeaves = leaveRequests?.slice(0, 2) || [];

  // 載入狀態
  const isLoading = staffLoading || schedulesLoading || leaveRequestsLoading;

  // 錯誤狀態
  const hasError = staffError || schedulesError || leaveRequestsError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-gray-500">載入中...</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-red-500">載入失敗: {staffError || schedulesError || leaveRequestsError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">儀表板</h1>
          <p className="text-gray-600 mt-1">歡迎回來！這是您的排班系統概覽</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/schedules" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ 新增排班
          </Link>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
            📥 匯入資料
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">員工總數</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStaff}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今日排班</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todaySchedules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">待審請假</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">排班衝突</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conflicts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">今日排班</h2>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('zh-TW')}</span>
          </div>
          <div className="space-y-3">
            {todaySchedules.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                今日沒有排班
              </div>
            ) : (
              todaySchedules.map((schedule) => {
                const staffMember = staff?.find(s => s.id === schedule.staff_id);
                return (
                  <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {staffMember?.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staffMember?.name || '未知員工'}</p>
                        <p className="text-sm text-gray-600">{schedule.shift_type_id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{schedule.schedule_date}</p>
                      <p className="text-xs text-green-600">✓ 正常</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近請假申請</h2>
            <Link 
              to="/leave-requests" 
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {recentLeaves.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                沒有請假申請
              </div>
            ) : (
              recentLeaves.map((leave) => {
                const staffMember = staff?.find(s => s.id === leave.staff_id);
                return (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium">
                        {staffMember?.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staffMember?.name || '未知員工'}</p>
                        <p className="text-sm text-gray-600">{leave.leave_type} - {leave.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{leave.start_date}</p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        leave.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : leave.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {leave.status === 'pending' ? '待審核' : leave.status === 'approved' ? '已批准' : '已拒絕'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/schedules" 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors block"
          >
            <span className="text-2xl mb-2 block">📅</span>
            <p className="font-medium text-gray-900">建立排班</p>
            <p className="text-sm text-gray-600">為員工安排班次</p>
          </Link>
          <Link 
            to="/leave-requests" 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors block"
          >
            <span className="text-2xl mb-2 block">📝</span>
            <p className="font-medium text-gray-900">審核請假</p>
            <p className="text-sm text-gray-600">處理請假申請</p>
          </Link>
          <Link 
            to="/my-schedule" 
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors block"
          >
            <span className="text-2xl mb-2 block">📊</span>
            <p className="font-medium text-gray-900">我的班表</p>
            <p className="text-sm text-gray-600">查看個人班表</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
