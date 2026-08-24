'use client';

import { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CostRecord {
  id: number;
  date: string;
  model_name: string;
  provider: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number;
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#f97316', '#a78bfa'];

export default function CostPage() {
  const [costRecords, setCostRecords] = useState<CostRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/cost');
        if (res.ok) {
          const data = await res.json();
          setCostRecords(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCosts();
  }, []);

  const totalCost = costRecords.reduce((acc, curr) => acc + curr.cost_usd, 0);
  const totalTokens = costRecords.reduce((acc, curr) => acc + curr.prompt_tokens + curr.completion_tokens, 0);

  // Group by Provider
  const providerGroups = costRecords.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.provider] = (acc[curr.provider] || 0) + curr.cost_usd;
    return acc;
  }, {});

  const pieData = Object.keys(providerGroups).map(k => ({
    name: k,
    value: parseFloat(providerGroups[k].toFixed(2))
  }));

  // Group by Date for Charting
  const dateGroups = costRecords.reduce((acc: { [key: string]: { date: string; cost: number; tokens: number } }, curr) => {
    const dateStr = new Date(curr.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (!acc[dateStr]) {
      acc[dateStr] = { date: dateStr, cost: 0, tokens: 0 };
    }
    acc[dateStr].cost += curr.cost_usd;
    acc[dateStr].tokens += curr.prompt_tokens + curr.completion_tokens;
    return acc;
  }, {});

  const chartData = Object.values(dateGroups).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] flex items-center">
          <DollarSign className="w-6 h-6 text-[var(--color-accent)] mr-2" />
          LLM Token Cost Center
        </h1>
        <p className="text-gray-400 text-sm mt-1">Analyze and optimize token expenses across commercial and local LLM vendors.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading cost telemetry...</div>
      ) : costRecords.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-[var(--color-panel)] border border-[var(--color-panel-border)] rounded-lg">
          No cost records recorded yet.
        </div>
      ) : (
        <>
          {/* Top Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-5 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Aggregated API Spend</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-5 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Consumed Prompt/Completion Tokens</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">{(totalTokens / 1000000).toFixed(2)}M tokens</span>
              </div>
              <div className="p-3 bg-[var(--color-accent)]/10 rounded-full">
                <Activity className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
            </div>

            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-5 rounded-lg flex items-center justify-between shadow-sm">
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Average Cost per Million Tokens</span>
                <span className="text-2xl font-bold text-gray-200 mt-1 block">${totalTokens > 0 ? ((totalCost / totalTokens) * 1000000).toFixed(2) : '0.00'}</span>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Expense Bar Chart */}
            <div className="lg:col-span-2 bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-6 rounded-lg shadow-sm">
              <h3 className="text-base font-semibold text-gray-200 mb-6">Daily Vendor Expenses ($)</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                    <Bar dataKey="cost" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vendor Breakdown Pie Chart */}
            <div className="bg-[var(--color-panel)] border border-[var(--color-panel-border)] p-6 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-200 mb-6">Vendor Allocation Share</h3>
                <div className="h-60 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-2 mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-gray-300 font-medium">{entry.name}</span>
                    </div>
                    <span className="text-gray-200 font-semibold">${entry.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
