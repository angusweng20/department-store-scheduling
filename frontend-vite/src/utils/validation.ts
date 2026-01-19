// 表單驗證工具

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

// 驗證器函數
export const validators = {
  required: (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
      return '此欄位為必填';
    }
    return null;
  },

  minLength: (value: string, min: number): string | null => {
    if (value && value.length < min) {
      return `最少需要 ${min} 個字元`;
    }
    return null;
  },

  maxLength: (value: string, max: number): string | null => {
    if (value && value.length > max) {
      return `最多只能 ${max} 個字元`;
    }
    return null;
  },

  min: (value: number, min: number): string | null => {
    if (value !== null && value !== undefined && value < min) {
      return `數值不能小於 ${min}`;
    }
    return null;
  },

  max: (value: number, max: number): string | null => {
    if (value !== null && value !== undefined && value > max) {
      return `數值不能大於 ${max}`;
    }
    return null;
  },

  email: (value: string): string | null => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailPattern.test(value)) {
      return '請輸入有效的電子郵件地址';
    }
    return null;
  },

  phone: (value: string): string | null => {
    const phonePattern = /^[0-9]{10}$/;
    if (value && !phonePattern.test(value.replace(/[-\s]/g, ''))) {
      return '請輸入有效的電話號碼';
    }
    return null;
  },

  employeeId: (value: string): string | null => {
    const pattern = /^[A-Z]{1,2}[0-9]{3,4}$/;
    if (value && !pattern.test(value.toUpperCase())) {
      return '員工編號格式不正確 (例如: A001)';
    }
    return null;
  },

  dateRange: (startDate: string, endDate: string): string | null => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return '結束日期不能早於開始日期';
    }
    return null;
  },

  futureDate: (value: string): string | null => {
    if (value) {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        return '日期不能早於今天';
      }
    }
    return null;
  },
};

// 驗證表單
export const validateForm = (
  data: { [fieldName: string]: any },
  rules: ValidationRules
): ValidationResult => {
  const errors: { [fieldName: string]: string } = {};
  let isValid = true;

  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = data[fieldName];

    // 檢查必填
    if (fieldRules.required) {
      const error = validators.required(fieldValue);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
        return; // 如果必填失敗，不檢查其他規則
      }
    }

    // 如果欄位為空且非必填，跳過其他檢查
    if (!fieldValue && !fieldRules.required) {
      return;
    }

    // 檢查最小長度
    if (fieldRules.minLength) {
      const error = validators.minLength(fieldValue, fieldRules.minLength);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    // 檢查最大長度
    if (fieldRules.maxLength) {
      const error = validators.maxLength(fieldValue, fieldRules.maxLength);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    // 檢查最小值
    if (fieldRules.min) {
      const error = validators.min(fieldValue, fieldRules.min);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    // 檢查最大值
    if (fieldRules.max) {
      const error = validators.max(fieldValue, fieldRules.max);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }

    // 檢查正則表達式
    if (fieldRules.pattern) {
      if (!fieldRules.pattern.test(fieldValue)) {
        errors[fieldName] = '格式不正確';
        isValid = false;
      }
    }

    // 檢查自定義驗證
    if (fieldRules.custom) {
      const error = fieldRules.custom(fieldValue);
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

// 常用驗證規則
export const commonValidationRules = {
  employeeId: {
    required: true,
    custom: validators.employeeId,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: false,
    custom: validators.email,
  },
  phone: {
    required: false,
    custom: validators.phone,
  },
  monthlyAvailableHours: {
    required: true,
    min: 0,
    max: 300,
  },
  minRestDaysPerMonth: {
    required: true,
    min: 0,
    max: 30,
  },
  leaveReason: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  scheduleDate: {
    required: true,
    custom: validators.futureDate,
  },
};
