'use client';

interface SkeletonLoaderProps {
  /** Number of lines to show */
  lines?: number;
  /** Include avatar skeleton */
  avatar?: boolean;
  /** Custom class name */
  className?: string;
}

export default function SkeletonLoader({
  lines = 3,
  avatar = false,
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {avatar && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-secondary rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-secondary rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-surface-secondary rounded w-1/2 animate-pulse" />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-surface-secondary rounded w-full animate-pulse" />
          <div className="h-3 bg-surface-secondary rounded w-5/6 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
