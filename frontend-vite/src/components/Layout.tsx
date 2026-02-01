import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLiff } from '../context/LiffContext';
import { usePermission } from '../context/PermissionContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, logout } = useLiff();
  const { hasPermission } = usePermission();

  // 當路由變化時關閉手機選單
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { path: '/', label: '儀表板', icon: '📊', permission: null },
    { path: '/schedules', label: '排班管理', icon: '📅', permission: 'manage_store_schedule' },
    { path: '/leave-requests', label: '請假申請', icon: '📝', permission: 'approve_staff_leave' },
    { path: '/staff', label: '員工管理', icon: '👥', permission: 'manage_stores' },
    { path: '/my-schedule', label: '我的班表', icon: '👤', permission: 'view_own_schedule' },
    { path: '/cross-store-support', label: '跨店支援', icon: '🔄', permission: 'manage_store_schedule' },
    { path: '/work-hours-report', label: '工時報表', icon: '📊', permission: 'view_area_stats' },
    { path: '/profile', label: '個人資料', icon: '👤', permission: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                百貨排班系統
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation
                .filter(item => !item.permission || hasPermission(item.permission))
                .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(item.path)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {profile && (
                <div className="flex items-center space-x-3">
                  <img
                    src={profile.pictureUrl || 'https://via.placeholder.com/32'}
                    alt={profile.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {profile.displayName}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    登出
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-2 space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                儀表板
              </Link>
              <Link 
                to="/my-schedule" 
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/my-schedule') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                我的班表
              </Link>
              <Link 
                to="/schedules" 
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/schedules') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                排班管理
              </Link>
              <Link 
                to="/leave-requests" 
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/leave-requests') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                請假申請
              </Link>
              <Link 
                to="/staff" 
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/staff') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                員工管理
              </Link>
              <Link 
                to="/profile" 
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                個人資料
              </Link>
              
              {/* Mobile User Menu */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                {profile && (
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <img
                      src={profile.pictureUrl || 'https://via.placeholder.com/32'}
                      alt={profile.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">{profile.displayName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            © 2026 百貨櫃姐排班系統. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
