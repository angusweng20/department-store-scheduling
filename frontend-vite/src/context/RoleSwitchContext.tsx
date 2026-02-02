import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types/permissions';

interface RoleSwitchContextType {
  currentViewRole: UserRole | null;
  isViewMode: boolean;
  switchToView: (role: UserRole) => void;
  exitViewMode: () => void;
}

const RoleSwitchContext = createContext<RoleSwitchContextType | undefined>(undefined);

interface RoleSwitchProviderProps {
  children: ReactNode;
}

export const RoleSwitchProvider: React.FC<RoleSwitchProviderProps> = ({ children }) => {
  const [currentViewRole, setCurrentViewRole] = useState<UserRole | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const switchToView = (role: UserRole) => {
    setCurrentViewRole(role);
    setIsViewMode(true);
    console.log(`🔍 切換到視角模式: ${role}`);
  };

  const exitViewMode = () => {
    setCurrentViewRole(null);
    setIsViewMode(false);
    console.log('🔍 退出視角模式');
  };

  const value: RoleSwitchContextType = {
    currentViewRole,
    isViewMode,
    switchToView,
    exitViewMode
  };

  return (
    <RoleSwitchContext.Provider value={value}>
      {children}
    </RoleSwitchContext.Provider>
  );
};

export const useRoleSwitch = (): RoleSwitchContextType => {
  const context = useContext(RoleSwitchContext);
  if (context === undefined) {
    throw new Error('useRoleSwitch must be used within a RoleSwitchProvider');
  }
  return context;
};
