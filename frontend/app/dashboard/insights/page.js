"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, PieChart as PieChartIcon } from "lucide-react";

export default function InsightsPage() {
  // Mock data for visualizations
  const categoryData = [
    { name: 'Food & Dining', value: 4500, color: '#3b82f6' },
    { name: 'Transportation', value: 2100, color: '#8b5cf6' },
    { name: 'Entertainment', value: 1200, color: '#f59e0b' },
    { name: 'Shopping', value: 3400, color: '#10b981' },
    { name: 'Utilities', value: 900, color: '#64748b' },
  ];

  const monthlyFlow = [
    { name: 'Jan', inflow: 4000, outflow: 2400 },
    { name: 'Feb', inflow: 3000, outflow: 1398 },
    { name: 'Mar', inflow: 2000, outflow: 4800 },
    { name: 'Apr', inflow: 2780, outflow: 3908 },
    { name: 'May', inflow: 1890, outflow: 4800 },
    { name: 'Jun', inflow: 2390, outflow: 3800 },
  ];

  const totalInflow = monthlyFlow.reduce((sum, item) => sum + item.inflow, 0);
  const totalOutflow = monthlyFlow.reduce((sum, item) => sum + item.outflow, 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <PieChartIcon className="text-blue-600" size={24} /> Financial Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1">AI-powered analytics and categorization of your converted statements.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Inflows (YTD)</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">${totalInflow.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <TrendingDown size={20} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Total Outflows (YTD)</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1">${totalOutflow.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium relative z-10">Unusual Spending Flags</h3>
          <p className="text-3xl font-bold text-slate-900 mt-1 relative z-10">3</p>
          <button className="text-xs font-bold text-amber-600 mt-2 hover:underline relative z-10">Review flagged transactions &rarr;</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Spending Breakdown</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => `$${value}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Flow Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Cash Flow (Last 6 Months)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  formatter={(value) => `$${value}`}
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="outflow" name="Outflow" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
