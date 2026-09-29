import api from '../api/client';

export const DASHBOARD_PRICING_KEY = 'cpmpts_dashboard_pricing';

export const defaultDashboardPricing = {
  min: 12000,
  max: 24500,
  currency: 'KSh'
};

export function normalizeDashboardPricing(payload = {}) {
  return {
    ...defaultDashboardPricing,
    min: Number(payload.min_price ?? payload.min ?? defaultDashboardPricing.min),
    max: Number(payload.max_price ?? payload.max ?? defaultDashboardPricing.max),
    currency: payload.currency || defaultDashboardPricing.currency
  };
}

export function readDashboardPricing() {
  try {
    const raw = localStorage.getItem(DASHBOARD_PRICING_KEY);
    if (!raw) return { ...defaultDashboardPricing };
    return normalizeDashboardPricing(JSON.parse(raw));
  } catch (err) {
    return { ...defaultDashboardPricing };
  }
}

export async function getDashboardPricing() {
  const cached = readDashboardPricing();
  try {
    const response = await api.get('/dashboard-pricing');
    const next = normalizeDashboardPricing(response.data || {});
    localStorage.setItem(DASHBOARD_PRICING_KEY, JSON.stringify(next));
    return next;
  } catch (err) {
    return cached;
  }
}

export async function setDashboardPricing(nextValues) {
  try {
    const response = await api.patch('/dashboard-pricing', {
      min_price: Number(nextValues?.min ?? defaultDashboardPricing.min),
      max_price: Number(nextValues?.max ?? defaultDashboardPricing.max)
    });
    const normalized = normalizeDashboardPricing(response.data || {});
    localStorage.setItem(DASHBOARD_PRICING_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event('dashboard-pricing-updated'));
    return normalized;
  } catch (err) {
    return readDashboardPricing();
  }
}

export function formatKsh(value) {
  const pricing = readDashboardPricing();
  const numericValue = Number(value || 0);
  const clampedValue = Math.min(Math.max(numericValue, pricing.min), pricing.max);
  return `${pricing.currency} ${clampedValue.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
}

export function getKshRangeLabel(minValue, maxValue, unit = 'KSh') {
  const pricing = readDashboardPricing();
  const actualMin = Number(minValue ?? pricing.min);
  const actualMax = Number(maxValue ?? pricing.max);
  const clampedMin = Math.min(Math.max(actualMin, pricing.min), pricing.max);
  const clampedMax = Math.min(Math.max(actualMax, pricing.min), pricing.max);
  const formatCurrency = (amount) => `${unit} ${Number(amount).toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;
  return `${formatCurrency(clampedMin)} – ${formatCurrency(clampedMax)}`;
}

export function getKshMonthlyLabel(value) {
  const pricing = readDashboardPricing();
  const numericValue = Number(value ?? pricing.min);
  const clampedValue = Math.min(Math.max(numericValue, pricing.min), pricing.max);
  return `${pricing.currency} ${clampedValue.toLocaleString('en-KE', { maximumFractionDigits: 0 })} /mo`;
}
