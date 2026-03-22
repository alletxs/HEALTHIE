import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('signin');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (tab) => {
    setAuthTab(tab);
    setShowAuth(true);
  };

  return (
    <div id="landing">
      {showAuth && <AuthModal initialTab={authTab} onClose={() => setShowAuth(false)} />}
      
      {/* NAVBAR */}
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <div className="logo" onClick={() => window.scrollTo(0,0)}>
            <span className="logo-icon">🌿</span>Healthie
          </div>
          <div className="nav-btns">
            <button onClick={() => openAuth('signin')} className="btn-ghost">Sign In</button>
            <button onClick={() => openAuth('signup')} className="btn-primary">Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="hero-content">
          <div className="eyebrow">✦ AI Vision · Zero Manual Entry · Gemini Powered</div>
          <h1>Stop Counting.<br/><em>Start Seeing.</em></h1>
          <p className="hero-sub">Upload a photo of your meal. Healthie's AI vision identifies every macro, analyzes your dietary patterns, and builds a personalized health intelligence report.</p>
          <div className="hero-ctas">
            <button onClick={() => openAuth('signup')} className="btn-primary btn-lg">Start Analyzing Free</button>
            <button className="btn-outline-lg" onClick={() => document.getElementById('how').scrollIntoView({behavior:'smooth'})}>See How It Works →</button>
          </div>
        </div>
      </section>

      {/* HERO MOCKUP FLOAT */}
      <div className="hero-mockup" style={{padding:'0 48px 0',maxWidth:'1100px',margin:'0 auto'}}>
        <div className="mockup-frame">
          <div className="mockup-topbar">
            <div className="dot r"></div><div className="dot y"></div><div className="dot g"></div>
            <span style={{fontSize:'12px',color:'var(--t3)',marginLeft:'8px'}}>Healthie Dashboard</span>
          </div>
          <div className="mockup-body">
            <div className="mock-left">
              <div className="mock-title">✦ Snap & Analyze</div>
              <div className="mock-upload">
                <div className="mock-upload-icon">📸</div>
                <p style={{fontSize:'14px',color:'var(--t2)',fontWeight:500}}>Drop your meal photo here</p>
                <p>or click to browse</p>
              </div>
              <div style={{width:'100%',background:'var(--grad)',borderRadius:'8px',padding:'12px',textAlign:'center',fontSize:'13px',fontWeight:500,marginTop:'14px'}}>Analyze with AI</div>
            </div>
            <div className="mock-right">
              <div className="mock-badge">✓ AI Analysis Complete</div>
              <div className="mock-food-name">Grilled Salmon Bowl</div>
              <div className="mock-chart-row">
                <div className="mock-donut"><span className="mock-cal">580</span></div>
                <div className="mock-legend-col" style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <span style={{fontSize:'11px',color:'var(--t2)'}}>▪ Carbs &nbsp;<b style={{color:'var(--s)'}}>45g</b></span>
                  <span style={{fontSize:'11px',color:'var(--t2)'}}>▪ Protein <b style={{color:'var(--g)'}}>42g</b></span>
                  <span style={{fontSize:'11px',color:'var(--t2)'}}>▪ Fats &nbsp;&nbsp;<b style={{color:'var(--a)'}}>22g</b></span>
                </div>
              </div>
              <div className="mock-pills">
                <span className="mock-pill"><span className="mock-pill-dot" style={{background:'var(--g)'}}></span>Protein <b style={{marginLeft:'4px',fontFamily:'"JetBrains Mono",monospace',fontSize:'11px'}}>42g</b></span>
                <span className="mock-pill"><span className="mock-pill-dot" style={{background:'var(--s)'}}></span>Carbs <b style={{marginLeft:'4px',fontFamily:'"JetBrains Mono",monospace',fontSize:'11px'}}>45g</b></span>
                <span className="mock-pill"><span className="mock-pill-dot" style={{background:'var(--a)'}}></span>Fats <b style={{marginLeft:'4px',fontFamily:'"JetBrains Mono",monospace',fontSize:'11px'}}>22g</b></span>
                <span className="mock-pill"><span className="mock-pill-dot" style={{background:'var(--v)'}}></span>Fiber <b style={{marginLeft:'4px',fontFamily:'"JetBrains Mono",monospace',fontSize:'11px'}}>8g</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee-strip" style={{marginTop:'64px'}}>
        <div className="marquee-inner">
          <span className="marquee-item">7 Nutritional Metrics<span className="marquee-sep"></span></span>
          <span className="marquee-item">Gemini AI Vision<span className="marquee-sep"></span></span>
          <span className="marquee-item">Real-Time Analysis<span className="marquee-sep"></span></span>
          <span className="marquee-item">Trend Analytics<span className="marquee-sep"></span></span>
          <span className="marquee-item">Personal Health Reports<span className="marquee-sep"></span></span>
          <span className="marquee-item">Zero Manual Entry<span className="marquee-sep"></span></span>
          <span className="marquee-item">Macro Doughnut Charts<span className="marquee-sep"></span></span>
          <span className="marquee-item">Meal History Logs<span className="marquee-sep"></span></span>
          <span className="marquee-item">7 Nutritional Metrics<span className="marquee-sep"></span></span>
          <span className="marquee-item">Gemini AI Vision<span className="marquee-sep"></span></span>
          <span className="marquee-item">Real-Time Analysis<span className="marquee-sep"></span></span>
          <span className="marquee-item">Trend Analytics<span className="marquee-sep"></span></span>
          <span className="marquee-item">Personal Health Reports<span className="marquee-sep"></span></span>
          <span className="marquee-item">Zero Manual Entry<span className="marquee-sep"></span></span>
          <span className="marquee-item">Macro Doughnut Charts<span className="marquee-sep"></span></span>
          <span className="marquee-item">Meal History Logs<span className="marquee-sep"></span></span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{padding:'100px 48px',maxWidth:'1280px',margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:'56px'}}>
          <div className="sec-label">How It Works</div>
          <div className="sec-title" style={{textAlign:'center'}}>From Photo to Insight<br/>in Seconds</div>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01 — CAPTURE</div>
            <div className="step-icon">📸</div>
            <h3>Snap Your Meal</h3>
            <p>Upload any food photo from your device. No labels, no barcodes — just a picture.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02 — ANALYZE</div>
            <div className="step-icon">✨</div>
            <h3>AI Analyzes Instantly</h3>
            <p>Gemini Vision identifies every ingredient, calculates 7 key nutritional metrics, and generates expert commentary.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03 — EVOLVE</div>
            <div className="step-icon">📈</div>
            <h3>Track Your Progress</h3>
            <p>Insights compound over time. Charts, trends, and a personal health report evolve with every meal you log.</p>
          </div>
        </div>
      </div>

      {/* CTA BAND */}
      <div className="cta-band">
        <h2>Ready to Eat <em style={{fontStyle:'normal',background:'var(--grad)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent', color:'transparent'}}>Smarter?</em></h2>
        <p>No credit card. No manual entry. Just your camera.</p>
        <div className="cta-row">
          <button onClick={() => openAuth('signup')} className="btn-primary btn-lg">Create Free Account</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{padding:'32px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:'1280px',margin:'0 auto'}}>
        <div className="logo">🌿 Healthie</div>
        <p style={{fontSize:'13px',color:'var(--t3)'}}>© 2025 Healthie. All rights reserved.</p>
      </footer>
    </div>
  );
}
