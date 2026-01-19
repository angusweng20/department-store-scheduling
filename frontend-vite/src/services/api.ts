import axios from 'axios';

// API 基礎配置
const API_BASE_URL = 'https://department-store-scheduling.onrender.com';

// 創建 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 增加到 30 秒
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 添加回應攔截器
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

// 類型定義
export interface Staff {
  id: string;
  employee_id: string;
  name: string;
  brand_id: string;
  phone?: string;
  email?: string;
  monthly_available_hours: number;
  min_rest_days_per_month: number;
  is_active: boolean;
  line_user_id?: string;
}

export interface Schedule {
  id: string;
  staff_id: string;
  shift_type_id: string;
  schedule_date: string;
  status: string;
  notes?: string;
  created_by?: string;
}

export interface LeaveRequest {
  id: string;
  staff_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// API 函數
export const apiService = {
  // 員工相關
  async getStaff(): Promise<Staff[]> {
    try {
      const response = await api.get('/api/staff');
      return response.data;
    } catch (error) {
      console.error('獲取員工資料失敗:', error);
      throw error;
    }
  },

  async getStaffById(id: string): Promise<Staff> {
    try {
      const response = await api.get(`/api/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error('獲取員工資料失敗:', error);
      throw error;
    }
  },

  async createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
    try {
      const response = await api.post('/api/staff', staff);
      return response.data;
    } catch (error) {
      console.error('建立員工失敗:', error);
      throw error;
    }
  },

  async updateStaff(id: string, staff: Partial<Staff>): Promise<Staff> {
    try {
      const response = await api.put(`/api/staff/${id}`, staff);
      return response.data;
    } catch (error) {
      console.error('更新員工失敗:', error);
      throw error;
    }
  },

  async deleteStaff(id: string): Promise<void> {
    try {
      await api.delete(`/api/staff/${id}`);
    } catch (error) {
      console.error('刪除員工失敗:', error);
      throw error;
    }
  },

  // 排班相關
  async getSchedules(): Promise<Schedule[]> {
    try {
      const response = await api.get('/api/schedules');
      return response.data;
    } catch (error) {
      console.error('獲取排班資料失敗:', error);
      throw error;
    }
  },

  async getScheduleById(id: string): Promise<Schedule> {
    try {
      const response = await api.get(`/api/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('獲取排班資料失敗:', error);
      throw error;
    }
  },

  async createSchedule(schedule: Omit<Schedule, 'id'>): Promise<Schedule> {
    try {
      const response = await api.post('/api/schedules', schedule);
      return response.data;
    } catch (error) {
      console.error('建立排班失敗:', error);
      throw error;
    }
  },

  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
    try {
      const response = await api.put(`/api/schedules/${id}`, schedule);
      return response.data;
    } catch (error) {
      console.error('更新排班失敗:', error);
      throw error;
    }
  },

  async deleteSchedule(id: string): Promise<void> {
    try {
      await api.delete(`/api/schedules/${id}`);
    } catch (error) {
      console.error('刪除排班失敗:', error);
      throw error;
    }
  },

  // 請假相關
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await api.get('/api/leave-requests');
      return response.data;
    } catch (error) {
      console.error('獲取請假申請失敗:', error);
      throw error;
    }
  },

  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    try {
      const response = await api.get(`/api/leave-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error('獲取請假申請失敗:', error);
      throw error;
    }
  },

  async createLeaveRequest(leaveRequest: Omit<LeaveRequest, 'id' | 'created_at'>): Promise<LeaveRequest> {
    try {
      const response = await api.post('/api/leave-requests', leaveRequest);
      return response.data;
    } catch (error) {
      console.error('建立請假申請失敗:', error);
      throw error;
    }
  },

  async updateLeaveRequest(id: string, leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest> {
    try {
      const response = await api.put(`/api/leave-requests/${id}`, leaveRequest);
      return response.data;
    } catch (error) {
      console.error('更新請假申請失敗:', error);
      throw error;
    }
  },

  async deleteLeaveRequest(id: string): Promise<void> {
    try {
      await api.delete(`/api/leave-requests/${id}`);
    } catch (error) {
      console.error('刪除請假申請失敗:', error);
      throw error;
    }
  },

  // 統計相關
  async getStats() {
    try {
      const response = await api.get('/api/stats');
      return response.data;
    } catch (error) {
      console.error('獲取統計資料失敗:', error);
      throw error;
    }
  },

  // 健康檢查
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('健康檢查失敗:', error);
      throw error;
    }
  },
};

export default apiService;
