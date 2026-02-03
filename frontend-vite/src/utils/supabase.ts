import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 環境變數未設置');
  console.error('📋 請檢查以下環境變數：');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_ANON_KEY');
  console.error('🔧 請在 Vercel Dashboard 中設置環境變數');
}

// 驗證 URL 格式
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

if (supabaseUrl && !isValidUrl(supabaseUrl)) {
  console.error('❌ 無效的 Supabase URL:', supabaseUrl);
  console.error('📋 正確格式應該是: https://your-project-id.supabase.co');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

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
