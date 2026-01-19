import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SchedulesPage from './components/SchedulesPage';
import LeaveRequestsPage from './components/LeaveRequestsPage';
import StaffPage from './components/StaffPage';
import MyScheduleTestPage from './components/MyScheduleTestPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/leave-requests" element={<LeaveRequestsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/my-schedule" element={<MyScheduleTestPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
