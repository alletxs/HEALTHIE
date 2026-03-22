import React, { useState, useEffect } from 'react';
import { mealsAPI } from '../api/client';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import SkeletonLoader from '../components/SkeletonLoader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const tooltipDefaults = {
  backgroundColor: 'rgba(20,21,30,.95)',
  borderColor: 'rgba(255,255,255,.1)',
  borderWidth: 1,
  titleColor: '#f0f0f5',
  bodyColor: '#8a8fa8',
  padding: 10,
};

const scaleDefaults = {
  x: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8a8fa8' } },
  y: { grid: { color: 'rgba(255,255,255,.04)' }, ticks: { color: '#8a8fa8' } },
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    mealsAPI.analytics(days).then(res => setData(res.data)).finally(() => setLoading(false));
  }, [days]);

  const labels = data?.daily?.map(d => new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })) ?? [];

  const getGrad = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 220);
    g.addColorStop(0, 'rgba(99,91,255,.35)');
    g.addColorStop(1, 'rgba(99,91,255,0)');
    return g;
  };

  const lineData = data ? {
    labels,
    datasets: [{
      label: 'Calories',
      data: data.daily.map(d => d.calories),
      borderColor: '#635bff',
      backgroundColor: getGrad(),
      borderWidth: 2.5,
      pointBackgroundColor: '#635bff',
      pointRadius: 4,
      tension: .4,
      fill: true
    }]
  } : null;

  const barData = data ? {
    labels,
    datasets: [
      { label: 'Protein',  data: data.daily.map(d => d.protein), backgroundColor: 'rgba(0,201,141,.7)',  borderRadius: 4, stack: 'a' },
      { label: 'Carbs',    data: data.daily.map(d => d.carbs),   backgroundColor: 'rgba(0,212,255,.5)',  borderRadius: 4, stack: 'a' },
      { label: 'Fats',     data: data.daily.map(d => d.fats),    backgroundColor: 'rgba(245,166,35,.6)', borderRadius: 4, stack: 'a' },
    ]
  } : null;

  const highestProtein = data?.daily?.length > 0 ? Math.max(...data.daily.map(d => d.protein)) : 0;

  return (
    <div id="page-analytics">
      <div className="period-tabs">
        {[7, 30, 90].map(d => (
          <div key={d} onClick={() => setDays(d)} className={`period-tab ${days === d ? 'active' : ''}`}>{d} Days</div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SkeletonLoader height="280px" borderRadius="16px" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <SkeletonLoader height="240px" borderRadius="16px" />
            <SkeletonLoader height="240px" borderRadius="16px" />
          </div>
        </div>
      ) : data?.daily?.length < 3 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">Not enough data</div>
          <div className="empty-sub">Log at least 3 days of meals to view trend analytics.</div>
        </div>
      ) : (
        <>
          <div className="analytics-grid">
            <div className="chart-card full">
              <div className="chart-title">Calorie Trend</div>
              <div className="chart-sub">Daily calorie intake over time</div>
              <canvas id="calTrendChart" style={{ display: 'none' }}></canvas>
              <div style={{ maxHeight: '220px' }}>
                <Line data={lineData} options={{ responsive: true, plugins: { legend: { display: false }, tooltip: tooltipDefaults }, scales: scaleDefaults }} />
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-title">Macro Distribution</div>
              <div className="chart-sub">Average macros per day</div>
              <div style={{ maxHeight: '200px' }}>
                <Bar data={barData} options={{ responsive: true, plugins: { legend: { labels: { color: '#8a8fa8', font: { size: 12 } }, position: 'bottom' }, tooltip: tooltipDefaults }, scales: { x: { ...scaleDefaults.x, stacked: true }, y: { ...scaleDefaults.y, stacked: true } } }} />
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-title">Summary Stats</div>
              <div className="chart-sub">Your period at a glance</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--t2)', fontSize: '13px' }}>Avg Daily Calories</span>
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '14px', color: 'var(--p)' }}>{Math.round(data.avg_daily_calories)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--t2)', fontSize: '13px' }}>Total Meals</span>
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '14px', color: 'var(--g)' }}>{data.total_meals}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--t2)', fontSize: '13px' }}>Days Tracked</span>
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '14px', color: 'var(--s)' }}>{data.days_tracked}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--t2)', fontSize: '13px' }}>Top Protein Day</span>
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: '14px', color: 'var(--a)' }}>{Math.round(highestProtein)}g</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
