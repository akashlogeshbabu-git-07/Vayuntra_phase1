// Copyright 2026 Vayuntra — Apache License 2.0
import { useState, useEffect, useCallback } from 'react';
import {
  SYSTEM_STATS, ANOMALY_FEED, ISOLATION_EVENTS,
  TELEMETRY_TIMELINE, COMPLIANCE_EVENTS, AUDIT_LOG,
  generateLiveMetric
} from './api/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area
} from 'recharts';

// ─── UTILITY ───────────────────────────────────────────────────────────────

function timeAgo(date) {
  const sec = Math.floor((Date.now() - date) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function severityColor(s) {
  return { CRITICAL: '#ff2d55', HIGH: '#ffaa00', MEDIUM: '#00d4ff', LOW: '#00ff88', NORMAL: '#3d5a7a' }[s] || '#3d5a7a';
}
function severityBg(s) {
  return {
    CRITICAL: 'rgba(255,45,85,0.12)', HIGH: 'rgba(255,170,0,0.12)',
    MEDIUM: 'rgba(0,212,255,0.12)', LOW: 'rgba(0,255,136,0.12)', NORMAL: 'rgba(61,90,122,0.12)'
  }[s] || 'rgba(61,90,122,0.12)';
}
function statusColor(s) {
  return { ACTIVE: '#ff2d55', INVESTIGATING: '#ffaa00', CONTAINED: '#00d4ff', RESOLVED: '#00ff88', COMPLETE: '#00ff88', TRIGGERED: '#ff2d55', UNDER_REVIEW: '#ffaa00' }[s] || '#3d5a7a';
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────

function CyberCard({ children, style, glow }) {
  const glowMap = { cyan: '0 0 20px rgba(0,212,255,0.08)', red: '0 0 20px rgba(255,45,85,0.12)', green: '0 0 20px rgba(0,255,136,0.08)', amber: '0 0 20px rgba(255,170,0,0.1)' };
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d1a30 0%, #0a1628 100%)',
      border: '1px solid rgba(0,212,255,0.1)',
      borderRadius: 8,
      boxShadow: glowMap[glow] || 'none',
      ...style
    }}>
      {children}
    </div>
  );
}

function StatusBadge({ label, color, bg }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
      color: color, background: bg || 'rgba(0,212,255,0.08)',
      border: `1px solid ${color}33`,
      borderRadius: 3, padding: '2px 8px', letterSpacing: '0.08em', whiteSpace: 'nowrap'
    }}>
      {label}
    </span>
  );
}

