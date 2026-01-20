import React from 'react';

interface LiffLoadingProps {
  message?: string;
}

const LiffLoading: React.FC<LiffLoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{message}</p>
        <p className="text-gray-400 text-sm mt-2">正在初始化 LINE LIFF...</p>
      </div>
    </div>
  );
};

export default LiffLoading;
