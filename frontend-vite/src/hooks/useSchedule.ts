import { useState, useEffect } from 'react';
import { useLiff } from '../context/LiffContext';

interface Shift {
  id: string;
  user_id: string;
  date: string;
  shift_type: 'morning' | 'evening' | 'full';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface LeaveRequest {
  id: string;
  user_id: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  created_at: string;
  updated_at: string;
}

interface UseScheduleReturn {
  shifts: Shift[];
  requests: LeaveRequest[];
  loading: boolean;
  error: string | null;
  toggleLeaveRequest: (date: Date) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useSchedule = (currentMonth: Date): UseScheduleReturn => {
  const { profile } = useLiff();
  const userId = profile?.userId || 'mock-user-id';
  
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockShifts: Shift[] = [
    {
      id: '1',
      user_id: userId,
      date: '2026-01-05',
      shift_type: 'morning',
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: userId,
      date: '2026-01-06',
      shift_type: 'evening',
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '3',
      user_id: userId,
      date: '2026-01-07',
      shift_type: 'full',
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '4',
      user_id: userId,
      date: '2026-01-12',
      shift_type: 'morning',
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '5',
      user_id: userId,
      date: '2026-01-15',
      shift_type: 'evening',
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '6',
      user_id: userId,
      date: '2026-01-20',
      shift_type: 'full',
      is_published: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    }
  ];

  const mockRequests: LeaveRequest[] = [
    {
      id: '1',
      user_id: userId,
      date: '2026-01-10',
      status: 'pending',
      reason: '家裡有事',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: userId,
      date: '2026-01-25',
      status: 'approved',
      reason: '身體不適',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    }
  ];

  // Fetch data for current month
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;

      // For now, use mock data
      // TODO: Replace with actual Supabase calls
      console.log(`Fetching data for ${userId} - ${year}-${month}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShifts(mockShifts);
      setRequests(mockRequests);
      
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Toggle leave request with optimistic UI
  const toggleLeaveRequest = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if there's already a request for this date
    const existingRequest = requests.find(req => req.date === dateStr);
    
    // Optimistic UI update
    if (existingRequest) {
      // Remove request (cancel leave)
      setRequests(prev => prev.filter(req => req.id !== existingRequest.id));
      console.log(`🗑️ Optimistic: Cancelled leave request for ${dateStr}`);
    } else {
      // Add new request (request leave)
      const newRequest: LeaveRequest = {
        id: Date.now().toString(),
        user_id: userId,
        date: dateStr,
        status: 'pending',
        reason: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setRequests(prev => [...prev, newRequest]);
      console.log(`✅ Optimistic: Added leave request for ${dateStr}`);
    }

    try {
      // TODO: Replace with actual Supabase call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For now, the optimistic update is enough
      // In production, you would sync with the server here
      
    } catch (err) {
      console.error('Error toggling leave request:', err);
      
      // Revert optimistic update on error
      if (existingRequest) {
        setRequests(prev => [...prev, existingRequest]);
      } else {
        setRequests(prev => prev.filter(req => req.date !== dateStr));
      }
      
      setError(err instanceof Error ? err.message : 'Failed to toggle leave request');
    }
  };

  // Refetch data
  const refetch = async () => {
    await fetchData();
  };

  // Fetch data when month changes
  useEffect(() => {
    fetchData();
  }, [currentMonth, userId]);

  return {
    shifts,
    requests,
    loading,
    error,
    toggleLeaveRequest,
    refetch
  };
};
