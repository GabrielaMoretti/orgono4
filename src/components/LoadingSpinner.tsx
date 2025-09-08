import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ message = "Carregando...", size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
        role="status"
        aria-label="Carregando"
      />
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}
