import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, MoreHorizontal, Upload, Camera, Palette, RectangleHorizontal,
  Accessibility, Layers, Sparkles, Copy, CheckCheck, Plus, Trash2, ChevronDown
} from 'lucide-react';

function App() {
  const [images, setImages] = useState([]);
  const [colorElements, setColorElements] = useState([{ id: '1', name: 'Casual shirt', color: '#22b8f0' }]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [copied, setCopied] = useState(false);

  const [prompt, setPrompt] = useState({
    subject_type: 'Professional',
    age_range: '30-35 years old',
    gender: 'Male',
    ethnicity: 'Undefined ethnicity',
    description: '',
    expression: 'Neutral confident',
    skin: 'Photorealistic skin, visible pores, subsurface scattering, natural imperfections',
    pose: 'Full frontal',
    hand_position: 'Relaxed at sides',
    shot_type: 'Medium shot',
    background: 'Cinematic urban environment',
    lighting_type: 'Natural',
    focal_length: '85',
    aperture: 'f/1.8'
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Estándares solicitados
  const shotTypes = ['Close-up', 'Medium shot', 'Full body', 'Bust shot'];
  const lightingTypes = ['Natural', 'Studio softbox', 'Rembrandt', 'Golden hour', 'Cinematic'];
  const focalLengths = ['35', '50', '85', '135'];
  const apertures = ['f/1.4', 'f/2.8', 'f/5.6'];
  const backgrounds = ['Solid color', 'Cinematic urban', 'Nature bokeh', 'Studio gradient', 'Abstract light'];
  const handPositions = ['Relaxed at sides', 'On hips', 'Crossed arms', 'One hand in pocket'];

  const updatePrompt = (key, value) => setPrompt(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages].slice(0, 3));
  };

  const addColorElement = () => setColorElements(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: '', color: '#22b8f0' }]);
  const updateColorElement = (id, key, value) => setColorElements(prev => prev.map(el => el.id === id ? { ...el, [key]: value } : el));
  const removeColorElement = (id) => colorElements.length > 1 && setColorElements(prev => prev.filter(el => el.id !== id));

  const generate = useCallback(() => {
    const imgPrefix = images.length > 0 ? images.map((_, i) => `<URL_IMG_${i + 1}> `).join('') : '';

    // Formatear ropa a partir de colorElements (usamos el primero como principal para el patrón)
    const activeColors = colorElements.filter(el => el.name.trim());
    const clothingStr = activeColors.length > 0
      ? `${activeColors[0].name}, color: ${activeColors[0].color} / matching tone, realistic fabric texture`
      : 'Professional attire, neutral tones, realistic fabric texture';

    const b1 = `[SUBJECT]: ${prompt.gender} ${prompt.subject_type}, ${prompt.age_range}, ${prompt.ethnicity}. ${prompt.description}`;
    const b2 = `[EXPRESSION]: ${prompt.expression}, natural and authentic`;
    const b3 = `[SKIN]: ${prompt.skin}`;
    const b4 = `[CLOTHING]: ${clothingStr}`;
    const b5 = `[BIOMETRICS]: Pose: ${prompt.pose}. Gaze: Direct eye contact with camera. Hands: ${prompt.hand_position}`;
    const b6 = `[FRAMING]: ${prompt.shot_type}. Background: ${prompt.background}, soft bokeh separation from subject`;
    const b7 = `[OPTICS]: ${prompt.lighting_type} lighting. Lens: ${prompt.focal_length}mm, ${prompt.aperture}, shallow depth of field`;
    const b8 = `[QUALITY]: 8K, ultra-detailed, cinematic render, award-winning photography, hyperrealistic`;

    return `${imgPrefix}${b1}\n${b2}\n${b3}\n${b4}\n${b5}\n${b6}\n${b7}\n${b8} --ar ${aspectRatio} --style raw`;
  }, [prompt, images, colorElements, aspectRatio]);

  useEffect(() => setGeneratedPrompt(generate()), [generate]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg font-sans pb-28 md:pb-8">

      {/* ═══════ HEADER ═══════ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-border">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all">
              <ChevronLeft size={18} />
            </button>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-text-primary">
              Refinador de Prompts <span className="text-accent ml-2 text-xs bg-accent-soft px-2 py-0.5 rounded-full uppercase tracking-tighter">Pro</span>
            </h1>
          </div>
          <button className="w-8 h-8 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* ═══════ MAIN LAYOUT ═══════ */}
      <div className="app-layout px-4 sm:px-6 pt-6">

        {/* ─── LEFT COLUMN: Controls ─── */}
        <div className="space-y-7 animate-fade-in">

          {/* ── Upload Section ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 xs:grid-cols-4 gap-3 mb-3">
                {images.map((img, i) => (
                  <div key={`img-${i}`} className="relative aspect-square rounded-2xl overflow-hidden border border-border group">
                    <img src={img} className="w-full h-full object-cover" alt="Ref" />
                    <button
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-danger/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
                    >
                      <Trash2 size={20} className="text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-border bg-bg-card flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent-soft transition-all">
                    <Plus size={24} className="text-text-muted" />
                    <input type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
                  </label>
                )}
              </div>
            ) : (
              <label className="upload-zone cursor-pointer">
                <div className="upload-icon-circle">
                  <Upload size={24} />
                </div>
                <span className="text-sm font-bold text-text-primary">Subir Imagen de Referencia</span>
                <span className="text-xs text-text-muted">JPG, PNG hasta 10MB</span>
                <input type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
              </label>
            )}
          </section>

          {/* ── Definición ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-label mb-3">
              <Camera size={14} /> Definición del Sujeto
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Género</label>
                <select value={prompt.gender} onChange={e => updatePrompt('gender', e.target.value)} className="input-field py-2">
                  <option>Male</option><option>Female</option><option>Non-binary</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Sujeto</label>
                <input value={prompt.subject_type} onChange={e => updatePrompt('subject_type', e.target.value)} className="input-field py-2" placeholder="Ej: Professional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Edad</label>
                <input value={prompt.age_range} onChange={e => updatePrompt('age_range', e.target.value)} className="input-field py-2" placeholder="Ej: 30-35 years old" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Etnia</label>
                <input value={prompt.ethnicity} onChange={e => updatePrompt('ethnicity', e.target.value)} className="input-field py-2" placeholder="Ej: Mediterranean" />
              </div>
            </div>
            <textarea
              value={prompt.description}
              onChange={(e) => updatePrompt('description', e.target.value)}
              className="input-field min-h-[80px] resize-none leading-relaxed"
              placeholder="Detalles adicionales del sujeto..."
            />
          </section>

          {/* ── Apariencia ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="section-label mb-3">
              <Palette size={14} /> Apariencia y Ropa
            </div>
            <div className="space-y-1.5 mb-5">
              <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Expresión</label>
              <input value={prompt.expression} onChange={e => updatePrompt('expression', e.target.value)} className="input-field py-2" placeholder="Ej: Neutral confident" />
            </div>

            {/* Vestimenta (ColorElements) */}
            <div className="glass-card p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.6rem] font-extrabold text-text-muted uppercase tracking-[0.18em]">
                  Vestimenta y Colores
                </span>
                <button
                  onClick={addColorElement}
                  className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-accent/20"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
              <div className="space-y-2">
                {colorElements.map(el => (
                  <div key={el.id} className="color-row">
                    <input
                      value={el.name}
                      onChange={e => updateColorElement(el.id, 'name', e.target.value)}
                      className="flex-1 bg-transparent text-xs font-bold text-text-primary outline-none px-1"
                      placeholder="Prenda..."
                    />
                    <input
                      type="color"
                      value={el.color}
                      onChange={e => updateColorElement(el.id, 'color', e.target.value)}
                    />
                    <button
                      onClick={() => removeColorElement(el.id)}
                      className="text-text-muted hover:text-danger transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Plano y Encuadre ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-label mb-3">
              <RectangleHorizontal size={14} /> Encuadre y AR
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Tipo de Toma</label>
                <div className="relative">
                  <select value={prompt.shot_type} onChange={e => updatePrompt('shot_type', e.target.value)} className="input-field appearance-none cursor-pointer pr-8 py-2">
                    {shotTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Formato (AR)</label>
                <div className="flex gap-1.5">
                  {['1:1', '16:9', '9:16'].map(r => (
                    <button key={r} onClick={() => setAspectRatio(r)} className={`flex-1 py-2 text-[10px] font-black rounded-lg border-2 transition-all ${aspectRatio === r ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-bg-card text-text-muted'}`}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Biometría ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="section-label mb-3">
              <Accessibility size={14} /> Biometría y Pose
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Postura</label>
                <input value={prompt.pose} onChange={e => updatePrompt('pose', e.target.value)} className="input-field py-2" placeholder="Ej: Full frontal" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Manos</label>
                <div className="relative">
                  <select value={prompt.hand_position} onChange={e => updatePrompt('hand_position', e.target.value)} className="input-field appearance-none cursor-pointer pr-8 py-2">
                    {handPositions.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Composición y Óptica ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="section-label mb-4">
              <Layers size={14} /> Óptica y Entorno
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Iluminación</span>
                  <div className="relative">
                    <select value={prompt.lighting_type} onChange={e => updatePrompt('lighting_type', e.target.value)} className="input-field appearance-none cursor-pointer pr-8 py-2">
                      {lightingTypes.map(l => <option key={l}>{l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Fondo</span>
                  <div className="relative">
                    <select value={prompt.background} onChange={e => updatePrompt('background', e.target.value)} className="input-field appearance-none cursor-pointer pr-8 py-2">
                      {backgrounds.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Lente (Focal)</span>
                  <div className="toggle-group">
                    {focalLengths.map(f => (
                      <button key={f} onClick={() => updatePrompt('focal_length', f)} className={`toggle-btn ${prompt.focal_length === f ? 'active' : ''}`}>{f}mm</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Apertura</span>
                  <div className="toggle-group">
                    {apertures.map(a => (
                      <button key={a} onClick={() => updatePrompt('aperture', a)} className={`toggle-btn ${prompt.aperture === a ? 'active' : ''}`}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ─── RIGHT COLUMN: Preview & Actions ─── */}
        <div className="hidden md:block">
          <div className="sticky top-20 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>

            {/* Preview Card */}
            <div className="preview-card">
              <div className="flex items-center justify-between mb-4">
                <div className="section-label">
                  <Sparkles size={14} /> Prompt Final
                </div>
                <div className="flex items-center gap-1.5 bg-accent-soft px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
                  <span className="text-[0.55rem] font-extrabold text-accent uppercase tracking-tight">Ready</span>
                </div>
              </div>
              <div className="preview-text-box font-mono text-[10px] whitespace-pre-wrap">
                {generatedPrompt || <span className="text-text-muted italic">Tu prompt aparecerá aquí...</span>}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`btn-accent ${copied ? 'success' : ''}`}
            >
              {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
              {copied ? 'PROMPT COPIADO' : 'COPIAR PROMPT REFINADO'}
            </button>

          </div>
        </div>

      </div>

      {/* ═══════ MOBILE BOTTOM BAR ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg/90 backdrop-blur-xl border-t border-border z-50 md:hidden">
        <button
          onClick={copyToClipboard}
          className={`btn-accent ${copied ? 'success' : ''}`}
        >
          {copied ? <CheckCheck size={18} /> : <Copy size={18} />}
          {copied ? 'COPIAR PROMPT REFINADO' : 'COPIAR PROMPT REFINADO'}
        </button>
      </div>

      {/* ═══════ MOBILE PREVIEW (collapsible) ═══════ */}
      <div className="px-4 sm:px-6 mt-6 mb-6 md:hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="preview-card">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label">
              <Sparkles size={14} /> Preview
            </div>
          </div>
          <div className="preview-text-box font-mono text-[10px] whitespace-pre-wrap">
            {generatedPrompt}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
