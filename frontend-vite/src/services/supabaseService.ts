import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '../utils/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// 類型定義
export interface ScheduleData {
  id: string;
  staff_id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  shift_type: 'early' | 'late' | 'full';
  shift_name: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface LeaveRequestData {
  id: string;
  user_id: string;
  date: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface StaffData {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

// 員工服務
export const staffService = {
  // 獲取所有員工
  async getAllStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as StaffData[];
  },

  // 根據ID獲取員工
  async getStaffById(id: string) {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as StaffData;
  },

  // 創建員工
  async createStaff(staff: Omit<StaffData, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('staff')
      .insert([staff])
      .select()
      .single();
    
    if (error) throw error;
    return data as StaffData;
  },

  // 更新員工
  async updateStaff(id: string, updates: Partial<StaffData>) {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as StaffData;
  },

  // 刪除員工
  async deleteStaff(id: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 排班服務
export const scheduleService = {
  // 獲取員工排班
  async getSchedulesByStaff(staffId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('schedules')
      .select('*')
      .eq('staff_id', staffId);
    
    if (startDate) {
      query = query.gte('shift_date', startDate);
    }
    if (endDate) {
      query = query.lte('shift_date', endDate);
    }
    
    const { data, error } = await query
      .order('shift_date', { ascending: true });
    
    if (error) throw error;
    return data as ScheduleData[];
  },

  // 獲取月份排班
  async getSchedulesByMonth(staffId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    return await this.getSchedulesByStaff(staffId, startDate, endDate);
  },

  // 創建排班
  async createSchedule(schedule: Omit<ScheduleData, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('schedules')
      .insert([schedule])
      .select()
      .single();
    
    if (error) throw error;
    return data as ScheduleData;
  },

  // 更新排班
  async updateSchedule(id: string, updates: Partial<ScheduleData>) {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as ScheduleData;
  },

  // 刪除排班
  async deleteSchedule(id: string) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 劃假服務
export const leaveRequestService = {
  // 獲取用戶劃假
  async getLeaveRequestsByUser(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data as LeaveRequestData[];
  },

  // 獲取月份劃假
  async getLeaveRequestsByMonth(userId: string, year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    
    return await this.getLeaveRequestsByUser(userId, startDate, endDate);
  },

  // 申請劃假
  async createLeaveRequest(leaveRequest: Omit<LeaveRequestData, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('leave_requests')
      .insert([leaveRequest])
      .select()
      .single();
    
    if (error) throw error;
    return data as LeaveRequestData;
  },

  // 取消劃假
  async cancelLeaveRequest(id: string) {
    const { error } = await supabase
      .from('leave_requests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // 更新劃假狀態
  async updateLeaveRequestStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    const { data, error } = await supabase
      .from('leave_requests')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as LeaveRequestData;
  }
};

// 統計服務
export const statsService = {
  // 獲取員工統計
  async getStaffStats() {
    const { data, error } = await supabase
      .from('staff')
      .select('status')
      .then(({ data }) => {
        const stats = data?.reduce((acc, staff) => {
          acc[staff.status] = (acc[staff.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};
        
        return { data: stats, error: null };
      });
    
    if (error) throw error;
    return data;
  },

  // 獲取排班統計
  async getScheduleStats(staffId: string, year: number, month: number) {
    const schedules = await scheduleService.getSchedulesByMonth(staffId, year, month);
    const leaveRequests = await leaveRequestService.getLeaveRequestsByMonth(staffId, year, month);
    
    const totalHours = schedules.reduce((total, schedule) => {
      const start = new Date(`2000-01-01T${schedule.start_time}`);
      const end = new Date(`2000-01-01T${schedule.end_time}`);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (diff < 0) diff += 24;
      return total + diff;
    }, 0);
    
    const leaveDays = leaveRequests.filter(request => 
      request.status === 'approved' || request.status === 'pending'
    ).length;
    
    return {
      totalHours,
      leaveDays,
      scheduledDays: schedules.length,
      workingDays: schedules.length + leaveDays
    };
  }
};

// 即時服務
export const realtimeService = {
  // 訂閱員工變更
  subscribeToStaff(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('public:staff')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, callback);
  },

  // 訂閱排班變更
  subscribeToSchedules(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('public:schedules')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, callback);
  },

  // 訂閱劃假變更
  subscribeToLeaveRequests(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('public:leave_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, callback);
  }
};
