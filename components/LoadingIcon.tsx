'use client';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface LoadingIconProps {
  /** Size of the spinner: 'sm', 'md', 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Optional loading message */
  message?: string;
  /** Optional CSS class name */
  className?: string;
  /** Show full page overlay (for async operations) */
  fullPage?: boolean;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function LoadingIcon({
  size = 'md',
  message,
  className = '',
  fullPage = false,
}: LoadingIconProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <AiOutlineLoading3Quarters
        className={`${sizeMap[size]} animate-spin text-blue-500`}
      />
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        {spinner}
      </div>
    );
  }

  return <div className={`flex items-center justify-center ${className}`}>{spinner}</div>;
}
