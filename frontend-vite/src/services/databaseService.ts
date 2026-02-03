import { supabase, isSupabaseConfigured } from '../utils/supabase';

// 型別定義
export interface Department {
  id: string;
  uid: string;
  code: string;
  name: string;
  address: string;
  region: string;
  operating_hours: string;
  floors: string[];
  stores: string[];
  floor_managers: string[];
  contact_person: string;
  contact_phone: string;
  main_phone: string;
  operating_status: string;
  established_date: string;
  monthly_revenue: number;
  total_employees: number;
  parking_spaces: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  uid: string;
  tax_id: string;
  name: string;
  legal_name: string;
  manager_id: string;
  manager_name: string;
  address: string;
  phone: string;
  email: string;
  system_account_id: string;
  stores: string[];
  employees: string[];
  account_status: string;
  business_status: string;
  established_date: string;
  registered_capital: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  uid: string;
  counter_code: string;
  name: string;
  brand_name: string;
  company_id: string;
  company_name: string;
  department_id: string;
  department_name: string;
  location: string;
  type: string;
  area: number;
  floor_manager_id: string;
  floor_manager_name: string;
  staff: string[];
  entry_date: string;
  exit_date: string;
  status: string;
  phone: string;
  email: string;
  monthly_revenue: number;
  employee_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  uid: string;
  name: string;
  phone: string;
  employee_id: string;
  line_user_id: string;
  position: string;
  original_role: string;
  所属单位: string;
  current_store: string;
  management_scope: string[];
  status: string;
  test_mode_enabled: boolean;
  current_simulated_role: string;
  temporary_target: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 百貨管理服務
export const departmentService = {
  // 獲取所有百貨
  async getAll(): Promise<Department[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('departments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 根據ID獲取百貨
  async getById(id: string): Promise<Department | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 創建百貨
  async create(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('departments')
      .insert(department)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新百貨
  async update(id: string, department: Partial<Department>): Promise<Department> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('departments')
      .update(department)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除百貨
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { error } = await supabase!
      .from('departments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 公司管理服務
export const companyService = {
  // 獲取所有公司
  async getAll(): Promise<Company[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 根根據ID獲取公司
  async getById(id: string): Promise<Company | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 創建公司
  async create(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('companies')
      .insert(company)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新公司
  async update(id: string, company: Partial<Company>): Promise<Company> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { data, error } = await supabase!
      .from('companies')
      .update(company)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除公司
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase 未正確配置');
    }
    
    const { error } = await supabase!
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 專櫃管理服務
export const storeService = {
  // 獲取所有專櫃
  async getAll(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 根根據ID獲取專櫃
  async getById(id: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 根據公司ID獲取專櫃
  async getByCompanyId(companyId: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 創建專櫃
  async create(store: Omit<Store, 'id' | 'created_at' | 'updated_at'>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .insert(store)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新專櫃
  async update(id: string, store: Partial<Store>): Promise<Store> {
    const { data, error } = await supabase
      .from('stores')
      .update(store)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除專櫃
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// 人員管理服務
export const userService = {
  // 獲取所有人員
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 根根據ID獲取人員
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 根據LINE ID獲取人員
  async getByLineUserId(lineUserId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('line_user_id', lineUserId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 創建人員
  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 更新人員
  async update(id: string, user: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // 刪除人員
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
