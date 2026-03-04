// Copyright 2026 Vayuntra — Apache License 2.0
// API abstraction layer

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`API Error [${path}]:`, err);
    throw err;
  }
}

export const api = {
  submitMetrics: (data) => request('/metrics/', { method: 'POST', body: JSON.stringify(data) }),
  getRecentMetrics: (limit = 50) => request(`/metrics/recent?limit=${limit}`),
  detectAnomaly: (data) => request('/anomaly/detect', { method: 'POST', body: JSON.stringify(data) }),
  getAnomalyStatus: () => request('/anomaly/status'),
  triggerIsolation: (data) => request('/isolation/trigger', { method: 'POST', body: JSON.stringify(data) }),
  getIsolationStatus: () => request('/isolation/status'),
  healthCheck: () => request('/health'),
};
