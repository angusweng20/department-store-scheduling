import { useState } from 'react';
import type { Staff } from '../services/api';

interface StaffFormProps {
  staff?: Staff;
  onSave: (staff: Omit<Staff, 'id'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const StaffForm: React.FC<StaffFormProps> = ({ staff, onSave, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState<Omit<Staff, 'id'>>({
    employee_id: staff?.employee_id || '',
    name: staff?.name || '',
    brand_id: staff?.brand_id || 'brand_1',
    phone: staff?.phone || '',
    email: staff?.email || '',
    monthly_available_hours: staff?.monthly_available_hours || 160,
    min_rest_days_per_month: staff?.min_rest_days_per_month || 8,
    is_active: staff?.is_active ?? true,
    line_user_id: staff?.line_user_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {staff ? '編輯員工資料' : '新增員工資料'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
              員工編號 *
            </label>
            <input
              type="text"
              id="employee_id"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請輸入員工編號"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              姓名 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請輸入姓名"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
            品牌 *
          </label>
          <select
            id="brand_id"
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="brand_1">品牌一</option>
            <option value="brand_2">品牌二</option>
            <option value="brand_3">品牌三</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請輸入電話號碼"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              電子郵件
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="請輸入電子郵件"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="monthly_available_hours" className="block text-sm font-medium text-gray-700 mb-1">
              每月可用時數 *
            </label>
            <input
              type="number"
              id="monthly_available_hours"
              name="monthly_available_hours"
              value={formData.monthly_available_hours}
              onChange={handleChange}
              min="0"
              max="300"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="min_rest_days_per_month" className="block text-sm font-medium text-gray-700 mb-1">
              每月最少休息天數 *
            </label>
            <input
              type="number"
              id="min_rest_days_per_month"
              name="min_rest_days_per_month"
              value={formData.min_rest_days_per_month}
              onChange={handleChange}
              min="0"
              max="30"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="line_user_id" className="block text-sm font-medium text-gray-700 mb-1">
            LINE User ID
          </label>
          <input
            type="text"
            id="line_user_id"
            name="line_user_id"
            value={formData.line_user_id}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="請輸入 LINE User ID"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
            在職狀態
          </label>
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
            {isSubmitting ? '提交中...' : (staff ? '更新' : '新增')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;
