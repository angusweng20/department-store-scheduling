import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">儀表板</h1>
          <p className="text-gray-600 mt-1">歡迎回來！這是您的排班系統概覽</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-primary">
            ➕ 新增排班
          </button>
          <button className="btn-secondary">
            📥 匯入資料
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">員工總數</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今日排班</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">待審請假</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-danger-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">排班衝突</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">今日排班</h2>
            <span className="text-sm text-gray-500">2026年1月19日</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  張
                </div>
                <div>
                  <p className="font-medium text-gray-900">張小櫃</p>
                  <p className="text-sm text-gray-600">早班</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">09:00 - 17:00</p>
                <p className="text-xs text-success-600">✓ 正常</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center text-white font-medium">
                  李
                </div>
                <div>
                  <p className="font-medium text-gray-900">李小姐</p>
                  <p className="text-sm text-gray-600">晚班</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">13:00 - 21:00</p>
                <p className="text-xs text-success-600">✓ 正常</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近請假申請</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-500 rounded-full flex items-center justify-center text-white font-medium">
                  王
                </div>
                <div>
                  <p className="font-medium text-gray-900">王小美</p>
                  <p className="text-sm text-gray-600">事假 - 1天</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">1月20日</p>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
                  待審核
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center text-white font-medium">
                  陳
                </div>
                <div>
                  <p className="font-medium text-gray-900">陳大華</p>
                  <p className="text-sm text-gray-600">病假 - 2天</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">1月18-19日</p>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                  已批准
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <span className="text-2xl mb-2 block">📅</span>
            <p className="font-medium text-gray-900">建立排班</p>
            <p className="text-sm text-gray-600">為員工安排班次</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <span className="text-2xl mb-2 block">📝</span>
            <p className="font-medium text-gray-900">審核請假</p>
            <p className="text-sm text-gray-600">處理請假申請</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <span className="text-2xl mb-2 block">📊</span>
            <p className="font-medium text-gray-900">查看報表</p>
            <p className="text-sm text-gray-600">分析排班數據</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
