import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div
        className={`${sizeClasses[size]} border-gold-200 border-t-gold-500 rounded-full animate-spin`}
      />
      {text && <p className="text-xs font-serif text-gold-700 tracking-widest uppercase">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
