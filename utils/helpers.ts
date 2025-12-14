import { DashboardData } from '../types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-GB').format(value);
};

export const parseUrlParams = (): DashboardData | null => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  
  // Check if critical params exist, if not return null (to trigger default/demo state or error)
  if (!params.has('client') && !params.has('project')) {
    // For the purpose of this demo, if no params are present, we return a DEMO dataset
    // so the dashboard is viewable immediately.
    return {
      client: "Acme Corp",
      project: "Customer Service Automation",
      weekly_saved: 120,
      annual_saved: 6240,
      annual_savings: 156000,
      investment: 45000,
      payback: 4.2,
      roi: 246,
      monthly_costs: 1200,
      hourly_rate: 25,
      impl_fee: 25000,
      platform_costs: 800,
      ai_costs: 400,
      annual_recurring: 14400
    };
  }

  const getNum = (key: string) => parseFloat(params.get(key)?.replace(/,/g, '') || '0');
  const getStr = (key: string) => params.get(key) || '';

  return {
    client: getStr('client'),
    project: getStr('project'),
    weekly_saved: getNum('weekly_saved'),
    annual_saved: getNum('annual_saved'),
    annual_savings: getNum('annual_savings'),
    investment: getNum('investment'),
    payback: getNum('payback'),
    roi: getNum('roi'),
    monthly_costs: getNum('monthly_costs'),
    hourly_rate: getNum('hourly_rate'),
    impl_fee: getNum('impl_fee'),
    platform_costs: getNum('platform_costs'),
    ai_costs: getNum('ai_costs'),
    annual_recurring: getNum('annual_recurring'),
  };
};