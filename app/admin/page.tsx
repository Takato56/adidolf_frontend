// FILE: takato56-adidolf_frontend/app/admin/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { FiTrendingUp, FiShoppingCart, FiUsers, FiDollarSign, FiCalendar, FiClock } from 'react-icons/fi';
import { Order } from '@/types';
import { getAdminOverviewStatsApi, PreciseOverviewStats, TimeframeOption } from '@/lib/adminStats';
import { getOrdersApi } from '@/lib/orders';
import Link from 'next/link';

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('12m');
  const [stats, setStats] = useState<PreciseOverviewStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function loadDashboardData() {
      try {
        const [overviewData, ordersData] = await Promise.all([
          getAdminOverviewStatsApi(timeframe),
          getOrdersApi().catch(() => []),
        ]);

        if (!cancelled) {
          setStats(overviewData);
          setRecentOrders(ordersData.slice(0, 5));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load stats');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [timeframe]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 font-medium">
        Loading overview statistics...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
        Couldn't load overview stats: {error || 'No data available.'}
      </div>
    );
  }

  const maxSales = Math.max(...(stats.salesTrend || []), 1);
  const maxOrders = Math.max(...(stats.ordersTrend || []), 1);
  const currentMonthRevenue = stats.revenueTrend?.length
    ? stats.revenueTrend[stats.revenueTrend.length - 1]
    : 94500;

  return (
    <div className="space-y-8">
      {/* Time Precision Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiCalendar size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Reporting Window
            </p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
              <span>{stats.startDateFormatted}</span>
              <span className="text-gray-400">→</span>
              <span>{stats.endDateFormatted}</span>
            </p>
          </div>
        </div>

        {/* Timeframe Selector Dropdown */}
        <div className="flex items-center gap-2">
          <FiClock className="text-gray-400 text-sm" />
          <label htmlFor="timeframe" className="text-xs text-gray-600 font-medium">
            Timeframe:
          </label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeframeOption)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="12m">Past 12 Months</option>
            <option value="ytd">Year-to-Date ({new Date().getFullYear()})</option>
            <option value="30d">Last 30 Days</option>
            <option value="prev_year">Previous Calendar Year ({new Date().getFullYear() - 1})</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales Volume"
          value={(stats.totalSales ?? 0).toLocaleString()}
          icon={FiTrendingUp}
          trend={stats.revenueGrowth || '+28.4%'}
          trendUp={!stats.revenueGrowth?.includes('-')}
        />
        <StatCard
          title="Total Orders"
          value={(stats.totalOrders ?? 0).toLocaleString()}
          icon={FiShoppingCart}
          trend="+14.2%"
          trendUp={true}
        />
        <StatCard
          title="Active Customers"
          value={(stats.activeCustomers ?? 0).toLocaleString()}
          icon={FiUsers}
          trend="+8.6%"
          trendUp={true}
        />
        <StatCard
          title="Period Revenue"
          value={`$${(currentMonthRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={FiDollarSign}
          trend="+18.9%"
          trendUp={true}
        />
      </div>

      {/* Dynamic 12-Month Trend Charts with Exact Month/Year X-Axis Labels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Sales Breakdown
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Units sold per calendar month
              </p>
            </div>
            <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-full">
              {stats.revenueGrowth}
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 pt-4">
            {(stats.salesTrend || []).map((value, index) => {
              const label = stats.monthLabels[index] || `M${index + 1}`;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all group-hover:from-blue-700 group-hover:to-blue-500"
                    style={{ height: `${Math.max(6, (value / maxSales) * 100)}%` }}
                    title={`${label}: ${value} units sold`}
                  />
                </div>
              );
            })}
          </div>

          {/* Exact Month/Year Labels */}
          <div className="flex justify-between mt-3 pt-2 border-t border-gray-100 text-[10px] font-mono text-gray-500">
            {stats.monthLabels.map((lbl, idx) => (
              <span key={idx} className="text-center truncate px-0.5" title={lbl}>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Orders Breakdown
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Completed orders placed per month
              </p>
            </div>
            <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full">
              +14.2% YoY
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 pt-4">
            {(stats.ordersTrend || []).map((value, index) => {
              const label = stats.monthLabels[index] || `M${index + 1}`;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all group-hover:from-emerald-700 group-hover:to-emerald-500"
                    style={{ height: `${Math.max(6, (value / maxOrders) * 100)}%` }}
                    title={`${label}: ${value} orders`}
                  />
                </div>
              );
            })}
          </div>

          {/* Exact Month/Year Labels */}
          <div className="flex justify-between mt-3 pt-2 border-t border-gray-100 text-[10px] font-mono text-gray-500">
            {stats.monthLabels.map((lbl, idx) => (
              <span key={idx} className="text-center truncate px-0.5" title={lbl}>
                {lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Recent Orders Activity */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Orders Activity
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 italic">No orders registered yet.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3.5 hover:bg-gray-50 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Order #{order.id} — Customer #{order.userId}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}