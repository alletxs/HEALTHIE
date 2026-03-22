import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: '⚡' },
    { name: 'Snap & Analyze', path: '/app/analyze', icon: '📸' },
    { name: 'History', path: '/app/history', icon: '📋' },
    { name: 'Analytics', path: '/app/analytics', icon: '📊' },
    { name: 'Insights', path: '/app/insights', icon: '🧠' }
  ];

  const currentPage = navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard';

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <span>🌿</span>Healthie
        </div>
        
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              <span className="ni">{item.icon}</span>
              {item.name}
            </NavLink>
          );
        })}

        <div className="sidebar-bottom">
          <div className="user-row" onClick={handleLogout} title="Click to logout">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="main">
        <div className="topbar">
          <div className="page-title">{currentPage}</div>
          <div className="greeting">Good morning, {user?.name?.split(' ')[0] || 'User'} 👋</div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
