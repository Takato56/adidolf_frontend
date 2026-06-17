'use client';

import { StatCard } from '@/components/admin/StatCard';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiDollarSign } from 'react-icons/fi';
import { OverviewStats } from '@/types';

// Mock data for overview
const mockStats: OverviewStats = {
  totalSales: 1234,
  totalOrders: 567,
  activeCustomers: 2345,
  revenueGrowth: '+12.5%',
  salesTrend: [100, 120, 110, 135, 150, 145, 160],
  ordersTrend: [10, 12, 15, 18, 20, 22, 25],
  customersTrend: [100, 150, 180, 220, 250, 280, 320],
  revenueTrend: [1000, 1200, 1150, 1400, 1600, 1500, 1800],
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={mockStats.totalSales}
          icon={FiTrendingUp}
          trend="12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value={mockStats.totalOrders}
          icon={FiShoppingCart}
          trend="8.2%"
          trendUp={true}
        />
        <StatCard
          title="Active Customers"
          value={mockStats.activeCustomers}
          icon={FiUsers}
          trend="5.4%"
          trendUp={true}
        />
        <StatCard
          title="Revenue"
          value={`$${(mockStats.revenueTrend[mockStats.revenueTrend.length - 1] / 1000).toFixed(1)}K`}
          icon={FiDollarSign}
          trend="15.3%"
          trendUp={true}
        />
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Trend (Last 7 Days)
          </h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {mockStats.salesTrend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                style={{ height: `${(value / 160) * 100}%` }}
                title={`${value} sales`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <span>Day 1</span>
            <span>Day 7</span>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Orders Trend (Last 7 Days)
          </h3>
          <div className="h-40 flex items-end justify-between gap-2">
            {mockStats.ordersTrend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                style={{ height: `${(value / 25) * 100}%` }}
                title={`${value} orders`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <span>Day 1</span>
            <span>Day 7</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">
                New order from John Doe
              </p>
              <p className="text-xs text-gray-600">2 hours ago</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              Order #1234
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Inventory updated for Product XYZ
              </p>
              <p className="text-xs text-gray-600">5 hours ago</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              Updated
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                New customer registration
              </p>
              <p className="text-xs text-gray-600">1 day ago</p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
              New User
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
