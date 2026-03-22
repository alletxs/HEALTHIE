import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, initialTab = 'signin' }) {
  const [isLogin, setIsLogin] = useState(initialTab === 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/app/dashboard');
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 4) score += 1;
    if (pw.length >= 8 && /[A-Z]/.test(pw)) score += 1;
    if (pw.length >= 10 && /[A-Z]/.test(pw) && /[0-9!@#$%]/.test(pw)) score += 1;
    return score;
  };

  const strength = getStrength(password);

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div className="modal-card">
        {onClose && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-24px', position: 'relative', zIndex: 10 }}>
            <button onClick={onClose} style={{ color: '#8a8fa8', fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <div className="modal-logo">🌿</div>
        <div className="modal-heading">Welcome to Healthie</div>
        
        <div className="tab-row">
          <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>Sign In</button>
          <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>Create Account</button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" placeholder={isLogin ? "••••••••" : "Create a strong password"} value={password} onChange={e => setPassword(e.target.value)} required />
            {!isLogin && password.length > 0 && (
              <div className="pw-strength">
                <div className={`pw-bar ${strength >= 1 ? 's1' : ''}`} />
                <div className={`pw-bar ${strength >= 2 ? 's2' : ''}`} />
                <div className={`pw-bar ${strength >= 3 ? 's3' : ''}`} />
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" placeholder="Repeat your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          {isLogin && <div className="forgot">Forgot password?</div>}

          {error && <div style={{ color: 'var(--r)', fontSize: '14px', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}

          <button type="submit" disabled={isLoading} className="modal-submit" style={{ opacity: isLoading ? 0.7 : 1 }}>
            {isLoading ? 'Loading...' : (isLogin ? 'Sign In to Healthie' : 'Create My Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
