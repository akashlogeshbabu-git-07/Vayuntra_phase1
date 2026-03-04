// Copyright 2026 Vayuntra — Apache License 2.0
// Mock data layer — simulates live telemetry and anomaly events

export const SYSTEM_STATS = {
  mttd: '2m 14s',
  mttr: '8m 42s',
  riskScore: 67,
  threatsActive: 3,
  threatsContained: 12,
  systemHealth: 'DEGRADED',
  uptime: '99.2%',
  assetsMonitored: 48,
  anomaliesToday: 7,
  isolationsToday: 2,
};

export const ANOMALY_FEED = [
  {
    id: 'ANO-2026-001847',
    timestamp: new Date(Date.now() - 12000),
    severity: 'CRITICAL',
    source: 'ENDPOINT-PROD-07',
    type: 'Behavioral Deviation',
    method: 'IsolationForest',
    confidence: 94.2,
    score: -0.4821,
    cpu: 98.7,
    memory: 91.2,
    network: 87.5,
    status: 'ACTIVE',
    controlId: 'SI-4',
    isolated: false,
  },
  {
    id: 'ANO-2026-001846',
    timestamp: new Date(Date.now() - 85000),
    severity: 'HIGH',
    source: 'NET-GATEWAY-02',
    type: 'Network Anomaly',
    method: 'Heuristic',
    confidence: 78.6,
    score: -0.2341,
    cpu: 45.2,
    memory: 67.8,
    network: 99.1,
    status: 'INVESTIGATING',
    controlId: 'SI-3',
    isolated: false,
  },
  {
    id: 'ANO-2026-001845',
    timestamp: new Date(Date.now() - 240000),
    severity: 'HIGH',
    source: 'DB-SERVER-01',
    type: 'Privilege Escalation Indicator',
    method: 'Rule-Based',
    confidence: 82.1,
    score: -0.3102,
    cpu: 72.1,
    memory: 88.4,
    network: 34.2,
    status: 'CONTAINED',
    controlId: 'AC-6',
    isolated: true,
  },
  {
    id: 'ANO-2026-001844',
    timestamp: new Date(Date.now() - 600000),
    severity: 'MEDIUM',
    source: 'WORKSTATION-14',
    type: 'Process Anomaly',
    method: 'IsolationForest',
    confidence: 61.3,
    score: -0.1224,
    cpu: 88.9,
    memory: 55.2,
    network: 12.4,
    status: 'RESOLVED',
    controlId: 'SI-4',
    isolated: false,
  },
  {
    id: 'ANO-2026-001843',
    timestamp: new Date(Date.now() - 1200000),
    severity: 'LOW',
    source: 'ENDPOINT-DEV-12',
    type: 'Baseline Deviation',
    method: 'IsolationForest',
    confidence: 34.7,
    score: 0.0221,
    cpu: 79.3,
    memory: 62.1,
    network: 28.7,
    status: 'RESOLVED',
    controlId: 'CM-2',
    isolated: false,
  },
];

export const ISOLATION_EVENTS = [
  {
    id: 'ISO-2026-0089',
    timestamp: new Date(Date.now() - 240000),
    action: 'network_segment',
    target: 'DB-SERVER-01',
    correlationId: 'f4a92b1c-3e8d-4f7a-b2c1-9e4d8f2a7b3c',
    success: true,
    operator: 'system',
    playbook: 'PB-CONTAINMENT-001',
    status: 'COMPLETE',
  },
  {
    id: 'ISO-2026-0088',
    timestamp: new Date(Date.now() - 86400000),
    action: 'terminate_process',
    target: 'ENDPOINT-PROD-03 / PID:4821',
    correlationId: 'a1b3c5d7-e9f2-4a6b-8c0d-2e4f6a8b0c2d',
    success: true,
    operator: 'analyst:j.chen',
    playbook: 'PB-PROCESS-KILL-001',
    status: 'COMPLETE',
  },
  {
    id: 'ISO-2026-0087',
    timestamp: new Date(Date.now() - 172800000),
    action: 'log_containment',
    target: 'WORKSTATION-21',
    correlationId: 'c2d4e6f8-a0b2-4c6e-8f0a-2b4d6e8f0a2c',
    success: true,
    operator: 'system',
    playbook: 'PB-LOG-ONLY-001',
    status: 'COMPLETE',
  },
];

export const TELEMETRY_TIMELINE = Array.from({ length: 30 }, (_, i) => {
  const baseTime = Date.now() - (29 - i) * 60000;
  const hasAnomaly = [12, 18, 24, 27].includes(i);
  return {
    time: new Date(baseTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    cpu: hasAnomaly ? 85 + Math.random() * 14 : 30 + Math.random() * 35,
    memory: hasAnomaly ? 80 + Math.random() * 18 : 45 + Math.random() * 25,
    network: hasAnomaly ? 75 + Math.random() * 24 : 15 + Math.random() * 40,
    anomaly: hasAnomaly,
  };
});

export const COMPLIANCE_EVENTS = [
  {
    id: 'CE-001847',
    anomalyId: 'ANO-2026-001847',
    control: 'SI-4',
    framework: 'NIST 800-53',
    description: 'System Monitoring — Anomaly detection triggered',
    status: 'TRIGGERED',
    incidentClass: 'Behavioral Anomaly',
    auditLogged: true,
    timestamp: new Date(Date.now() - 12000),
  },
  {
    id: 'CE-001846',
    anomalyId: 'ANO-2026-001846',
    control: 'SI-3',
    framework: 'NIST 800-53',
    description: 'Malware Protection — Network anomaly detected',
    status: 'UNDER_REVIEW',
    incidentClass: 'Network Anomaly',
    auditLogged: true,
    timestamp: new Date(Date.now() - 85000),
  },
  {
    id: 'CE-001845',
    anomalyId: 'ANO-2026-001845',
    control: 'AC-6',
    framework: 'NIST 800-53',
    description: 'Least Privilege — Privilege escalation indicator',
    status: 'CONTAINED',
    incidentClass: 'Access Control Violation',
    auditLogged: true,
    timestamp: new Date(Date.now() - 240000),
  },
];

export const AUDIT_LOG = [
  { id: 'AUD-9921', timestamp: new Date(Date.now() - 12000), type: 'ANOMALY_DETECTED', user: 'system', ip: '10.0.0.1', correlationId: 'f4a92b1c' },
  { id: 'AUD-9920', timestamp: new Date(Date.now() - 85000), type: 'ANOMALY_DETECTED', user: 'system', ip: '10.0.0.1', correlationId: 'b2c3d4e5' },
  { id: 'AUD-9919', timestamp: new Date(Date.now() - 240000), type: 'ISOLATION_TRIGGERED', user: 'system', ip: '10.0.0.1', correlationId: 'f4a92b1c' },
  { id: 'AUD-9918', timestamp: new Date(Date.now() - 241000), type: 'ANOMALY_DETECTED', user: 'system', ip: '10.0.0.1', correlationId: 'f4a92b1c' },
  { id: 'AUD-9917', timestamp: new Date(Date.now() - 600000), type: 'ANOMALY_RESOLVED', user: 'analyst:j.chen', ip: '10.0.1.42', correlationId: 'a1b2c3d4' },
];

// Simulate live data generation
export function generateLiveMetric() {
  const isAnomaly = Math.random() < 0.15;
  return {
    cpu: isAnomaly ? 85 + Math.random() * 14 : 20 + Math.random() * 50,
    memory: isAnomaly ? 80 + Math.random() * 18 : 35 + Math.random() * 40,
    network: isAnomaly ? 70 + Math.random() * 28 : 10 + Math.random() * 45,
  };
}
