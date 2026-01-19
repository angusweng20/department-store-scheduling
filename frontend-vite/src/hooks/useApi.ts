import { useState, useEffect } from 'react';
import type { Staff, Schedule, LeaveRequest } from '../services/api';
import apiService from '../services/api';

// 通用 API Hook
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const runFetch = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    runFetch();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// 員工 Hook
export function useStaff() {
  return useApi<Staff[]>(() => apiService.getStaff());
}

export function useStaffById(id: string) {
  return useApi<Staff>(() => apiService.getStaffById(id), [id]);
}

// 排班 Hook
export function useSchedules() {
  return useApi<Schedule[]>(() => apiService.getSchedules());
}

export function useScheduleById(id: string) {
  return useApi<Schedule>(() => apiService.getScheduleById(id), [id]);
}

// 請假 Hook
export function useLeaveRequests() {
  return useApi<LeaveRequest[]>(() => apiService.getLeaveRequests());
}

export function useLeaveRequestById(id: string) {
  return useApi<LeaveRequest>(() => apiService.getLeaveRequestById(id), [id]);
}

// 統計 Hook
export function useStats() {
  return useApi(() => apiService.getStats());
}

// 健康檢查 Hook
export function useHealthCheck() {
  return useApi(() => apiService.healthCheck());
}
