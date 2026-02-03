import { createClient } from '@supabase/supabase-js';

// 獲取環境變數並清理格式
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.error(`❌ 環境變數 ${key} 未設置`);
    return '';
  }
  // 清理可能的空格和換行符
  return value.trim();
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// 驗證 URL 格式
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
};

// 驗證 Key 格式 (JWT token 應該有 3 個部分)
const isValidKey = (key: string): boolean => {
  if (!key) return false;
  const parts = key.split('.');
  return parts.length === 3;
};

// 詳細的錯誤日誌
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  console.error('❌ 無效的 Supabase URL:', supabaseUrl);
  console.error('📋 正確格式應該是: https://your-project-id.supabase.co');
}

if (!supabaseAnonKey || !isValidKey(supabaseAnonKey)) {
  console.error('❌ 無效的 Supabase Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '未設置');
  console.error('📋 正確格式應該是 JWT token (3 個部分，用 . 分隔)');
}

// 只有在兩者都有效時才創建客戶端
export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 導出驗證函數供其他組件使用
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// 型別定義
export interface Database {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string;
          employee_id: string;
          name: string;
          brand_id: string;
          phone: string | null;
          email: string | null;
          monthly_available_hours: number;
          min_rest_days_per_month: number;
          is_active: boolean;
          line_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          name: string;
          brand_id: string;
          phone?: string | null;
          email?: string | null;
          monthly_available_hours?: number;
          min_rest_days_per_month?: number;
          is_active?: boolean;
          line_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          name?: string;
          brand_id?: string;
          phone?: string | null;
          email?: string | null;
          monthly_available_hours?: number;
          min_rest_days_per_month?: number;
          is_active?: boolean;
          line_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          staff_id: string;
          shift_type_id: string;
          schedule_date: string;
          status: string;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          shift_type_id: string;
          schedule_date: string;
          status?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          staff_id?: string;
          shift_type_id?: string;
          schedule_date?: string;
          status?: string;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leave_requests: {
        Row: {
          id: string;
          staff_id: string;
          leave_type: string;
          start_date: string;
          end_date: string;
          reason: string;
          status: string;
          created_at: string;
          approved_by: string | null;
          approved_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          leave_type: string;
          start_date: string;
          end_date: string;
          reason: string;
          status?: string;
          created_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          staff_id?: string;
          leave_type?: string;
          start_date?: string;
          end_date?: string;
          reason?: string;
          status?: string;
          created_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Functions: {
      [key: string]: any;
    };
  };
}
