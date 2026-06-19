import React from 'react';
import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-surface-card rounded-lg shadow-md p-6 border border-border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-text-muted text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon size={28} className="text-blue-600" />
        </div>
      </div>
    </div>
  );
}
