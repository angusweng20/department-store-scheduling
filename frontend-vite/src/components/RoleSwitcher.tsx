import React, { useState } from 'react';
import { usePermission } from '../context/PermissionContext';
import { useDevUserSwitch } from '../context/PermissionContext';
import { useRoleSwitch } from '../context/RoleSwitchContext';
import { UserRole } from '../types/permissions';

const RoleSwitcher: React.FC = () => {
  const { userRole, hasPermission } = usePermission();
  const { switchToRole } = useDevUserSwitch();
  const { currentViewRole, isViewMode, switchToView, exitViewMode } = useRoleSwitch();
  const [isOpen, setIsOpen] = useState(false);

  // 只有測試人員和系統管理員可以看到角色切換器
  if (!hasPermission('switch_roles') && !hasPermission('system_debug')) {
    return null;
  }

  const roleOptions = [
    { 
      value: UserRole.SYSTEM_ADMIN, 
      label: '班班營運團隊', 
      description: '全覽所有公司、專櫃、人員狀態',
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      value: UserRole.HQ_ADMIN, 
      label: '公司管理', 
      description: '管理櫃點、設定規則、指派權限',
      color: 'bg-red-100 text-red-800'
    },
    { 
      value: UserRole.AREA_MANAGER, 
      label: '地區經理', 
      description: '跨店監督、高級審核',
      color: 'bg-orange-100 text-orange-800'
    },
    { 
      value: UserRole.STORE_MANAGER, 
      label: '專櫃櫃長', 
      description: '排班管理、請假審核',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      value: UserRole.STAFF, 
      label: '專櫃人員', 
      description: '查看班表、申請請假',
      color: 'bg-green-100 text-green-800'
    }
  ];

  const currentRoleOption = roleOptions.find(option => 
    isViewMode ? option.value === currentViewRole : option.value === userRole
  );

  const handleRoleSwitch = (role: UserRole) => {
    // 如果是超級管理員，提供兩種切換模式
    if (userRole === UserRole.SYSTEM_ADMIN) {
      const mode = window.confirm('選擇切換模式：\n\n確定 → 永久切換角色\n取消 → 僅切換視角（可隨時返回）');
      
      if (mode) {
        // 永久切換角色
        switchToRole(role);
      } else {
        // 僅切換視角
        switchToView(role);
      }
    } else {
      // 其他角色直接切換
      switchToRole(role);
    }
    
    setIsOpen(false);
  };

  const handleExitViewMode = () => {
    exitViewMode();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* 角色切換按鈕 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">
            {currentRoleOption?.label || '未知角色'}
          </span>
          <svg className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 角色選擇下拉選單 */}
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">角色切換</h3>
              <div className="space-y-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRoleSwitch(option.value)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      userRole === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${option.color}`}>
                            {option.label}
                          </span>
                          {userRole === option.value && (
                            <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  💡 提示：切換角色後請重新載入頁面以應用變更
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 當前角色指示器 */}
      {currentRoleOption && (
        <div className="absolute -top-2 -right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentRoleOption.color}`}>
            {currentRoleOption.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcher;
