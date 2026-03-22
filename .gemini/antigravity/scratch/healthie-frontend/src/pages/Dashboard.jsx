import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mealsAPI } from '../api/client';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mealsAPI.analytics(7).then(res => {
      setData(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-section active" id="page-dash">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Calories Today</div>
          <div className="stat-val">{data ? Math.round(data.avg_daily_calories) : '—'}</div>
          <div className="stat-change up">↑ Trending</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-label">Meals Tracked</div>
          <div className="stat-val">{data ? data.total_meals : '—'}</div>
          <div className="stat-change">Total logged</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Days Active</div>
          <div className="stat-val">{data ? data.days_tracked : '—'}</div>
          <div className="stat-change up">↑ Consistent</div>
        </div>
        <div className="stat-card" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'140px'}}>
          <button onClick={() => navigate('/app/analytics')} className="btn-ghost" style={{padding:'8px 16px', fontSize:'12px'}}>View Analytics →</button>
        </div>
      </div>
      
      <div style={{background:'linear-gradient(135deg,rgba(99,91,255,.1),rgba(0,212,255,.05))',border:'1px solid rgba(99,91,255,.2)',borderRadius:'14px',padding:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
        <div>
          <div style={{fontFamily:'"Syne",sans-serif',fontSize:'16px',fontWeight:700,marginBottom:'4px'}}>Ready to log your next meal?</div>
          <div style={{fontSize:'13px',color:'var(--t2)'}}>Upload a photo and let Gemini AI do the work.</div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/app/analyze')} style={{padding:'12px 24px',fontSize:'14px'}}>📸 Snap & Analyze</button>
      </div>
    </div>
  );
}
