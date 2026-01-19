import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '../utils/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

type Staff = Database['public']['Tables']['staff']['Row'];
type Schedule = Database['public']['Tables']['schedules']['Row'];
type LeaveRequest = Database['public']['Tables']['leave_requests']['Row'];

// 員工服務
export const staffService = {
  // 獲取所有員工
  async getAllStaff(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 獲取特定員工
  async getStaffById(id: string): Promise<Staff | null> {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 創建員工
  async createStaff(staff: Omit<Database['public']['Tables']['staff']['Insert'], 'id'>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .insert([staff])
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新員工
  async updateStaff(id: string, staff: Partial<Database['public']['Tables']['staff']['Update']>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff')
      .update(staff)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除員工
  async deleteStaff(id: string): Promise<void> {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// 排班服務
export const scheduleService = {
  // 獲取所有排班
  async getAllSchedules(): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('schedule_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 獲取特定排班
  async getScheduleById(id: string): Promise<Schedule | null> {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 創建排班
  async createSchedule(schedule: Omit<Database['public']['Tables']['schedules']['Insert'], 'id'>): Promise<Schedule> {
    const { data, error } = await supabase
      .from('schedules')
      .insert([schedule])
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新排班
  async updateSchedule(id: string, schedule: Partial<Database['public']['Tables']['schedules']['Update']>): Promise<Schedule> {
    const { data, error } = await supabase
      .from('schedules')
      .update(schedule)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除排班
  async deleteSchedule(id: string): Promise<void> {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // 獲取員工排班
  async getSchedulesByStaffId(staffId: string): Promise<Schedule[]> {
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('staff_id', staffId)
      .order('schedule_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
};

// 請假申請服務
export const leaveRequestService = {
  // 獲取所有請假申請
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 獲取特定請假申請
  async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 創建請假申請
  async createLeaveRequest(leaveRequest: Omit<Database['public']['Tables']['leave_requests']['Insert'], 'id'>): Promise<LeaveRequest> {
    const { data, error } = await supabase
      .from('leave_requests')
      .insert([leaveRequest])
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新請假申請
  async updateLeaveRequest(id: string, leaveRequest: Partial<Database['public']['Tables']['leave_requests']['Update']>): Promise<LeaveRequest> {
    const { data, error } = await supabase
      .from('leave_requests')
      .update(leaveRequest)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除請假申請
  async deleteLeaveRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('leave_requests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // 獲取員工請假申請
  async getLeaveRequestsByStaffId(staffId: string): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('staff_id', staffId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
};

// 統計服務
export const statsService = {
  // 獲取統計資料
  async getStats() {
    const [staffResult, schedulesResult, leaveRequestsResult] = await Promise.all([
      supabase.from('staff').select('id', { count: 'exact', head: true }),
      supabase.from('schedules').select('id', { count: 'exact', head: true }),
      supabase.from('leave_requests').select('id', { count: 'exact', head: true }),
    ]);

    const today = new Date().toISOString().split('T')[0];
    
    const [todaySchedulesResult, pendingLeavesResult] = await Promise.all([
      supabase.from('schedules').select('id', { count: 'exact', head: true }).eq('schedule_date', today),
      supabase.from('leave_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
      total_staff: staffResult.count || 0,
      total_schedules: schedulesResult.count || 0,
      total_leave_requests: leaveRequestsResult.count || 0,
      today_schedules: todaySchedulesResult.count || 0,
      pending_leaves: pendingLeavesResult.count || 0,
    };
  },
};

// 實時訂閱服務
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

  // 訂閱請假申請變更
  subscribeToLeaveRequests(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('public:leave_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, callback);
  },
};
