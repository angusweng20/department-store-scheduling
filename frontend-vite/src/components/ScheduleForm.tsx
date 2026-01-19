import { useState } from 'react';
import type { Schedule } from '../services/api';
import { useStaff } from '../hooks/useApi';

interface ScheduleFormProps {
  schedule?: Schedule;
  onSave: (schedule: Omit<Schedule, 'id'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, onSave, onCancel, isSubmitting = false }) => {
  const { data: staff } = useStaff();
  const [formData, setFormData] = useState<Omit<Schedule, 'id'>>({
    staff_id: schedule?.staff_id || '',
    shift_type_id: schedule?.shift_type_id || '早班',
    schedule_date: schedule?.schedule_date || new Date().toISOString().split('T')[0],
    status: schedule?.status || 'scheduled',
    notes: schedule?.notes || '',
    created_by: schedule?.created_by || '',
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
        {schedule ? '編輯排班' : '新增排班'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-1">
            員工 *
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
          <label htmlFor="shift_type_id" className="block text-sm font-medium text-gray-700 mb-1">
            班別 *
          </label>
          <select
            id="shift_type_id"
            name="shift_type_id"
            value={formData.shift_type_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="早班">早班</option>
            <option value="中班">中班</option>
            <option value="晚班">晚班</option>
            <option value="大夜班">大夜班</option>
          </select>
        </div>

        <div>
          <label htmlFor="schedule_date" className="block text-sm font-medium text-gray-700 mb-1">
            排班日期 *
          </label>
          <input
            type="date"
            id="schedule_date"
            name="schedule_date"
            value={formData.schedule_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <option value="scheduled">已排班</option>
            <option value="pending">待確認</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            備註
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="請輸入備註資訊..."
          />
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
            {isSubmitting ? '提交中...' : (schedule ? '更新' : '新增')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
