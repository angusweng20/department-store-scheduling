// 權限等級定義
export const UserRole = {
  SYSTEM_ADMIN: 'system_admin',    // 班班系統營運團隊
  HQ_ADMIN: 'hq_admin',            // 公司管理
  AREA_MANAGER: 'area_manager',    // 地區經理
  STORE_MANAGER: 'store_manager',  // 專櫃櫃長
  FLOOR_MANAGER: 'floor_manager',  // 百貨樓管
  STAFF: 'staff',                 // 專櫃人員
  TESTER: 'tester'                // 測試人員
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// 權限定義
export interface Permission {
  role: UserRole;
  permissions: string[];
}

// 櫃點資訊
export interface Store {
  id: string;
  name: string;
  code: string; // 如：台中拉拉、南港拉拉
  areaId: string; // 所屬地區
  areaName?: string; // 地區名稱
  managerId?: string; // 櫃長ID
  managerName?: string; // 櫃長姓名
  companyId?: string; // 所屬公司ID
  companyName?: string; // 公司名稱
  address?: string; // 地址
  phone?: string; // 電話
  email?: string; // 郵箱
  status?: 'active' | 'inactive'; // 狀態
  employeeCount?: number; // 員工數量
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 地區資訊
export interface Area {
  id: string;
  name: string;
  managerId?: string; // 地區經理ID
  stores: Store[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 用戶擴展資訊
export interface User {
  id: string;
  lineUserId: string; // LINE 用戶ID
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  storeId?: string; // 所屬櫃點
  areaId?: string; // 所屬地區 (僅地區經理以上)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 活動標籤
export interface ActivityTag {
  id: string;
  date: string;
  tagName: string; // 如：週年慶、百貨活動
  isLeaveRestricted: boolean; // 是否禁止請假
  minStaffRequired: number; // 最低在位人數
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 班次擴展
export interface Shift {
  id: string;
  userId: string;
  storeId: string;
  date: string;
  shiftType: 'morning' | 'evening' | 'full';
  startTime: string;
  endTime: string;
  breakTime: number; // 休息時間(小時)
  actualHours: number; // 實際工作時數
  isSupportShift: boolean; // 是否為外派支援
  originalStoreId?: string; // 原屬櫃點 (外派時使用)
  targetStoreId?: string; // 目標櫃點 (外派時使用)
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 請假申請擴展
export interface LeaveRequest {
  id: string;
  userId: string;
  storeId: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverId?: string; // 審核人ID
  approvalLevel: number; // 審核級別
  maxApprovalLevel: number; // 最大審核級別
  createdAt: string;
  updatedAt: string;
}

// 工時統計
export interface WorkHourStats {
  userId: string;
  userName: string;
  storeId: string;
  period: string; // 月份，如：2026-02
  regularHours: number; // 原店工時
  supportHours: number; // 支援工時
  totalHours: number; // 總工時
  supportDetails: {
    targetStoreId: string;
    targetStoreName: string;
    hours: number;
  }[];
}

// 權限檢查函數
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy = {
    [UserRole.SYSTEM_ADMIN]: 7,
    [UserRole.TESTER]: 6,
    [UserRole.HQ_ADMIN]: 5,
    [UserRole.AREA_MANAGER]: 4,
    [UserRole.FLOOR_MANAGER]: 3,
    [UserRole.STORE_MANAGER]: 2,
    [UserRole.STAFF]: 1
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// 權限操作定義
export const PERMISSIONS = {
  // 系統管理員權限 (班班營運團隊)
  SYSTEM_OVERVIEW: 'system_overview',
  SYSTEM_SETTINGS: 'system_settings',
  MANAGE_ALL_COMPANIES: 'manage_all_companies',
  VIEW_ALL_DATA: 'view_all_data',
  SYSTEM_DEBUG: 'system_debug',
  
  // 測試人員權限
  SWITCH_ROLES: 'switch_roles',
  TEST_ALL_FEATURES: 'test_all_features',
  DEBUG_MODE: 'debug_mode',
  
  // 公司管理權限
  MANAGE_STORES: 'manage_stores',
  MANAGE_AREAS: 'manage_areas',
  SET_GLOBAL_RULES: 'set_global_rules',
  ASSIGN_PERMISSIONS: 'assign_permissions',
  
  // 地區經理權限
  VIEW_AREA_STATS: 'view_area_stats',
  APPROVE_CROSS_STORE_LEAVE: 'approve_cross_store_leave',
  
  // 百貨樓管權限
  VIEW_DEPARTMENT_STORES: 'view_department_stores',
  VIEW_STORE_SCHEDULES: 'view_store_schedules',
  VIEW_STORE_STAFF: 'view_store_staff',
  
  // 專櫃櫃長權限
  MANAGE_STORE_SCHEDULE: 'manage_store_schedule',
  APPROVE_STAFF_LEAVE: 'approve_staff_leave',
  SET_STORE_ACTIVITIES: 'set_store_activities',
  
  // 專櫃人員權限
  VIEW_OWN_SCHEDULE: 'view_own_schedule',
  REQUEST_LEAVE: 'request_leave',
  VIEW_OWN_HOURS: 'view_own_hours'
};

// 角色權限映射
export const ROLE_PERMISSIONS = {
  [UserRole.SYSTEM_ADMIN]: [
    PERMISSIONS.SYSTEM_OVERVIEW,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.MANAGE_ALL_COMPANIES,
    PERMISSIONS.VIEW_ALL_DATA,
    PERMISSIONS.SYSTEM_DEBUG,
    PERMISSIONS.MANAGE_STORES,
    PERMISSIONS.MANAGE_AREAS,
    PERMISSIONS.SET_GLOBAL_RULES,
    PERMISSIONS.ASSIGN_PERMISSIONS,
    PERMISSIONS.VIEW_AREA_STATS,
    PERMISSIONS.APPROVE_CROSS_STORE_LEAVE,
    PERMISSIONS.MANAGE_STORE_SCHEDULE,
    PERMISSIONS.APPROVE_STAFF_LEAVE,
    PERMISSIONS.SET_STORE_ACTIVITIES,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ],
  [UserRole.TESTER]: [
    PERMISSIONS.SWITCH_ROLES,
    PERMISSIONS.TEST_ALL_FEATURES,
    PERMISSIONS.DEBUG_MODE,
    PERMISSIONS.MANAGE_STORES,
    PERMISSIONS.MANAGE_AREAS,
    PERMISSIONS.SET_GLOBAL_RULES,
    PERMISSIONS.ASSIGN_PERMISSIONS,
    PERMISSIONS.VIEW_AREA_STATS,
    PERMISSIONS.APPROVE_CROSS_STORE_LEAVE,
    PERMISSIONS.MANAGE_STORE_SCHEDULE,
    PERMISSIONS.APPROVE_STAFF_LEAVE,
    PERMISSIONS.SET_STORE_ACTIVITIES,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ],
  [UserRole.HQ_ADMIN]: [
    PERMISSIONS.MANAGE_STORES,
    PERMISSIONS.MANAGE_AREAS,
    PERMISSIONS.SET_GLOBAL_RULES,
    PERMISSIONS.ASSIGN_PERMISSIONS,
    PERMISSIONS.VIEW_AREA_STATS,
    PERMISSIONS.APPROVE_CROSS_STORE_LEAVE,
    PERMISSIONS.MANAGE_STORE_SCHEDULE,
    PERMISSIONS.APPROVE_STAFF_LEAVE,
    PERMISSIONS.SET_STORE_ACTIVITIES,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ],
  [UserRole.AREA_MANAGER]: [
    PERMISSIONS.VIEW_AREA_STATS,
    PERMISSIONS.APPROVE_CROSS_STORE_LEAVE,
    PERMISSIONS.MANAGE_STORE_SCHEDULE,
    PERMISSIONS.APPROVE_STAFF_LEAVE,
    PERMISSIONS.SET_STORE_ACTIVITIES,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ],
  [UserRole.FLOOR_MANAGER]: [
    PERMISSIONS.VIEW_DEPARTMENT_STORES,
    PERMISSIONS.VIEW_STORE_SCHEDULES,
    PERMISSIONS.VIEW_STORE_STAFF,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ],
  [UserRole.STORE_MANAGER]: [
    PERMISSIONS.MANAGE_STORE_SCHEDULE,
    PERMISSIONS.APPROVE_STAFF_LEAVE,
    PERMISSIONS.SET_STORE_ACTIVITIES,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ],
  [UserRole.STAFF]: [
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_HOURS
  ]
};
