import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, MoreHorizontal, Upload, Camera, Palette, RectangleHorizontal,
  Accessibility, Layers, Sparkles, Copy, CheckCheck, Plus, Trash2, ChevronDown
} from 'lucide-react';

function App() {
  const [images, setImages] = useState([]);
  const [colorElements, setColorElements] = useState([{ id: '1', name: 'Vestimenta', color: '#22b8f0' }]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [copied, setCopied] = useState(false);

  const [prompt, setPrompt] = useState({
    subject: '',
    skin: 'Fotorealista',
    posture: 'Frontal',
    expression: 'A cámara',
    hands: '',
    foreground: '',
    background: '',
    lighting: 'Natural',
    optics: '85mm'
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const skinPresets = ['Fotorealista', 'Humedad', 'Estudio', 'Macro'];

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
    const colors = colorElements.filter(el => el.name.trim()).map(el => `${el.name} color ${el.color}`).join(', ');

    const b1 = `[DEFINICIÓN]: ${prompt.subject || 'Sujeto sin definir'}.`;
    const b2 = `[APARIENCIA]: Piel: ${prompt.skin}. Detalles: ${colors || 'Colores naturales'}.`;
    const b3 = `[BIOMETRÍA]: Postura: ${prompt.posture}. Mirada: ${prompt.expression}. Manos: ${prompt.hands || 'Posición neutra'}.`;
    const b4 = `[COMPOSICIÓN]: Primer Plano: ${prompt.foreground || 'N/A'}. Fondo: ${prompt.background || 'Entorno cinematográfico'}.`;
    const b5 = `[ÓPTICA]: Iluminación: ${prompt.lighting}. Lente: ${prompt.optics}.`;

    return `${imgPrefix}${b1} ${b2} ${b3} ${b4} ${b5} --ar ${aspectRatio}`;
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
              Refinador de Prompts
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
              <Camera size={14} /> Definición
            </div>
            <textarea
              value={prompt.subject}
              onChange={(e) => updatePrompt('subject', e.target.value)}
              className="input-field min-h-[120px] resize-none leading-relaxed"
              placeholder="Describe el objeto o sujeto principal en detalle..."
            />
          </section>

          {/* ── Apariencia ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="section-label mb-3">
              <Palette size={14} /> Apariencia
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {skinPresets.map(preset => (
                <button
                  key={preset}
                  onClick={() => updatePrompt('skin', preset)}
                  className={`chip ${prompt.skin === preset ? 'active' : ''}`}
                >
                  {prompt.skin === preset && <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5" />}
                  {preset}
                </button>
              ))}
            </div>

            {/* Color Elements */}
            <div className="glass-card p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.6rem] font-extrabold text-text-muted uppercase tracking-[0.18em]">
                  Colores Específicos
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
                      placeholder="Objeto..."
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

          {/* ── Plano (Aspect Ratio) ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-label mb-3">
              <RectangleHorizontal size={14} /> Plano
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: '1:1', w: 24, h: 24 },
                { id: '16:9', w: 36, h: 22 },
                { id: '9:16', w: 22, h: 36 }
              ].map(ratio => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`ratio-card ${aspectRatio === ratio.id ? 'active' : ''}`}
                >
                  <div
                    className="ratio-box"
                    style={{ width: `${ratio.w}px`, height: `${ratio.h}px` }}
                  />
                  <span className="ratio-label">{ratio.id}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Biometría ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="section-label mb-3">
              <Accessibility size={14} /> Biometría
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Postura */}
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Postura</label>
                <div className="relative">
                  <select
                    value={prompt.posture}
                    onChange={e => updatePrompt('posture', e.target.value)}
                    className="input-field appearance-none cursor-pointer pr-8"
                  >
                    <option>Frontal</option>
                    <option>Perfil</option>
                    <option>Espalda</option>
                    <option>3/4</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
              {/* Mirada */}
              <div className="space-y-1.5">
                <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Mirada</label>
                <div className="relative">
                  <select
                    value={prompt.expression}
                    onChange={e => updatePrompt('expression', e.target.value)}
                    className="input-field appearance-none cursor-pointer pr-8"
                  >
                    <option>A cámara</option>
                    <option>Al horizonte</option>
                    <option>Cerrada</option>
                    <option>Mirada baja</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Acción de Manos</label>
              <input
                value={prompt.hands}
                onChange={e => updatePrompt('hands', e.target.value)}
                className="input-field"
                placeholder="Ej: Sosteniendo un objeto, puños cerrados..."
              />
            </div>
          </section>

          {/* ── Refinar Prompt Button (mobile only) ── */}
          <div className="md:hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={copyToClipboard} className={`btn-accent ${copied ? 'success' : ''}`}>
              <Sparkles size={18} />
              Refinar Prompt
            </button>
          </div>

          {/* ── Composición ── */}
          <section className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="section-label mb-4">
              <Layers size={14} /> Composición
            </div>
            <div className="space-y-4">
              {/* Iluminación */}
              <div className="space-y-2">
                <span className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Iluminación</span>
                <div className="toggle-group">
                  {['Natural', 'Chiaroscuro'].map(l => (
                    <button
                      key={l}
                      onClick={() => updatePrompt('lighting', l)}
                      className={`toggle-btn ${prompt.lighting === l ? 'active' : ''}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              {/* Lentes */}
              <div className="space-y-2">
                <span className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Lentes</span>
                <div className="toggle-group">
                  {['35mm', '85mm'].map(o => (
                    <button
                      key={o}
                      onClick={() => updatePrompt('optics', o)}
                      className={`toggle-btn ${prompt.optics === o ? 'active' : ''}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              {/* Primer Plano & Fondo */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Primer Plano</label>
                  <input
                    value={prompt.foreground}
                    onChange={e => updatePrompt('foreground', e.target.value)}
                    className="input-field"
                    placeholder="Cerca..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.15em] pl-1">Fondo</label>
                  <input
                    value={prompt.background}
                    onChange={e => updatePrompt('background', e.target.value)}
                    className="input-field"
                    placeholder="Lejos..."
                  />
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
                  <Sparkles size={14} /> Preview
                </div>
                <div className="flex items-center gap-1.5 bg-accent-soft px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
                  <span className="text-[0.55rem] font-extrabold text-accent uppercase tracking-tight">Live</span>
                </div>
              </div>
              <div className="preview-text-box">
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
          {copied ? 'PROMPT COPIADO' : 'COPIAR PROMPT REFINADO'}
        </button>
      </div>

      {/* ═══════ MOBILE PREVIEW (collapsible) ═══════ */}
      <div className="px-4 sm:px-6 mt-6 mb-6 md:hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="preview-card">
          <div className="flex items-center justify-between mb-4">
            <div className="section-label">
              <Sparkles size={14} /> Preview
            </div>
            <div className="flex items-center gap-1.5 bg-accent-soft px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
              <span className="text-[0.55rem] font-extrabold text-accent uppercase tracking-tight">Live</span>
            </div>
          </div>
          <div className="preview-text-box">
            {generatedPrompt || <span className="text-text-muted italic">Tu prompt aparecerá aquí...</span>}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
