import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserRole, type User, type Store, type Area, hasPermission, ROLE_PERMISSIONS } from '../types/permissions';

interface PermissionContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  userStore: Store | null;
  userArea: Area | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  canAccessRole: (requiredRole: UserRole) => boolean;
  loading: boolean;
  error: string | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

// Mock 資料 - 實際應用中應從 API 取得
const mockUsers: User[] = [
  {
    id: '1',
    lineUserId: 'U1234567890',
    name: '總經理',
    email: 'hq@department-store.com',
    phone: '0912345678',
    role: UserRole.HQ_ADMIN,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: '2',
    lineUserId: 'U2345678901',
    name: '地區經理',
    email: 'area@department-store.com',
    phone: '0923456789',
    role: UserRole.AREA_MANAGER,
    areaId: 'area-1',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: '3',
    lineUserId: 'U3456789012',
    name: '櫃長',
    email: 'manager@department-store.com',
    phone: '0934567890',
    role: UserRole.STORE_MANAGER,
    storeId: 'store-1',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: '4',
    lineUserId: 'U4567890123',
    name: '專櫃人員',
    email: 'staff@department-store.com',
    phone: '0945678901',
    role: UserRole.STAFF,
    storeId: 'store-1',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

const mockStores: Store[] = [
  {
    id: 'store-1',
    name: '台中拉拉',
    code: 'TAICHUNG_LALA',
    areaId: 'area-1',
    managerId: '3',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'store-2',
    name: '南港拉拉',
    code: 'NANGANG_LALA',
    areaId: 'area-1',
    managerId: '5',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

const mockAreas: Area[] = [
  {
    id: 'area-1',
    name: '中部地區',
    managerId: '2',
    stores: mockStores,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userStore, setUserStore] = useState<Store | null>(null);
  const [userArea, setUserArea] = useState<Area | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 根據 LINE 用戶 ID 獲取用戶資訊
  const fetchUserByLineId = async (lineUserId: string): Promise<User | null> => {
    // TODO: 實際應用中應從 API 取得
    return mockUsers.find(user => user.lineUserId === lineUserId) || null;
  };

  // 初始化用戶權限
  const initializeUserPermissions = async (lineUserId: string) => {
    try {
      setLoading(true);
      setError(null);

      const user = await fetchUserByLineId(lineUserId);
      
      if (!user) {
        // 如果找不到用戶，創建預設的專櫃人員帳號
        const defaultUser: User = {
          id: Date.now().toString(),
          lineUserId,
          name: '新用戶',
          email: '',
          phone: '',
          role: UserRole.STAFF,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCurrentUser(defaultUser);
        setUserRole(UserRole.STAFF);
        setPermissions(ROLE_PERMISSIONS[UserRole.STAFF]);
      } else {
        setCurrentUser(user);
        setUserRole(user.role);
        setPermissions(ROLE_PERMISSIONS[user.role]);

        // 設定用戶櫃點
        if (user.storeId) {
          const store = mockStores.find(s => s.id === user.storeId);
          setUserStore(store || null);
        }

        // 設定用戶地區
        if (user.areaId) {
          const area = mockAreas.find(a => a.id === user.areaId);
          setUserArea(area || null);
        }
      }

      console.log('✅ 權限初始化完成:', {
        user: currentUser?.name,
        role: userRole,
        permissions: permissions.length
      });

    } catch (err) {
      console.error('❌ 權限初始化失敗:', err);
      setError(err instanceof Error ? err.message : '權限初始化失敗');
    } finally {
      setLoading(false);
    }
  };

  // 檢查是否有特定權限
  const checkPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  // 檢查是否能存取特定角色權限
  const checkRoleAccess = (requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, requiredRole);
  };

  // 模擬設定當前用戶 (開發用)
  const setCurrentUserForDevelopment = (lineUserId: string) => {
    initializeUserPermissions(lineUserId);
  };

  useEffect(() => {
    // 開發階段預設設定為專櫃人員
    // 實際應用中會從 LIFF Context 獲取用戶資訊
    setCurrentUserForDevelopment('U4567890123'); // 專櫃人員
  }, []);

  const value: PermissionContextType = {
    currentUser,
    userRole,
    userStore,
    userArea,
    permissions,
    hasPermission: checkPermission,
    canAccessRole: checkRoleAccess,
    loading,
    error
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

// 開發用：切換用戶角色的 Hook
export const useDevUserSwitch = () => {
  const context = useContext(PermissionContext);
  
  if (!context) {
    throw new Error('useDevUserSwitch must be used within a PermissionProvider');
  }

  const switchToRole = (role: UserRole) => {
    const userMap = {
      [UserRole.HQ_ADMIN]: 'U1234567890',
      [UserRole.AREA_MANAGER]: 'U2345678901',
      [UserRole.STORE_MANAGER]: 'U3456789012',
      [UserRole.STAFF]: 'U4567890123'
    };
    
    // 這裡需要一個內部方法來重新初始化用戶
    // 暫時使用 console.log 作為開發工具
    console.log(`🔄 切換到角色: ${role} (LINE ID: ${userMap[role]})`);
  };

  return { switchToRole };
};
