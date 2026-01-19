import { useState } from 'react';
import type { LeaveRequest } from '../services/api';
import { useStaff } from '../hooks/useApi';

interface LeaveRequestFormProps {
  leaveRequest?: LeaveRequest;
  onSave: (leaveRequest: Omit<LeaveRequest, 'id' | 'created_at' | 'approved_at'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ 
  leaveRequest, 
  onSave, 
  onCancel, 
  isSubmitting = false 
}) => {
  const { data: staff } = useStaff();
  const [formData, setFormData] = useState<Omit<LeaveRequest, 'id' | 'created_at' | 'approved_at'>>({
    staff_id: leaveRequest?.staff_id || '',
    leave_type: leaveRequest?.leave_type || '事假',
    start_date: leaveRequest?.start_date || new Date().toISOString().split('T')[0],
    end_date: leaveRequest?.end_date || new Date().toISOString().split('T')[0],
    reason: leaveRequest?.reason || '',
    status: leaveRequest?.status || 'pending',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {leaveRequest ? '編輯請假申請' : '新增請假申請'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-1">
            申請人 *
          </label>
          <select
            id="staff_id"
            name="staff_id"
            value={formData.staff_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">請選擇員工</option>
            {staff?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({employee.employee_id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
            請假類型 *
          </label>
          <select
            id="leave_type"
            name="leave_type"
            value={formData.leave_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="事假">事假</option>
            <option value="病假">病假</option>
            <option value="年假">年假</option>
            <option value="婚假">婚假</option>
            <option value="喪假">喪假</option>
            <option value="公假">公假</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              開始日期 *
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              結束日期 *
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            請假原因 *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="請輸入請假原因..."
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            狀態
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">待審核</option>
            <option value="approved">已批准</option>
            <option value="rejected">已拒絕</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '提交中...' : (leaveRequest ? '更新' : '新增')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
