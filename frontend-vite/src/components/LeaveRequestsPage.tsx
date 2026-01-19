import { useState, useMemo } from 'react';
import { useLeaveRequests, useStaff } from '../hooks/useApi';
import type { LeaveRequest } from '../services/api';
import apiService from '../services/api';
import LeaveRequestForm from './LeaveRequestForm';
import { SearchFilter, sortData } from './common/SearchFilter';

const LeaveRequestsPage: React.FC = () => {
  const { data: leaveRequests, loading, error, refetch } = useLeaveRequests();
  const { data: staff } = useStaff();
  const [showForm, setShowForm] = useState(false);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState<LeaveRequest | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // 搜尋和過濾狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'created_at', direction: 'desc' });

  // 過濾和排序後的資料
  const filteredLeaveRequests = useMemo(() => {
    let filtered = leaveRequests || [];
    
    // 搜尋過濾 - 包含員工姓名
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((leaveRequest) => {
        const staffMember = staff?.find(s => s.id === leaveRequest.staff_id);
        
        // 搜尋員工姓名
        if (staffMember?.name?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 搜尋員工編號
        if (staffMember?.employee_id?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 搜尋其他欄位
        return ['leave_type', 'status', 'reason'].some((field) => {
          const value = leaveRequest[field as keyof typeof leaveRequest];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
      });
    }
    
    // 條件過濾
    for (const [key, value] of Object.entries(filters)) {
      filtered = filtered.filter(item => item[key as keyof typeof item] === value);
    }
    
    // 排序
    return sortData(filtered, sort);
  }, [leaveRequests, staff, searchQuery, filters, sort]);

  const handleSave = async (leaveRequestData: Omit<LeaveRequest, 'id' | 'created_at' | 'approved_at'>) => {
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      if (editingLeaveRequest) {
        // 更新請假申請
        await apiService.updateLeaveRequest(editingLeaveRequest.id, leaveRequestData);
        console.log('更新請假申請成功:', leaveRequestData);
        setSuccessMessage('請假申請更新成功！');
      } else {
        // 新增請假申請
        await apiService.createLeaveRequest(leaveRequestData);
        console.log('新增請假申請成功:', leaveRequestData);
        setSuccessMessage('請假申請新增成功！');
      }

      setShowForm(false);
      setEditingLeaveRequest(undefined);
      refetch(); // 重新載入資料

      // 3秒後清除成功訊息
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('保存請假申請失敗:', error);
      alert('保存請假申請失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (leaveRequest: LeaveRequest) => {
    setEditingLeaveRequest(leaveRequest);
    setShowForm(true);
  };

  const handleDelete = async (leaveRequestId: string) => {
    if (window.confirm('確定要刪除這個請假申請嗎？')) {
      try {
        await apiService.deleteLeaveRequest(leaveRequestId);
        console.log('刪除請假申請成功:', leaveRequestId);

        refetch(); // 重新載入資料
      } catch (error) {
        console.error('刪除請假申請失敗:', error);
        alert('刪除請假申請失敗，請重試');
      }
    }
  };

  const handleApprove = async (leaveRequestId: string) => {
    try {
      // 先獲取現有的請假資料
      const existingRequest = leaveRequests?.find(lr => lr.id === leaveRequestId);
      if (!existingRequest) {
        throw new Error('找不到請假申請');
      }

      // 更新狀態，保留其他欄位
      const updateData = {
        ...existingRequest,
        status: 'approved' as const,
        approved_by: 'admin',
        approved_at: new Date().toISOString(),
      };

      await apiService.updateLeaveRequest(leaveRequestId, updateData);
      console.log('批准請假申請成功:', leaveRequestId);

      refetch(); // 重新載入資料
    } catch (error) {
      console.error('批准請假申請失敗:', error);
      alert('批准請假申請失敗，請重試');
    }
  };

  const handleReject = async (leaveRequestId: string) => {
    try {
      // 先獲取現有的請假資料
      const existingRequest = leaveRequests?.find(lr => lr.id === leaveRequestId);
      if (!existingRequest) {
        throw new Error('找不到請假申請');
      }

      // 更新狀態，保留其他欄位
      const updateData = {
        ...existingRequest,
        status: 'rejected' as const,
        approved_by: 'admin',
        approved_at: new Date().toISOString(),
      };

      await apiService.updateLeaveRequest(leaveRequestId, updateData);
      console.log('拒絕請假申請成功:', leaveRequestId);

      refetch(); // 重新載入資料
    } catch (error) {
      console.error('拒絕請假申請失敗:', error);
      alert('拒絕請假申請失敗，請重試');
    }
  };

  if (showForm) {
    return (
      <LeaveRequestForm
        leaveRequest={editingLeaveRequest}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingLeaveRequest(undefined);
        }}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">載入失敗: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 成功訊息 */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">請假申請</h1>
          <p className="text-gray-600 mt-1">管理所有請假申請</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ 新增申請
        </button>
      </div>

      {/* 搜尋和過濾 */}
      <SearchFilter
        onSearch={setSearchQuery}
        onFilter={setFilters}
        onSort={setSort}
        searchPlaceholder="搜尋請假申請..."
        filterOptions={[
          { value: 'status', label: '狀態' },
          { value: 'leave_type', label: '請假類型' },
        ]}
        sortOptions={[
          { value: 'created_at', label: '申請時間' },
          { value: 'start_date', label: '開始日期' },
          { value: 'leave_type', label: '請假類型' },
        ]}
      />

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            申請列表 
            <span className="ml-2 text-sm text-gray-500">
              ({filteredLeaveRequests.length} 筆)
            </span>
          </h2>
        </div>
        <div className="space-y-3">
          {filteredLeaveRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery || Object.keys(filters).length > 0 ? '沒有符合條件的請假申請' : '沒有請假申請'}
            </div>
          ) : (
            filteredLeaveRequests.map((leave) => {
              const staffMember = staff?.find(s => s.id === leave.staff_id);
              return (
                <div key={leave.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-medium">
                      {staffMember?.name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{staffMember?.name || '未知員工'}</p>
                      <p className="text-sm text-gray-600">{staffMember?.employee_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{leave.leave_type}</p>
                    <p className="text-sm text-gray-600">{leave.start_date} - {leave.end_date}</p>
                    <p className="text-sm text-gray-500">{leave.reason}</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      leave.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : leave.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {leave.status === 'pending' ? '待審核' : leave.status === 'approved' ? '已批准' : '已拒絕'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(leave)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      編輯
                    </button>
                    {leave.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(leave.id)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          批准
                        </button>
                        <button
                          onClick={() => handleReject(leave.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          拒絕
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(leave.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestsPage;