function MetricBar({ value, color, max = 100 }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(100, (value / max) * 100)}%`,
        background: color, borderRadius: 2,
        boxShadow: `0 0 6px ${color}88`,
        transition: 'width 0.6s ease'
      }} />
    </div>
  );
}

function PulseDot({ color, animate = true }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <span style={{
        display: 'block', width: 8, height: 8, borderRadius: '50%',
        background: color, boxShadow: `0 0 6px ${color}`
      }} />
      {animate && (
        <span style={{
          position: 'absolute', top: 0, left: 0, width: 8, height: 8,
          borderRadius: '50%', background: color, opacity: 0.4,
          animation: 'pulse-glow 1.5s ease-in-out infinite'
        }} />
      )}
    </span>
  );
}

function SectionHeader({ title, subtitle, accent = '#00d4ff', right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 16, background: accent, borderRadius: 2 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.15em' }}>{title}</span>
        </div>
        {subtitle && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 3, paddingLeft: 11 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// ─── PANELS ────────────────────────────────────────────────────────────────

function TopBar({ currentTime, systemHealth }) {
  const healthColor = systemHealth === 'OPERATIONAL' ? '#00ff88' : systemHealth === 'DEGRADED' ? '#ffaa00' : '#ff2d55';
  return (
    <div style={{
      height: 52, background: 'linear-gradient(90deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)',
      borderBottom: '1px solid rgba(0,212,255,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, color: '#00d4ff', letterSpacing: '0.25em', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
          VAYUNTRA
        </div>
        <div style={{ width: 1, height: 20, background: 'rgba(0,212,255,0.15)' }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          ML-DRIVEN AUTONOMOUS ANOMALY DETECTION & REMEDIATION
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PulseDot color={healthColor} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: healthColor, letterSpacing: '0.1em' }}>{systemHealth}</span>
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(0,212,255,0.1)' }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{currentTime}</div>
        <div style={{ width: 1, height: 16, background: 'rgba(0,212,255,0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #0a1628, #00d4ff22)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00d4ff' }}>SA</span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>ANALYST</span>
        </div>
      </div>
    </div>
  );
}

function NavSidebar({ activePage, setActivePage }) {
  const navItems = [
    { id: 'overview', label: 'OVERVIEW', icon: '⬡' },
    { id: 'anomalies', label: 'ANOMALIES', icon: '◈' },
    { id: 'isolation', label: 'ISOLATION', icon: '⊗' },
    { id: 'compliance', label: 'COMPLIANCE', icon: '◫' },
    { id: 'telemetry', label: 'TELEMETRY', icon: '◎' },
  ];
  return (
    <div style={{
      width: 64, background: '#060d1a',
      borderRight: '1px solid rgba(0,212,255,0.08)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 16, gap: 4, flexShrink: 0
    }}>
      {navItems.map(item => {
        const active = activePage === item.id;
        return (
          <button key={item.id} onClick={() => setActivePage(item.id)} title={item.label}
            style={{
              width: 48, height: 48, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
              borderLeft: active ? '2px solid #00d4ff' : '2px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              transition: 'all 0.2s ease',
            }}>
            <span style={{ fontSize: 14, color: active ? '#00d4ff' : '#3d5a7a' }}>{item.icon}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 6, color: active ? '#00d4ff' : '#3d5a7a', letterSpacing: '0.08em' }}>
              {item.label.slice(0, 4)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OverviewPage({ stats, anomalies, liveMetric }) {
  const criticalCount = anomalies.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const riskColor = stats.riskScore > 70 ? '#ff2d55' : stats.riskScore > 40 ? '#ffaa00' : '#00ff88';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'auto auto 1fr', gap: 12, height: '100%' }}>
      {/* KPI Cards */}
      {[
        { label: 'RISK EXPOSURE', value: `${stats.riskScore}`, unit: '/100', color: riskColor, sub: 'Overall system risk score' },
        { label: 'MTTD', value: stats.mttd, unit: '', color: '#00d4ff', sub: 'Mean time to detect' },
        { label: 'MTTR', value: stats.mttr, unit: '', color: '#00d4ff', sub: 'Mean time to respond' },
        { label: 'ACTIVE THREATS', value: `${stats.threatsActive}`, unit: '', color: criticalCount > 0 ? '#ff2d55' : '#ffaa00', sub: `${stats.anomaliesToday} anomalies today` },
      ].map((kpi, i) => (
        <CyberCard key={i} glow={kpi.color === '#ff2d55' ? 'red' : 'cyan'} style={{ padding: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: 8 }}>{kpi.label}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: kpi.color, textShadow: `0 0 20px ${kpi.color}66` }}>{kpi.value}</span>
            {kpi.unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{kpi.unit}</span>}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{kpi.sub}</div>
        </CyberCard>
      ))}

      {/* Live Telemetry Spark */}
      <CyberCard style={{ gridColumn: '1 / 3', padding: 16 }} glow="cyan">
        <SectionHeader title="LIVE TELEMETRY" subtitle="Real-time system telemetry · 30m window" />
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TELEMETRY_TIMELINE} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.05)" />
              <XAxis dataKey="time" tick={{ fill: '#3d5a7a', fontSize: 9, fontFamily: 'Share Tech Mono' }} tickLine={false} />
              <YAxis tick={{ fill: '#3d5a7a', fontSize: 9, fontFamily: 'Share Tech Mono' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, fontFamily: 'Share Tech Mono', fontSize: 11 }} itemStyle={{ color: '#e2f0ff' }} labelStyle={{ color: '#00d4ff' }} />
              <Area type="monotone" dataKey="cpu" stroke="#00d4ff" strokeWidth={1.5} fill="url(#cpuGrad)" dot={false} name="CPU%" />
              <Area type="monotone" dataKey="memory" stroke="#00ff88" strokeWidth={1.5} fill="url(#memGrad)" dot={false} name="MEM%" />
              <ReferenceLine y={80} stroke="rgba(255,45,85,0.4)" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {[['CPU', liveMetric.cpu, '#00d4ff'], ['MEMORY', liveMetric.memory, '#00ff88'], ['NETWORK', liveMetric.network, '#ffaa00']].map(([label, val, color]) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color }}>{val.toFixed(1)}%</span>
              </div>
              <MetricBar value={val} color={color} />
            </div>
          ))}
        </div>
      </CyberCard>

      {/* System Asset Status */}
      <CyberCard style={{ gridColumn: '3 / 5', padding: 16 }}>
        <SectionHeader title="ASSET STATUS" subtitle={`${stats.assetsMonitored} assets monitored`} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { label: 'Assets Monitored', value: stats.assetsMonitored, color: '#00d4ff' },
            { label: 'Threats Contained', value: stats.threatsContained, color: '#00ff88' },
            { label: 'Isolations Today', value: stats.isolationsToday, color: '#ffaa00' },
            { label: 'System Uptime', value: stats.uptime, color: '#00ff88' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: 6, padding: '10px 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </CyberCard>

      {/* Recent Anomaly Feed (mini) */}
      <CyberCard style={{ gridColumn: '1 / 5', padding: 16, overflow: 'hidden' }}>
        <SectionHeader title="RECENT ANOMALY FEED" subtitle="Last 5 detection events" accent="#ff2d55"
          right={<StatusBadge label="LIVE" color="#ff2d55" bg="rgba(255,45,85,0.08)" />}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {anomalies.slice(0, 5).map(a => (
            <div key={a.id} style={{
              background: severityBg(a.severity),
              border: `1px solid ${severityColor(a.severity)}22`,
              borderRadius: 6, padding: '10px 12px',
              borderLeft: `3px solid ${severityColor(a.severity)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <StatusBadge label={a.severity} color={severityColor(a.severity)} bg={severityBg(a.severity)} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{timeAgo(a.timestamp)}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-primary)', marginBottom: 4 }}>{a.source}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{a.type}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: severityColor(a.severity), marginTop: 6, fontWeight: 600 }}>
                {a.confidence.toFixed(1)}% confidence
              </div>
            </div>
          ))}
        </div>
      </CyberCard>
    </div>
  );
}

