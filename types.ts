export interface DashboardData {
  client: string;
  project: string;
  weekly_saved: number;
  annual_saved: number;
  annual_savings: number;
  investment: number;
  payback: number;
  roi: number;
  monthly_costs: number;
  hourly_rate: number;
  impl_fee: number;
  platform_costs: number;
  ai_costs: number;
  annual_recurring: number;
}

export interface ComputedMetrics {
  roi_multiplier: number;
  net_benefit: number;
  monthly_benefit: number;
  support_costs: number; // Derived from investment breakdown
}