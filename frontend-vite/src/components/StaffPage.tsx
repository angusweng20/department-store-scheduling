import { useState } from 'react';
import { useStaff } from '../hooks/useApi';
import type { Staff } from '../services/api';
import apiService from '../services/api';
import StaffForm from './StaffForm';

const StaffPage: React.FC = () => {
  const { data: staff, loading, error, refetch } = useStaff();
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSave = async (staffData: Omit<Staff, 'id'>) => {
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      if (editingStaff) {
        // 更新員工資料
        await apiService.updateStaff(editingStaff.id, staffData);
        console.log('更新員工資料成功:', staffData);
        setSuccessMessage('員工資料更新成功！');
      } else {
        // 新增員工資料
        await apiService.createStaff(staffData);
        console.log('新增員工資料成功:', staffData);
        setSuccessMessage('員工資料新增成功！');
      }
      
      setShowForm(false);
      setEditingStaff(undefined);
      refetch(); // 重新載入資料
      
      // 3秒後清除成功訊息
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('保存員工資料失敗:', error);
      alert('保存員工資料失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setShowForm(true);
  };

  const handleDelete = async (staffId: string) => {
    if (window.confirm('確定要刪除這個員工嗎？')) {
      try {
        await apiService.deleteStaff(staffId);
        console.log('刪除員工資料成功:', staffId);
        
        refetch(); // 重新載入資料
      } catch (error) {
        console.error('刪除員工資料失敗:', error);
        alert('刪除員工資料失敗，請重試');
      }
    }
  };

  const handleToggleStatus = async (staffMember: Staff) => {
    try {
      await apiService.updateStaff(staffMember.id, {
        ...staffMember,
        is_active: !staffMember.is_active,
      });
      console.log('切換員工狀態成功:', staffMember.id);
      
      refetch(); // 重新載入資料
    } catch (error) {
      console.error('切換員工狀態失敗:', error);
      alert('切換員工狀態失敗，請重試');
    }
  };

  if (showForm) {
    return (
      <StaffForm
        staff={editingStaff}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingStaff(undefined);
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
          <h1 className="text-3xl font-bold text-gray-900">員工管理</h1>
          <p className="text-gray-600 mt-1">管理所有員工資料</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ 新增員工
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">員工列表</h2>
        <div className="space-y-3">
          {staff?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              沒有員工資料
            </div>
          ) : (
            staff?.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                    employee.is_active ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {employee.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.employee_id}</p>
                    <p className="text-sm text-gray-500">{employee.brand_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{employee.phone}</p>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                  <p className="text-sm text-gray-500">
                    時數: {employee.monthly_available_hours} | 休息: {employee.min_rest_days_per_month}天
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    employee.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.is_active ? '在職' : '離職'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleToggleStatus(employee)}
                    className={`text-sm ${employee.is_active ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}`}
                  >
                    {employee.is_active ? '停用' : '啟用'}
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
