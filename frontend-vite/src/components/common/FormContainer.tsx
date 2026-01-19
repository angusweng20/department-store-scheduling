import type { ReactNode } from 'react';

interface FormContainerProps {
  title: string;
  children: ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormContainer = ({
  title,
  children,
  onSubmit,
  submitText = '提交',
  cancelText = '取消',
  onCancel,
  isSubmitting = false,
  disabled = false,
  className = '',
}: FormContainerProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        
        {(onSubmit || onCancel) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isSubmitting || disabled}
              >
                {cancelText}
              </button>
            )}
            {onSubmit && (
              <button
                type="submit"
                disabled={isSubmitting || disabled}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : submitText}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export const FormActions = ({ children, className = '' }: FormActionsProps) => {
  return (
    <div className={`flex justify-end space-x-3 pt-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface FormSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const FormSection = ({ title, children, className = '' }: FormSectionProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-md font-medium text-gray-900 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

interface FormRowProps {
  children: ReactNode;
  className?: string;
}

export const FormRow = ({ children, className = '' }: FormRowProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {children}
    </div>
  );
};

interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export const FormField = ({ 
  label, 
  children, 
  required = false, 
  error, 
  helperText 
}: FormFieldProps) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
