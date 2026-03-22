import React, { useState, useEffect } from 'react';
import { insightsAPI } from '../api/client';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

export default function Insights() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const { showToast } = useToast();

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await insightsAPI.get();
      setReport(res.data.report);
      setFetched(true);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="page-insights">
      <div className="insights-header">
        <div>
          <div className="insights-title">🧠 Personal Health Intelligence Report</div>
          <div className="insights-sub">Generated from your recent eating patterns</div>
        </div>
        {(report || fetched) && (
          <button onClick={generateReport} disabled={loading} className="regen-btn" style={{ opacity: loading ? 0.5 : 1 }}>
            ↻ Regenerate Report
          </button>
        )}
      </div>

      {!report && !loading ? (
        <div className="report-card" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px', opacity: 0.5 }}>🧠</div>
          <div style={{ color: 'var(--t2)', fontSize: '16px', marginBottom: '32px' }}>Get an AI-generated analysis of your eating patterns and health trends.</div>
          <button onClick={generateReport} className="btn-primary">Generate My Report</button>
        </div>
      ) : loading ? (
        <div className="report-card">
          <div style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--t2)', fontSize: '14px' }}>Healthie AI is reading your patterns…</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SkeletonLoader height="120px" borderRadius="8px" />
            <SkeletonLoader height="120px" borderRadius="8px" />
            <SkeletonLoader height="120px" borderRadius="8px" />
          </div>
        </div>
      ) : report ? (
        <>
          <div className="report-card" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
            <div className="report-section">
              <div className="report-sec-title">🔍 Your Dietary Patterns</div>
              <div className="report-sec-body">{report.dietary_patterns}</div>
            </div>
            <div className="report-section">
              <div className="report-sec-title">💪 Nutritional Strengths</div>
              <div className="report-sec-body">{report.strengths}</div>
            </div>
            <div className="report-section">
              <div className="report-sec-title">⚠️ Areas to Improve</div>
              <div className="report-sec-body">{report.improvements}</div>
            </div>
            <div className="report-section">
              <div className="report-sec-title">📅 Long-Term Outlook</div>
              <div className="report-sec-body">{report.outlook}</div>
            </div>
            <div className="report-section">
              <div className="report-sec-title">🎯 Personalized Recommendations</div>
              <ul className="report-sec-body" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {report.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          </div>

          <div className="insights-metrics">
            <div className="ins-metric">
              <div className="ins-metric-val">{report.metrics?.avg_daily_calories ?? '—'}</div>
              <div className="ins-metric-label">Avg Caloric Balance (kcal)</div>
            </div>
            <div className="ins-metric">
              <div className="ins-metric-val" style={{ color: 'var(--g)' }}>{report.metrics?.protein_consistency ?? '—'}%</div>
              <div className="ins-metric-label">Protein Consistency Score</div>
            </div>
            <div className="ins-metric">
              <div className="ins-metric-val" style={{ color: 'var(--s)' }}>{report.metrics?.diet_diversity ?? '—'}</div>
              <div className="ins-metric-label">Diet Diversity Index</div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
