import { useState, useEffect } from 'react';
import { usePermission } from '../context/PermissionContext';
import type { ActivityTag } from '../types/permissions';

interface UseActivityTagsReturn {
  activityTags: ActivityTag[];
  loading: boolean;
  error: string | null;
  addActivityTag: (tag: Omit<ActivityTag, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateActivityTag: (id: string, tag: Partial<ActivityTag>) => Promise<void>;
  deleteActivityTag: (id: string) => Promise<void>;
  getTagForDate: (date: string) => ActivityTag | null;
  isLeaveRestricted: (date: string) => boolean;
  getMinStaffRequired: (date: string) => number;
}

export const useActivityTags = (): UseActivityTagsReturn => {
  const { hasPermission } = usePermission();
  const [activityTags, setActivityTags] = useState<ActivityTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock 資料 - 實際應用中應從 API 取得
  const mockActivityTags: ActivityTag[] = [
    {
      id: '1',
      date: '2026-02-14',
      tagName: '情人節活動',
      isLeaveRestricted: true,
      minStaffRequired: 3,
      createdBy: '1',
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-01-15T00:00:00Z'
    },
    {
      id: '2',
      date: '2026-02-28',
      tagName: '週年慶',
      isLeaveRestricted: true,
      minStaffRequired: 5,
      createdBy: '1',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z'
    },
    {
      id: '3',
      date: '2026-03-08',
      tagName: '婦女節活動',
      isLeaveRestricted: false,
      minStaffRequired: 2,
      createdBy: '2',
      createdAt: '2026-01-20T00:00:00Z',
      updatedAt: '2026-01-20T00:00:00Z'
    }
  ];

  // 載入活動標籤
  const fetchActivityTags = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: 從 API 取得資料
      await new Promise(resolve => setTimeout(resolve, 500));

      setActivityTags(mockActivityTags);
      console.log('✅ 活動標籤載入完成:', mockActivityTags.length);
    } catch (err) {
      console.error('❌ 載入活動標籤失敗:', err);
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  };

  // 新增活動標籤
  const addActivityTag = async (tagData: Omit<ActivityTag, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!hasPermission('set_store_activities') && !hasPermission('set_global_rules')) {
      throw new Error('沒有權限設定活動標籤');
    }

    try {
      const newTag: ActivityTag = {
        ...tagData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // TODO: 呼叫 API 新增
      await new Promise(resolve => setTimeout(resolve, 300));

      setActivityTags(prev => [...prev, newTag]);
      console.log('✅ 活動標籤新增成功:', newTag.tagName);
    } catch (err) {
      console.error('❌ 新增活動標籤失敗:', err);
      throw err;
    }
  };

  // 更新活動標籤
  const updateActivityTag = async (id: string, tagData: Partial<ActivityTag>) => {
    if (!hasPermission('set_store_activities') && !hasPermission('set_global_rules')) {
      throw new Error('沒有權限更新活動標籤');
    }

    try {
      // TODO: 呼叫 API 更新
      await new Promise(resolve => setTimeout(resolve, 300));

      setActivityTags(prev => 
        prev.map(tag => 
          tag.id === id 
            ? { ...tag, ...tagData, updatedAt: new Date().toISOString() }
            : tag
        )
      );
      console.log('✅ 活動標籤更新成功:', id);
    } catch (err) {
      console.error('❌ 更新活動標籤失敗:', err);
      throw err;
    }
  };

  // 刪除活動標籤
  const deleteActivityTag = async (id: string) => {
    if (!hasPermission('set_store_activities') && !hasPermission('set_global_rules')) {
      throw new Error('沒有權限刪除活動標籤');
    }

    try {
      // TODO: 呼叫 API 刪除
      await new Promise(resolve => setTimeout(resolve, 300));

      setActivityTags(prev => prev.filter(tag => tag.id !== id));
      console.log('✅ 活動標籤刪除成功:', id);
    } catch (err) {
      console.error('❌ 刪除活動標籤失敗:', err);
      throw err;
    }
  };

  // 取得特定日期的活動標籤
  const getTagForDate = (date: string): ActivityTag | null => {
    return activityTags.find(tag => tag.date === date) || null;
  };

  // 檢查特定日期是否禁止請假
  const isLeaveRestricted = (date: string): boolean => {
    const tag = getTagForDate(date);
    return tag?.isLeaveRestricted || false;
  };

  // 取得特定日期的最低在位人數
  const getMinStaffRequired = (date: string): number => {
    const tag = getTagForDate(date);
    return tag?.minStaffRequired || 0;
  };

  useEffect(() => {
    fetchActivityTags();
  }, []);

  return {
    activityTags,
    loading,
    error,
    addActivityTag,
    updateActivityTag,
    deleteActivityTag,
    getTagForDate,
    isLeaveRestricted,
    getMinStaffRequired
  };
};
