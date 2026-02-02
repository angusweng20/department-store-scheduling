import React, { useState } from 'react';

interface Store {
  id?: string;
  name: string;
  code: string;
  companyId: string;
  companyName: string;
  areaId: string;
  areaName: string;
  managerId: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  employeeCount: number;
}

interface StoreFormProps {
  store?: Store | null;
  companyId: string;
  companyName: string;
  onSave: (store: Store) => void;
  onCancel: () => void;
}

const StoreForm: React.FC<StoreFormProps> = ({ store, companyId, companyName, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Store>({
    name: store?.name || '',
    code: store?.code || '',
    companyId: companyId,
    companyName: companyName,
    areaId: store?.areaId || '',
    areaName: store?.areaName || '',
    managerId: store?.managerId || '',
    managerName: store?.managerName || '',
    phone: store?.phone || '',
    email: store?.email || '',
    address: store?.address || '',
    status: store?.status || 'active',
    employeeCount: store?.employeeCount || 0
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Store, string>>>({});

  // Mock 地區選項
  const areaOptions = [
    { id: 'area-1', name: '北部地區' },
    { id: 'area-2', name: '中部地區' },
    { id: 'area-3', name: '南部地區' },
    { id: 'area-4', name: '東部地區' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Store, string>> = {};

    if (!formData.name.trim()) newErrors.name = '專櫃名稱為必填';
    if (!formData.code.trim()) newErrors.code = '專櫃代碼為必填';
    if (!formData.areaId) newErrors.areaId = '地區為必填';
    if (!formData.managerName.trim()) newErrors.managerName = '櫃長姓名為必填';
    if (!formData.phone.trim()) newErrors.phone = '電話為必填';
    if (!formData.email.trim()) newErrors.email = 'Email為必填';
    if (!formData.address.trim()) newErrors.address = '地址為必填';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof Store, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAreaChange = (areaId: string) => {
    const area = areaOptions.find(a => a.id === areaId);
    setFormData(prev => ({
      ...prev,
      areaId,
      areaName: area?.name || ''
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            專櫃名稱 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入專櫃名稱"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            專櫃代碼 *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入專櫃代碼"
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            所屬地區 *
          </label>
          <select
            value={formData.areaId}
            onChange={(e) => handleAreaChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.areaId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">請選擇地區</option>
            {areaOptions.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          {errors.areaId && <p className="text-red-500 text-xs mt-1">{errors.areaId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            櫃長姓名 *
          </label>
          <input
            type="text"
            value={formData.managerName}
            onChange={(e) => handleChange('managerName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.managerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入櫃長姓名"
          />
          {errors.managerName && <p className="text-red-500 text-xs mt-1">{errors.managerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            電話 *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入電話號碼"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入Email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            員工人數
          </label>
          <input
            type="number"
            min="0"
            value={formData.employeeCount}
            onChange={(e) => handleChange('employeeCount', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請輸入員工人數"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            狀態
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as 'active' | 'inactive')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">營運中</option>
            <option value="inactive">停用</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          地址 *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="請輸入專櫃地址"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>所屬公司:</strong> {companyName}
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {store ? '更新' : '新增'}
        </button>
      </div>
    </form>
  );
};

export default StoreForm;
