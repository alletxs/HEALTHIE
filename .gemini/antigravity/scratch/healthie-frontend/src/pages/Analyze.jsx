import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeAPI, mealsAPI } from '../api/client';
import { useToast } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';
import MacroDonut from '../components/MacroDonut';

export default function Analyze() {
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
  };

  const processFile = (file) => {
    if (!file.type.match('image.*')) return showToast('Please select an image file', 'error');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageFile(file);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeMeal = async () => {
    if (!imagePreview) return;
    setAnalyzing(true);
    try {
      const res = await analyzeAPI.analyzeImage(imagePreview);
      setResult(res.data.data);
      showToast('Analysis complete!', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await mealsAPI.save({
        food_name: result.food_name,
        nutrition: result.nutrition,
        commentary: result.commentary,
        image_data_url: imagePreview
      });
      showToast('Meal saved successfully', 'success');
      navigate('/app/history');
    } catch (err) {
      showToast('Failed to save meal', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetUpload = () => {
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
  };

  return (
    <div className="analyze-panel">
      {/* Upload Side */}
      <div className="upload-side">
        <div className="panel-heading"><span className="spark">✦</span>Upload Meal Photo</div>
        <div
          className={`upload-zone ${dragActive ? 'drag' : ''}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => !imagePreview && inputRef.current?.click()}
          style={{ cursor: imagePreview ? 'default' : 'pointer' }}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
          
          {imagePreview ? (
            <img src={imagePreview} id="previewImg" className="preview-img" style={{ display: 'block' }} alt="Preview" />
          ) : (
            <div id="uploadPlaceholder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', pointerEvents: 'none' }}>
              <div className="upload-icon-box">📸</div>
              <div className="upload-main-text">Drop your meal photo here</div>
              <div className="upload-sub-text">or click to browse · JPG, PNG, WEBP</div>
            </div>
          )}
        </div>
        
        {imagePreview && (
          <button className="reupload-btn" style={{ display: 'block' }} onClick={resetUpload}>↺ Use Different Photo</button>
        )}
        
        <button
          className="analyze-btn"
          disabled={!imagePreview || analyzing}
          onClick={analyzeMeal}
        >
          {analyzing ? (
            <><div className="spinner"></div> Gemini is analyzing…</>
          ) : 'Analyze with AI'}
        </button>
      </div>

      {/* Result Side */}
      <div className="result-side" id="resultSide">
        {!result && !analyzing ? (
          <div id="resultEmpty" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <div className="empty-title">No analysis yet</div>
              <div className="empty-sub">Upload a meal photo and hit<br/>Analyze with AI to get started.</div>
            </div>
          </div>
        ) : analyzing ? (
          <div id="resultLoading" style={{ padding: '20px' }}>
            <div className="skeleton" style={{ height: '22px', width: '140px', marginBottom: '16px' }}></div>
            <div className="skeleton" style={{ height: '32px', width: '220px', marginBottom: '24px' }}></div>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }}></div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ height: '14px', width: '100%' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '80%' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '90%' }}></div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--t3)', textAlign: 'center', padding: '8px 0' }}>Gemini AI is analyzing your meal…</div>
          </div>
        ) : result ? (
          <div id="resultContent" style={{ animation: 'fadeUp 0.4s ease forwards' }}>
            <div className="result-badge">✓ AI Analysis Complete</div>
            <div className="food-name">{result.food_name}</div>
            
            <div className="chart-row">
              <div className="donut-wrap">
                <MacroDonut
                  calories={result.nutrition.calories}
                  protein_g={result.nutrition.protein_g}
                  carbs_g={result.nutrition.carbs_g}
                  fats_g={result.nutrition.fats_g}
                />
              </div>
              <div className="macro-legend" id="macroLegend">
                <div className="legend-item"><span className="legend-dot" style={{ background: '#00d4ff' }}></span><span className="legend-label">Carbohydrates</span><span className="legend-val">{result.nutrition.carbs_g}g</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#00c98d' }}></span><span className="legend-label">Protein</span><span className="legend-val">{result.nutrition.protein_g}g</span></div>
                <div className="legend-item"><span className="legend-dot" style={{ background: '#f5a623' }}></span><span className="legend-label">Fats</span><span className="legend-val">{result.nutrition.fats_g}g</span></div>
              </div>
            </div>

            <div className="pills-row">
              <div className="pill"><span className="pill-dot" style={{ background: '#00c98d' }}></span><span className="pill-label">Protein</span><span className="pill-val">{result.nutrition.protein_g}g</span></div>
              <div className="pill"><span className="pill-dot" style={{ background: '#00d4ff' }}></span><span className="pill-label">Carbs</span><span className="pill-val">{result.nutrition.carbs_g}g</span></div>
              <div className="pill"><span className="pill-dot" style={{ background: '#f5a623' }}></span><span className="pill-label">Fats</span><span className="pill-val">{result.nutrition.fats_g}g</span></div>
              <div className="pill"><span className="pill-dot" style={{ background: '#a78bfa' }}></span><span className="pill-label">Fiber</span><span className="pill-val">{result.nutrition.fiber_g}g</span></div>
              <div className="pill"><span className="pill-dot" style={{ background: '#ff4d6d' }}></span><span className="pill-label">Sugar</span><span className="pill-val">{result.nutrition.sugar_g}g</span></div>
              <div className="pill"><span className="pill-dot" style={{ background: '#8a8fa8' }}></span><span className="pill-label">Sodium</span><span className="pill-val">{result.nutrition.sodium_mg}mg</span></div>
            </div>

            <div className="commentary">
              <CommentItem icon="⚡" title="Immediate Impact" text={result.commentary.immediate_health_impact} defaultOpen />
              <CommentItem icon="🎯" title="Dietary Fit" text={result.commentary.dietary_fit} />
              <CommentItem icon="💡" title="Pro Tips" text={result.commentary.pro_tips} />
            </div>

            <div className="result-actions">
              <button className="btn-save" disabled={saving} onClick={saveMeal}>
                {saving ? 'Saving...' : '💾 Save to History'}
              </button>
              <button className="btn-discard" onClick={resetUpload}>Discard</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CommentItem({ icon, title, text, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="comment-item">
      <div className={`comment-header ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span>{icon} {title}</span>
        <span className="arr">▼</span>
      </div>
      <div className={`comment-body ${open ? 'open' : ''}`}>
        <p>{text}</p>
      </div>
    </div>
  );
}
