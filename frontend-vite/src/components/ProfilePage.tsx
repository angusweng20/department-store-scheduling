import React from 'react';
import { useLiff } from '../context/LiffContext';

const ProfilePage: React.FC = () => {
  const { profile, logout, isLoggedIn } = useLiff();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">請先登入</h2>
          <p className="text-gray-600">需要登入才能查看個人資料</p>
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
            個人資料
          </h1>
          <p className="text-gray-600">
            管理您的個人資訊和帳號設定
          </p>
        </div>

        {/* 個人資訊卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            {/* 頭像 */}
            <div className="flex-shrink-0">
              <img
                src={profile?.pictureUrl || 'https://via.placeholder.com/150'}
                alt={profile?.displayName || '用戶'}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            
            {/* 基本資訊 */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile?.displayName || '未知用戶'}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>LINE 用戶</span>
                </div>
                {profile?.statusMessage && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{profile.statusMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 詳細資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">帳號資訊</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用戶 ID</label>
                  <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <code className="text-sm text-gray-600">{profile?.userId || 'N/A'}</code>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">顯示名稱</label>
                  <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="text-gray-900">{profile?.displayName || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">系統資訊</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">登入狀態</label>
                  <div className="bg-green-50 px-3 py-2 rounded border border-green-200">
                    <span className="text-green-700">已登入</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最後更新</label>
                  <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <span className="text-gray-900">{new Date().toLocaleString('zh-TW')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">帳號操作</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/my-schedule'}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              查看我的班表
            </button>
            
            <button
              onClick={logout}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              登出帳號
            </button>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">使用提示</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 您的個人資訊來自 LINE 帳號，無法在此頁面修改</li>
            <li>• 如需修改個人資訊，請在 LINE 應用程式中更新</li>
            <li>• 登出後需要重新透 LINE 驗證身份</li>
            <li>• 系統會自動同步您的最新資訊</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
