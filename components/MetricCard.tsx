import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  delay?: number;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconBgColor,
  delay = 0,
  subtext
}) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02] card-fade-in flex flex-col justify-between"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</h3>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor} text-white shadow-sm`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-slate-600">{subtitle}</div>
        {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
      </div>
    </div>
  );
};