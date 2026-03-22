import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealsAPI } from '../api/client';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

export default function History() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Time');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await mealsAPI.history();
      setMeals(res.data.meals);
    } catch (err) {
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await mealsAPI.delete(id);
      setMeals(prev => prev.filter(m => m.id !== id));
      showToast('Meal deleted', 'success');
    } catch (err) {
      showToast('Failed to delete meal', 'error');
    }
  };

  const filteredMeals = meals.filter(meal => {
    if (filter === 'All Time') return true;
    const mealDate = new Date(meal.logged_at);
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today - mealDate) / (1000 * 60 * 60 * 24));
    if (filter === 'Today') return diffDays <= 1;
    if (filter === 'This Week') return diffDays <= 7;
    if (filter === 'This Month') return diffDays <= 30;
    return true;
  });

  const grouped = filteredMeals.reduce((acc, meal) => {
    const date = new Date(meal.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const yesterdayStr = new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let key = date;
    if (date === todayStr) key = 'Today';
    else if (date === yesterdayStr) key = 'Yesterday';
    if (!acc[key]) acc[key] = [];
    acc[key].push(meal);
    return acc;
  }, {});

  return (
    <div id="page-history">
      <div className="history-header">
        <div className="filter-chips">
          {['Today', 'This Week', 'This Month', 'All Time'].map(f => (
            <div key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? 'active' : ''}`}>{f}</div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3,4].map(i => <SkeletonLoader key={i} height="80px" borderRadius="12px" />)}
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">No meals logged yet</div>
          <div className="empty-sub">Head to Snap & Analyze to log your first meal.</div>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="date-sep">{date}</div>
            <div className="meal-list">
              {items.map(meal => (
                <div key={meal.id} className="meal-card">
                  <div className="meal-thumb">
                    {meal.image_data_url
                      ? <img src={meal.image_data_url} alt={meal.food_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                      : '🥗'}
                  </div>
                  <div className="meal-info">
                    <div className="meal-name">{meal.food_name}</div>
                    <div className="meal-time">{new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="meal-macros">
                      <span className="macro-badge">Protein {meal.protein_g}g</span>
                      <span className="macro-badge">Carbs {meal.carbs_g}g</span>
                      <span className="macro-badge">Fats {meal.fats_g}g</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="meal-cal">{Math.round(meal.calories)}</div>
                    <div className="meal-cal-unit">kcal</div>
                    <button onClick={(e) => handleDelete(meal.id, e)} className="btn-discard" style={{ padding: '5px 10px', marginTop: '8px', fontSize: '12px' }} title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
