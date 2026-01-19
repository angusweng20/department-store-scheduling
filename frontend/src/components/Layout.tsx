import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                🏬 班班-百貨排班系統
              </h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                儀表板
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                排班管理
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                請假申請
              </a>
              <a href="#" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                員工管理
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                🔔
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">管理員</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            © 2026 百貨櫃姐排班系統. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
