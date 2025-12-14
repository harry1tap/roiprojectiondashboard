import React, { useEffect, useState } from 'react';

interface RoiGaugeProps {
  roi: number;
  multiplier: number;
}

export const RoiGauge: React.FC<RoiGaugeProps> = ({ roi, multiplier }) => {
  const [offset, setOffset] = useState(100);

  // Gauge logic
  // Semi-circle path length is approx 100 units for normalized calculations
  // ROI Range visual mapping: 
  // 0% -> 0 fill
  // 300% -> 100 fill (capped)
  const maxRoi = 300;
  const normalizedRoi = Math.min(roi, maxRoi);
  const percentage = (normalizedRoi / maxRoi) * 100;
  // Stroke dasharray 100 100 (100 is visible, 100 is gap)
  // Offset: 100 (empty) -> 0 (full)
  const targetOffset = 100 - percentage;

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  // Color determination
  const getColor = (val: number) => {
    if (val < 50) return "#ef4444"; // Red
    if (val < 100) return "#f97316"; // Orange
    if (val < 200) return "url(#gradient-yellow-green)"; // Gradient
    return "#22c55e"; // Green
  };

  const color = getColor(roi);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow h-full card-fade-in relative overflow-hidden">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 absolute top-6">Project ROI</h3>
      
      <div className="relative w-64 h-32 mt-4 mb-2">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradient-yellow-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#a3e635" />
            </linearGradient>
          </defs>
          
          {/* Background Track */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="24" 
            strokeLinecap="round"
          />
          
          {/* Active Gauge */}
          <path 
            d="M 20 100 A 80 80 0 0 1 180 100" 
            fill="none" 
            stroke={color} 
            strokeWidth="24" 
            strokeLinecap="round"
            strokeDasharray="251.2" // Circumference of semi-circle (PI * R) approx
            strokeDashoffset={251.2 * (1 - (normalizedRoi / maxRoi))}
            className="transition-all duration-[1500ms] ease-out"
          />
        </svg>
        
        <div className="absolute bottom-0 left-0 w-full text-center">
           <div className="text-5xl font-bold text-slate-900 tracking-tight leading-none">
            {roi}%
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-bold text-slate-400 tracking-wide mb-2">RETURN ON INVESTMENT</div>
        <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg inline-block">
          For every <span className="font-bold">£1</span> invested, returns <span className="font-bold text-blue-600">£{multiplier.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};