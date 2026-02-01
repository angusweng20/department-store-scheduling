import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SchedulesPage from './components/SchedulesPage';
import LeaveRequestsPage from './components/LeaveRequestsPage';
import StaffPage from './components/StaffPage';
import MyScheduleTestPage from './components/MyScheduleTestPage';
import ProfilePage from './components/ProfilePage';
import LiffLoading from './components/LiffLoading';
import { useLiff } from './context/LiffContext';
import { PermissionProvider } from './context/PermissionContext';

function App() {
  const { isLoading, isLoggedIn, error, login } = useLiff();

  // Show loading screen while LIFF is initializing
  if (isLoading) {
    return <LiffLoading message="正在載入 LINE LIFF..." />;
  }

  // Show error screen if LIFF initialization failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">LIFF 初始化失敗</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={login}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            重新登入
          </button>
        </div>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l3.59-3.59L17 12l-5 5z"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">需要登入</h2>
          <p className="text-gray-600 mb-6">請使用 LINE 帳號登入以繼續使用系統</p>
          <button
            onClick={login}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l3.59-3.59L17 12l-5 5z"/>
            </svg>
            使用 LINE 登入
          </button>
        </div>
      </div>
    );
  }

  // Main app when logged in
  return (
    <PermissionProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/leave-requests" element={<LeaveRequestsPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/my-schedule" element={<MyScheduleTestPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </PermissionProvider>
  );
}

export default App;
