import { useState, useMemo } from 'react';
import { useSchedules, useStaff } from '../hooks/useApi';
import type { Schedule } from '../services/api';
import apiService from '../services/api';
import ScheduleForm from './ScheduleForm';
import { SearchFilter, sortData } from './common/SearchFilter';

const SchedulesPage: React.FC = () => {
  const { data: schedules, loading, error, refetch } = useSchedules();
  const { data: staff } = useStaff();
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // 搜尋和過濾狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'schedule_date', direction: 'desc' });

  // 過濾和排序後的資料
  const filteredSchedules = useMemo(() => {
    let filtered = schedules || [];
    
    // 搜尋過濾 - 包含員工姓名
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((schedule) => {
        const staffMember = staff?.find(s => s.id === schedule.staff_id);
        
        // 搜尋員工姓名
        if (staffMember?.name?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 搜尋員工編號
        if (staffMember?.employee_id?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // 搜尋其他欄位
        return ['shift_type_id', 'status', 'notes'].some((field) => {
          const value = schedule[field as keyof typeof schedule];
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
  }, [schedules, staff, searchQuery, filters, sort]);

  const handleSave = async (scheduleData: Omit<Schedule, 'id'>) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      if (editingSchedule) {
        // 更新排班
        await apiService.updateSchedule(editingSchedule.id, scheduleData);
        console.log('更新排班成功:', scheduleData);
        setSuccessMessage('排班更新成功！');
      } else {
        // 新增排班
        await apiService.createSchedule(scheduleData);
        console.log('新增排班成功:', scheduleData);
        setSuccessMessage('排班新增成功！');
      }
      
      setShowForm(false);
      setEditingSchedule(undefined);
      refetch(); // 重新載入資料
      
      // 3秒後清除成功訊息
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('保存排班失敗:', error);
      alert('保存排班失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (window.confirm('確定要刪除這個排班嗎？')) {
      try {
        await apiService.deleteSchedule(scheduleId);
        console.log('刪除排班成功:', scheduleId);
        
        refetch(); // 重新載入資料
      } catch (error) {
        console.error('刪除排班失敗:', error);
        alert('刪除排班失敗，請重試');
      }
    }
  };

  if (showForm) {
    return (
      <ScheduleForm
        schedule={editingSchedule}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingSchedule(undefined);
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
          <h1 className="text-3xl font-bold text-gray-900">排班管理</h1>
          <p className="text-gray-600 mt-1">管理所有員工的排班資料</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ 新增排班
        </button>
      </div>

      {/* 搜尋和過濾 */}
      <SearchFilter
        onSearch={setSearchQuery}
        onFilter={setFilters}
        onSort={setSort}
        searchPlaceholder="搜尋排班..."
        filterOptions={[
          { value: 'status', label: '狀態' },
          { value: 'shift_type_id', label: '班別' },
        ]}
        sortOptions={[
          { value: 'schedule_date', label: '日期' },
          { value: 'created_at', label: '創建時間' },
          { value: 'shift_type_id', label: '班別' },
        ]}
      />

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            排班列表 
            <span className="ml-2 text-sm text-gray-500">
              ({filteredSchedules.length} 筆)
            </span>
          </h2>
        </div>
        <div className="space-y-3">
          {filteredSchedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery || Object.keys(filters).length > 0 ? '沒有符合條件的排班資料' : '沒有排班資料'}
            </div>
          ) : (
            filteredSchedules.map((schedule) => {
              const staffMember = staff?.find(s => s.id === schedule.staff_id);
              return (
                <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {staffMember?.name?.[0] || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{staffMember?.name || '未知員工'}</p>
                      <p className="text-sm text-gray-600">{staffMember?.employee_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{schedule.shift_type_id}</p>
                    <p className="text-sm text-gray-600">{schedule.schedule_date}</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      schedule.status === 'scheduled' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status === 'scheduled' ? '已排班' : '待確認'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDelete(schedule.id)}
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

export default SchedulesPage;
