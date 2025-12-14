import React, { useEffect, useMemo, useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  Coins, 
  Download, 
  Layers, 
  TrendingUp, 
  RefreshCw,
  CalendarCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DashboardData, ComputedMetrics } from './types';
import { parseUrlParams, formatCurrency, formatNumber } from './utils/helpers';
import { MetricCard } from './components/MetricCard';
import { RoiGauge } from './components/RoiGauge';

const App: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const parsedData = parseUrlParams();
    setData(parsedData);
  }, []);

  const metrics: ComputedMetrics | null = useMemo(() => {
    if (!data) return null;

    const roi_multiplier = (data.roi / 100) + 1;
    const net_benefit = data.annual_savings - data.annual_recurring;
    const monthly_benefit = net_benefit / 12;
    
    // Calculate Support/Other costs from investment breakdown
    // Investment = Impl + (Platform*12) + (AI*12) + Support
    const platformAnnual = data.platform_costs * 12;
    const aiAnnual = data.ai_costs * 12;
    const knownCosts = data.impl_fee + platformAnnual + aiAnnual;
    // If investment is higher than known costs, the rest is support/misc
    const support_costs = Math.max(0, data.investment - knownCosts);

    return {
      roi_multiplier,
      net_benefit,
      monthly_benefit,
      support_costs
    };
  }, [data]);

  const handlePrint = () => {
    window.print();
  };

  if (!data || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-red-500">Invalid Dashboard Link</h2>
          <p>Please check your URL parameters.</p>
        </div>
      </div>
    );
  }

  // Chart Data
  const chartData = [
    { name: 'Implementation', value: data.impl_fee, color: '#3b82f6' }, // Blue
    { name: 'Platform Costs (1Y)', value: data.platform_costs * 12, color: '#10b981' }, // Emerald
    { name: 'AI Usage (1Y)', value: data.ai_costs * 12, color: '#8b5cf6' }, // Violet
    { name: 'Support & Ops', value: metrics.support_costs, color: '#f59e0b' }, // Amber
  ].filter(item => item.value > 0);

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen pb-12 print:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:static print:border-b-2">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
               UA
             </div>
             <div>
               <div className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">ROI Impact Report</div>
               <h1 className="text-xl font-bold text-slate-900 leading-none mt-0.5">{data.client}</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-2 justify-end text-slate-700 font-semibold">
                <Layers className="w-4 h-4 text-blue-500" />
                {data.project}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{today}</div>
            </div>
            <button 
              onClick={handlePrint}
              className="no-print bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm hover:shadow"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Left Column: ROI Hero */}
          <div className="md:row-span-2 xl:row-span-1 h-full">
            <RoiGauge roi={data.roi} multiplier={metrics.roi_multiplier} />
          </div>

          {/* Middle Column: Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xl:col-span-1">
            <MetricCard 
              title="Annual Cost Savings"
              value={formatCurrency(data.annual_savings)}
              subtitle="Projected Y1 Savings"
              icon={<Coins className="w-6 h-6" />}
              iconBgColor="bg-teal-500"
              delay={0.1}
            />
            <MetricCard 
              title="Time Savings"
              value={`${formatNumber(data.weekly_saved)} hrs`}
              subtitle={`${formatNumber(data.annual_saved)} hours/year`}
              icon={<Clock className="w-6 h-6" />}
              iconBgColor="bg-blue-500"
              delay={0.2}
            />
            <MetricCard 
              title="Total Investment"
              value={formatCurrency(data.investment)}
              subtitle="Year 1 Total Cost"
              subtext={`${formatCurrency(data.impl_fee)} impl. + ${formatCurrency(data.annual_recurring)} recurring`}
              icon={<Briefcase className="w-6 h-6" />}
              iconBgColor="bg-blue-600"
              delay={0.3}
            />
            <MetricCard 
              title="Monthly Recurring"
              value={formatCurrency(data.monthly_costs)}
              subtitle={`${formatCurrency(data.annual_recurring)} annually`}
              icon={<RefreshCw className="w-6 h-6" />}
              iconBgColor="bg-teal-500"
              delay={0.4}
            />
          </div>

          {/* Right Column: Financial Projections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
             <MetricCard 
              title="Year 1 Net Profit"
              value={formatCurrency(metrics.net_benefit)}
              subtitle="After all costs"
              icon={<TrendingUp className="w-6 h-6" />}
              iconBgColor="bg-emerald-500"
              delay={0.5}
            />
            <MetricCard 
              title="Payback Period"
              value={`${data.payback} Months`}
              subtitle="Time to Breakeven"
              icon={<CalendarCheck className="w-6 h-6" />}
              iconBgColor="bg-orange-500"
              delay={0.6}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 page-break">
          
          {/* Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 card-fade-in" style={{animationDelay: '0.7s'}}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Investment Breakdown</h3>
            <div className="h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-xs text-slate-400 font-medium">TOTAL</span>
                <span className="text-xl font-bold text-slate-800">{formatCurrency(data.investment)}</span>
              </div>
            </div>
          </div>

          {/* Financial Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 card-fade-in flex flex-col" style={{animationDelay: '0.8s'}}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Financial Overview</h3>
            
            <div className="overflow-hidden rounded-lg border border-slate-100 flex-grow">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Metric</th>
                    <th className="px-6 py-4">Value</th>
                    <th className="px-6 py-4">Monthly Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-700">Initial Investment</td>
                    <td className="px-6 py-4 text-slate-600">{formatCurrency(data.investment)}</td>
                    <td className="px-6 py-4 text-slate-400">—</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-700">Recurring Costs</td>
                    <td className="px-6 py-4 text-slate-600">{formatCurrency(data.monthly_costs)}/mo</td>
                    <td className="px-6 py-4 text-red-500 font-medium">-{formatCurrency(data.monthly_costs)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-700">Hourly Rate</td>
                    <td className="px-6 py-4 text-slate-600">{formatCurrency(data.hourly_rate)}/hr</td>
                    <td className="px-6 py-4 text-slate-400">—</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">Year 1 Net Profit</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{formatCurrency(metrics.net_benefit)}</td>
                    <td className="px-6 py-4 font-bold text-emerald-500">+{formatCurrency(metrics.monthly_benefit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-slate-500 leading-relaxed">
              * Calculations based on provided hours saved and hourly rates. ROI includes implementation fees and year-1 recurring costs. All projections are for the first 12 months.
            </div>
          </div>
        </div>
      </main>

      {/* Print Footer */}
      <footer className="hidden print:block fixed bottom-0 left-0 w-full p-8 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto">
          <span>Unorthodox AI - ROI Impact Report</span>
          <span>Generated on {today}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;