import React, { useState } from 'react';

interface Company {
  id?: string;
  name: string;
  code: string;
  taxId: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
}

interface CompanyFormProps {
  company?: Company | null;
  onSave: (company: Company) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Company>({
    name: company?.name || '',
    code: company?.code || '',
    taxId: company?.taxId || '',
    manager: company?.manager || '',
    phone: company?.phone || '',
    email: company?.email || '',
    address: company?.address || '',
    status: company?.status || 'active'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Company, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Company, string>> = {};

    if (!formData.name.trim()) newErrors.name = '公司名稱為必填';
    if (!formData.code.trim()) newErrors.code = '公司代碼為必填';
    if (!formData.taxId.trim()) newErrors.taxId = '統一編號為必填';
    if (!formData.manager.trim()) newErrors.manager = '負責人為必填';
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

  const handleChange = (field: keyof Company, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            公司名稱 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入公司名稱"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            公司代碼 *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入公司代碼"
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            統一編號 *
          </label>
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => handleChange('taxId', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.taxId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入統一編號"
          />
          {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            負責人 *
          </label>
          <input
            type="text"
            value={formData.manager}
            onChange={(e) => handleChange('manager', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.manager ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="請輸入負責人姓名"
          />
          {errors.manager && <p className="text-red-500 text-xs mt-1">{errors.manager}</p>}
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
          placeholder="請輸入公司地址"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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
          {company ? '更新' : '新增'}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