function AnomalyPage({ anomalies }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 12, height: '100%' }}>
      <CyberCard style={{ padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <SectionHeader title="ANOMALY DETECTION LOG" subtitle={`${anomalies.length} events · Isolation Forest + Heuristic + Rule-Based`} accent="#ff2d55"
          right={<StatusBadge label="MONITORING ACTIVE" color="#00ff88" />}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['EVENT ID', 'TIMESTAMP', 'SEVERITY', 'SOURCE', 'TYPE', 'METHOD', 'CONFIDENCE', 'STATUS'].map(h => (
                  <th key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid rgba(0,212,255,0.08)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {anomalies.map(a => (
                <tr key={a.id} onClick={() => setSelected(a)}
                  style={{ cursor: 'pointer', background: selected?.id === a.id ? 'rgba(0,212,255,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00d4ff', padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)', whiteSpace: 'nowrap' }}>{timeAgo(a.timestamp)}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>
                    <StatusBadge label={a.severity} color={severityColor(a.severity)} bg={severityBg(a.severity)} />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)', padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.source}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.type}</td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>
                    <StatusBadge label={a.method} color="#7c3aed" bg="rgba(124,58,237,0.1)" />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: severityColor(a.severity), padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>
                    {a.confidence.toFixed(1)}%
                  </td>
                  <td style={{ padding: '8px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>
                    <StatusBadge label={a.status} color={statusColor(a.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>

      {/* Detail panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CyberCard style={{ padding: 16, flex: selected ? 1 : 'none' }} glow={selected ? (selected.severity === 'CRITICAL' ? 'red' : 'cyan') : 'cyan'}>
          <SectionHeader title="EVENT DETAIL" subtitle={selected ? selected.id : 'Select an event'} />
          {selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <StatusBadge label={selected.severity} color={severityColor(selected.severity)} bg={severityBg(selected.severity)} />
                <StatusBadge label={selected.status} color={statusColor(selected.status)} />
              </div>
              {[
                ['Source', selected.source],
                ['Type', selected.type],
                ['Method', selected.method],
                ['Control ID', selected.controlId],
                ['Score', selected.score.toFixed(6)],
                ['Confidence', `${selected.confidence.toFixed(1)}%`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,212,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>TELEMETRY SNAPSHOT</div>
                {[['CPU', selected.cpu, '#00d4ff'], ['MEMORY', selected.memory, '#00ff88'], ['NETWORK', selected.network, '#ffaa00']].map(([l, v, c]) => (
                  <div key={l} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{l}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: c }}>{v}%</span>
                    </div>
                    <MetricBar value={v} color={c} />
                  </div>
                ))}
              </div>
              {!selected.isolated && selected.status === 'ACTIVE' && (
                <div style={{ background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)', borderRadius: 6, padding: '10px 12px', marginTop: 4 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#ff2d55', marginBottom: 6, letterSpacing: '0.1em' }}>⚠ ISOLATION AVAILABLE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Asset not yet isolated. Recommend immediate containment.</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              ← Select an event to view details
            </div>
          )}
        </CyberCard>

        <CyberCard style={{ padding: 16 }}>
          <SectionHeader title="DETECTION METHODOLOGY" />
          {[
            { label: 'IsolationForest', count: anomalies.filter(a => a.method === 'IsolationForest').length, color: '#7c3aed' },
            { label: 'Rule-Based', count: anomalies.filter(a => a.method === 'Rule-Based').length, color: '#00d4ff' },
            { label: 'Heuristic', count: anomalies.filter(a => a.method === 'Heuristic').length, color: '#ffaa00' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <StatusBadge label={m.label} color={m.color} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: m.color }}>{m.count}</span>
            </div>
          ))}
        </CyberCard>
      </div>
    </div>
  );
}

function IsolationPage({ events }) {
  const [triggerResult, setTriggerResult] = useState(null);
  const [isTriggering, setIsTriggering] = useState(false);

  function simulateTrigger(action, target) {
    setIsTriggering(true);
    setTimeout(() => {
      setTriggerResult({ action, target, success: true, timestamp: new Date(), correlationId: Math.random().toString(36).slice(2, 18).toUpperCase() });
      setIsTriggering(false);
    }, 1200);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CyberCard style={{ padding: 16 }} glow="red">
          <SectionHeader title="CONTAINMENT CONSOLE" subtitle="Isolation & remediation workflow engine" accent="#ff2d55"
            right={<StatusBadge label="ISOLATION ENGINE ACTIVE" color="#00ff88" />}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { action: 'log_containment', label: 'LOG CONTAINMENT', icon: '◉', color: '#00d4ff', desc: 'Audit-only action. No system change.' },
              { action: 'terminate_process', label: 'TERMINATE PROCESS', icon: '⊗', color: '#ff2d55', desc: 'Terminate anomalous process. Requires target PID.' },
              { action: 'network_segment', label: 'NETWORK SEGMENT', icon: '⊟', color: '#ffaa00', desc: 'Isolate asset from network segment.' },
            ].map(a => (
              <button key={a.action} onClick={() => simulateTrigger(a.action, 'ENDPOINT-PROD-07')} disabled={isTriggering}
                style={{
                  background: `${a.color}0a`, border: `1px solid ${a.color}33`, borderRadius: 8, padding: '14px 12px',
                  cursor: isTriggering ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  opacity: isTriggering ? 0.5 : 1
                }}>
                <div style={{ fontSize: 20, color: a.color, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 700, color: a.color, letterSpacing: '0.1em', marginBottom: 6 }}>{a.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', lineHeight: 1.4 }}>{a.desc}</div>
              </button>
            ))}
          </div>
          {triggerResult && (
            <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 6, padding: '12px 14px', animation: 'fade-in-up 0.3s ease' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00ff88', marginBottom: 6, letterSpacing: '0.1em' }}>✓ ISOLATION ACTION EXECUTED</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {[['Action', triggerResult.action], ['Target', triggerResult.target], ['Correlation ID', triggerResult.correlationId], ['Timestamp', triggerResult.timestamp.toLocaleTimeString()]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)' }}>{k}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00d4ff' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {isTriggering && (
            <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00d4ff' }}>
              <span style={{ animation: 'blink 1s step-end infinite' }}>█</span> EXECUTING ISOLATION PROTOCOL...
            </div>
          )}
        </CyberCard>

        <CyberCard style={{ flex: 1, padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <SectionHeader title="ISOLATION EVENT HISTORY" subtitle="All containment actions are immutably logged" />
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {events.map(e => (
              <div key={e.id} style={{ borderBottom: '1px solid rgba(0,212,255,0.06)', padding: '12px 0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 6, padding: '8px 10px', minWidth: 80, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 700, color: '#00ff88' }}>{e.id}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>{timeAgo(e.timestamp)}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <StatusBadge label={e.action.toUpperCase().replace('_', ' ')} color="#00d4ff" />
                    <StatusBadge label={e.status} color={statusColor(e.status)} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-primary)', marginBottom: 4 }}>Target: {e.target}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Playbook: {e.playbook} · Operator: {e.operator}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#3d5a7a', marginTop: 4 }}>CID: {e.correlationId}</div>
                </div>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>

      {/* Remediation playbooks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CyberCard style={{ padding: 16 }}>
          <SectionHeader title="REMEDIATION PLAYBOOKS" subtitle="Active execution templates" />
          {[
            { id: 'PB-CONTAINMENT-001', name: 'Log & Monitor', status: 'READY', steps: 3, risk: 'LOW' },
            { id: 'PB-PROCESS-KILL-001', name: 'Process Termination', status: 'READY', steps: 5, risk: 'MEDIUM' },
            { id: 'PB-NETWORK-SEG-001', name: 'Network Isolation', status: 'ACTIVE', steps: 7, risk: 'HIGH' },
            { id: 'PB-FULL-QUARANTINE', name: 'Full Quarantine', status: 'STAGED', steps: 12, risk: 'CRITICAL' },
          ].map(p => (
            <div key={p.id} style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.07)', borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#00d4ff' }}>{p.id}</span>
                <StatusBadge label={p.status} color={statusColor(p.status)} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{p.steps} steps</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: severityColor(p.risk) }}>Risk: {p.risk}</span>
              </div>
            </div>
          ))}
        </CyberCard>

        <CyberCard style={{ padding: 16, flex: 1 }}>
          <SectionHeader title="ISOLATION POSTURE" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Assets Isolated', value: '1', color: '#ffaa00' },
              { label: 'Actions Today', value: '2', color: '#00d4ff' },
              { label: 'Successful', value: '2/2', color: '#00ff88' },
              { label: 'Pending Review', value: '1', color: '#ff2d55' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </CyberCard>
      </div>
    </div>
  );
}

function CompliancePage({ events, auditLog }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto 1fr', gap: 12, height: '100%' }}>
      <CyberCard style={{ padding: 16 }}>
        <SectionHeader title="POLICY MAPPING" subtitle="NIST 800-53 / SOC 2 control alignment" accent="#00ff88" />
        <div style={{ overflowY: 'auto', maxHeight: 280 }}>
          {events.map(e => (
            <div key={e.id} style={{ border: '1px solid rgba(0,212,255,0.08)', borderRadius: 6, padding: '10px 12px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <StatusBadge label={e.control} color="#00d4ff" bg="rgba(0,212,255,0.08)" />
                  <StatusBadge label={e.framework} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
                </div>
                <StatusBadge label={e.status} color={statusColor(e.status)} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-primary)', marginBottom: 4 }}>{e.description}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>Class: {e.incidentClass}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: e.auditLogged ? '#00ff88' : '#ff2d55' }}>
                  Audit Log: {e.auditLogged ? '✓ LOGGED' : '✗ PENDING'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CyberCard>

      <CyberCard style={{ padding: 16 }}>
        <SectionHeader title="COMPLIANCE POSTURE" subtitle="Control coverage summary" accent="#00ff88" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { framework: 'NIST 800-53', coverage: 78, controls: '10/13', color: '#00d4ff' },
            { framework: 'SOC 2', coverage: 65, controls: '5/8', color: '#00ff88' },
          ].map(f => (
            <div key={f.framework} style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 6 }}>{f.framework}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.coverage}%</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', marginBottom: 8 }}>{f.controls} controls implemented</div>
              <MetricBar value={f.coverage} color={f.color} />
            </div>
          ))}
        </div>
        <div>
          {[
            { id: 'SI-4', name: 'System Monitoring', status: '✅' },
            { id: 'AU-2', name: 'Audit Events', status: '✅' },
            { id: 'AC-6', name: 'Least Privilege', status: '🔜' },
            { id: 'SC-8', name: 'TLS Encryption', status: '🔜' },
            { id: 'IR-4', name: 'Incident Handling', status: '✅' },
          ].map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00d4ff', minWidth: 40 }}>{c.id}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{c.name}</span>
              </div>
              <span style={{ fontSize: 12 }}>{c.status}</span>
            </div>
          ))}
        </div>
      </CyberCard>

      <CyberCard style={{ gridColumn: '1 / 3', padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <SectionHeader title="AUDIT TRAIL" subtitle="Immutable event log · NIST AU-2 / SOC 2 CC7.2 aligned"
          right={<StatusBadge label="APPEND-ONLY" color="#00ff88" />}
        />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['AUDIT ID', 'TIMESTAMP', 'EVENT TYPE', 'USER', 'IP ADDRESS', 'CORRELATION ID'].map(h => (
                  <th key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid rgba(0,212,255,0.08)', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {auditLog.map(a => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00d4ff', padding: '7px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.id}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', padding: '7px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)', whiteSpace: 'nowrap' }}>{timeAgo(a.timestamp)}</td>
                  <td style={{ padding: '7px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>
                    <StatusBadge label={a.type} color={a.type.includes('DETECTED') ? '#ffaa00' : a.type.includes('TRIGGERED') ? '#ff2d55' : '#00ff88'} />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-secondary)', padding: '7px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.user}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', padding: '7px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.ip}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3d5a7a', padding: '7px 10px', borderBottom: '1px solid rgba(0,212,255,0.04)' }}>{a.correlationId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
}

function TelemetryPage({ timeline }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <CyberCard style={{ padding: 16, flex: 2 }}>
        <SectionHeader title="TELEMETRY TIMELINE" subtitle="30-minute behavioral baseline comparison · Anomaly events marked" />
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={timeline} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.06)" />
            <XAxis dataKey="time" tick={{ fill: '#3d5a7a', fontSize: 9, fontFamily: 'Share Tech Mono' }} tickLine={false} />
            <YAxis tick={{ fill: '#3d5a7a', fontSize: 9, fontFamily: 'Share Tech Mono' }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0a1628', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, fontFamily: 'Share Tech Mono', fontSize: 11 }} itemStyle={{ color: '#e2f0ff' }} labelStyle={{ color: '#00d4ff' }} />
            <ReferenceLine y={80} stroke="rgba(255,45,85,0.5)" strokeDasharray="6 3" label={{ value: 'ANOMALY THRESHOLD', position: 'right', fill: '#ff2d55', fontSize: 9, fontFamily: 'Share Tech Mono' }} />
            <Line type="monotone" dataKey="cpu" stroke="#00d4ff" strokeWidth={1.5} dot={false} name="CPU%" />
            <Line type="monotone" dataKey="memory" stroke="#00ff88" strokeWidth={1.5} dot={false} name="MEM%" />
            <Line type="monotone" dataKey="network" stroke="#ffaa00" strokeWidth={1.5} dot={false} name="NET%" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, marginTop: 8, paddingLeft: 12 }}>
          {[['CPU%', '#00d4ff'], ['MEM%', '#00ff88'], ['NET%', '#ffaa00'], ['Anomaly Threshold', '#ff2d55']].map(([l, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 2, background: c }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{l}</span>
            </div>
          ))}
        </div>
      </CyberCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, flex: 1 }}>
        {[
          { title: 'BEHAVIORAL BASELINE', items: [['CPU Baseline', '35-65%'], ['Memory Baseline', '50-75%'], ['Network Baseline', '15-55%'], ['Process Count', '80-120'], ['Baseline Window', '30 days']], color: '#00d4ff' },
          { title: 'MODEL PARAMETERS', items: [['Algorithm', 'Isolation Forest'], ['Contamination', '10%'], ['N Estimators', '200'], ['Random State', '42'], ['Training Samples', '550']], color: '#7c3aed' },
          { title: 'DETECTION THRESHOLDS', items: [['Anomaly Score', '< -0.1'], ['Confidence (LOW)', '< 30%'], ['Confidence (MED)', '30-60%'], ['Confidence (HIGH)', '60-80%'], ['Confidence (CRIT)', '> 80%']], color: '#ff2d55' },
        ].map(section => (
          <CyberCard key={section.title} style={{ padding: 16 }}>
            <SectionHeader title={section.title} accent={section.color} />
            {section.items.map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,212,255,0.05)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: section.color }}>{v}</span>
              </div>
            ))}
          </CyberCard>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [currentTime, setCurrentTime] = useState('');
  const [liveMetric, setLiveMetric] = useState({ cpu: 42, memory: 58, network: 27 });
  const [anomalies] = useState(ANOMALY_FEED);

  useEffect(() => {
    const tick = () => setCurrentTime(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    tick();
    const t1 = setInterval(tick, 1000);
    const t2 = setInterval(() => setLiveMetric(generateLiveMetric()), 2500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const pageMap = {
    overview: <OverviewPage stats={SYSTEM_STATS} anomalies={anomalies} liveMetric={liveMetric} />,
    anomalies: <AnomalyPage anomalies={anomalies} />,
    isolation: <IsolationPage events={ISOLATION_EVENTS} />,
    compliance: <CompliancePage events={COMPLIANCE_EVENTS} auditLog={AUDIT_LOG} />,
    telemetry: <TelemetryPage timeline={TELEMETRY_TIMELINE} />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>
      <TopBar currentTime={currentTime} systemHealth={SYSTEM_STATS.systemHealth} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NavSidebar activePage={activePage} setActivePage={setActivePage} />
        <main style={{ flex: 1, overflow: 'auto', padding: 16, background: 'var(--bg-void)' }}>
          {pageMap[activePage]}
        </main>
      </div>
      {/* Scan line overlay */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.008) 2px, rgba(0,212,255,0.008) 4px)', zIndex: 9999 }} />
    </div>
  );
}
