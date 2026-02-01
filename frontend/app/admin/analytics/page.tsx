'use client';

import React, { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

export default function AnalyticsPage() {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - THIRTY_DAYS_IN_MS)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [productsData, sales] = await Promise.all([
        adminAPI.getTopProducts().catch(() => []),
        adminAPI.getSalesData(dateRange.startDate, dateRange.endDate).catch(() => null),
      ]);
      setTopProducts(productsData);
      setSalesData(sales);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Over Time</h2>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">
              Integrate with Chart.js or Recharts for visual data
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Selling Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between pb-4 border-b last:border-0"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-400 mr-4">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales_count || 0} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${(product.revenue || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Analytics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">New Customers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {salesData?.newCustomers || 0}
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-blue-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Returning Customers
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {salesData?.returningCustomers || 0}
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Average Order</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${(salesData?.averageOrderValue || 0).toFixed(2)}
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue by Category
        </h2>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Pie/Bar chart will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">
              Revenue breakdown by product categories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
