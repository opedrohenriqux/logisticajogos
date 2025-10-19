
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#FEC700]"></div>
      <p className="text-lg text-gray-700">Gerando um quiz incrível...</p>
    </div>
  );
};

export default LoadingSpinner;
