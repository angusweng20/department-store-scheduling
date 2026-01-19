import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">
                🏬 班班-百貨排班系統
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8">
              <Link 
                to="/" 
                className={`px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                儀表板
              </Link>
              <Link 
                to="/my-schedule" 
                className={`px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/my-schedule') 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                我的班表
              </Link>
              <Link 
                to="/schedules" 
                className={`px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/schedules') 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                排班管理
              </Link>
              <Link 
                to="/leave-requests" 
                className={`px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/leave-requests') 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                請假申請
              </Link>
              <Link 
                to="/staff" 
                className={`px-2 lg:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive('/staff') 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                員工管理
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button className="text-gray-500 hover:text-gray-700 p-1">
                🔔
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                🔔
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">管理員</span>
              </div>
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
              
              {/* Mobile User Menu */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-2 px-3 py-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <span className="text-sm font-medium text-gray-700">管理員</span>
                </div>
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
