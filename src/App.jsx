import React, { useState, useEffect, useCallback } from 'react';

function App() {
  const [images, setImages] = useState([]);
  const [colorElements, setColorElements] = useState([{ id: '1', name: 'Vestimenta', color: '#13a4ec' }]);
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

  const addColorElement = () => setColorElements(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), name: '', color: '#13a4ec' }]);
  const updateColorElement = (id, key, value) => setColorElements(prev => prev.map(el => el.id === id ? { ...el, [key]: value } : el));
  const removeColorElement = (id) => colorElements.length > 1 && setColorElements(prev => prev.filter(el => el.id !== id));

  const generate = useCallback(() => {
    const imgPrefix = images.length > 0 ? images.map((_, i) => `<URL_IMG_${i+1}> `).join('') : '';
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
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-[#101c22] text-slate-900 dark:text-white font-['Space_Grotesk'] pb-32">
      
      {/* Top AppBar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101c22]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#13a4ec]">bolt</span>
            <h2 className="text-lg font-bold tracking-tight">Refinador de Prompts</h2>
          </div>
          <button onClick={() => setPrompt({ ...prompt, subject: '' })} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#13a4ec] transition-colors">Reset</button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8">
        
        {/* Upload Section con Multi-referencia */}
        <section>
          <div className="grid grid-cols-4 gap-3 mb-4">
             {images.map((img, i) => (
               <div key={`img-${i}`} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group">
                  <img src={img} className="w-full h-full object-cover" alt="Ref" />
                  <button 
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <span className="material-symbols-outlined text-white">delete</span>
                  </button>
               </div>
             ))}
             {images.length < 3 && (
               <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-[#192b33] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#233c48] transition-all group">
                  <span className="material-symbols-outlined text-[#13a4ec] text-3xl group-hover:scale-110 transition-transform">upload_file</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
               </label>
             )}
          </div>
          {images.length === 0 && (
            <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">Sube hasta 3 imágenes de referencia</p>
          )}
        </section>

        {/* Sección 1: Definición */}
        <section>
          <h3 className="text-[#13a4ec] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">photo_camera</span> Definición
          </h3>
          <textarea 
            value={prompt.subject}
            onChange={(e) => updatePrompt('subject', e.target.value)}
            className="w-full rounded-2xl bg-white dark:bg-[#192b33] border border-slate-200 dark:border-[#325567] p-4 text-sm focus:ring-2 focus:ring-[#13a4ec] outline-none min-h-[120px] shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-[#92b7c9] resize-none"
            placeholder="Describe el objeto o sujeto principal en detalle..."
          />
        </section>

        {/* Sección 2: Apariencia y Colores */}
        <section>
          <h3 className="text-[#13a4ec] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">palette</span> Apariencia
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {skinPresets.map(preset => (
              <button 
                key={preset}
                onClick={() => updatePrompt('skin', preset)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${prompt.skin === preset ? 'bg-[#13a4ec]/10 border-[#13a4ec] text-[#13a4ec]' : 'bg-white dark:bg-[#192b33] border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-400'}`}
              >
                {preset}
              </button>
            ))}
          </div>
          
          <div className="p-5 rounded-[2rem] bg-slate-100 dark:bg-[#142329] border border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Colores Específicos</span>
              <button onClick={addColorElement} className="w-6 h-6 rounded-full bg-[#13a4ec] text-white flex items-center justify-center hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div className="space-y-2">
              {colorElements.map(el => (
                <div key={el.id} className="flex gap-2 items-center bg-white dark:bg-[#192b33] p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
                  <input value={el.name} onChange={e => updateColorElement(el.id, 'name', e.target.value)} className="flex-1 bg-transparent text-xs font-bold outline-none px-2" placeholder="Objeto..." />
                  <input type="color" value={el.color} onChange={e => updateColorElement(el.id, 'color', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                  <button onClick={() => removeColorElement(el.id)} className="text-slate-300 hover:text-red-500 px-1">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección 3: Plano (Aspect Ratio) */}
        <section>
          <h3 className="text-[#13a4ec] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">aspect_ratio</span> Plano (AR)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: '1:1', w: 'w-6', h: 'h-6' },
              { id: '16:9', w: 'w-10', h: 'h-6' },
              { id: '9:16', w: 'w-6', h: 'h-10' }
            ].map(ratio => (
              <button 
                key={ratio.id} 
                onClick={() => setAspectRatio(ratio.id)}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${aspectRatio === ratio.id ? 'border-[#13a4ec] bg-[#13a4ec]/5 text-[#13a4ec]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#192b33] text-slate-400 opacity-60 hover:opacity-100'}`}
              >
                <div className={`${ratio.w} ${ratio.h} border-2 border-current rounded-sm mb-2`} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{ratio.id}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Sección 4: Biometría */}
        <section>
          <h3 className="text-[#13a4ec] text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">accessibility_new</span> Biometría
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Postura</label>
              <div className="relative">
                <select value={prompt.posture} onChange={e => updatePrompt('posture', e.target.value)} className="w-full appearance-none rounded-xl bg-white dark:bg-[#192b33] border border-slate-200 dark:border-slate-700 p-3.5 text-xs font-bold focus:ring-2 focus:ring-[#13a4ec] outline-none cursor-pointer">
                  <option>Frontal</option><option>Perfil</option><option>Espalda</option><option>3/4</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Mirada</label>
              <div className="relative">
                <select value={prompt.expression} onChange={e => updatePrompt('expression', e.target.value)} className="w-full appearance-none rounded-xl bg-white dark:bg-[#192b33] border border-slate-200 dark:border-slate-700 p-3.5 text-xs font-bold focus:ring-2 focus:ring-[#13a4ec] outline-none cursor-pointer">
                  <option>A cámara</option><option>Al horizonte</option><option>Cerrada</option><option>Mirada baja</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Acción de Manos</label>
            <input 
              value={prompt.hands}
              onChange={e => updatePrompt('hands', e.target.value)}
              className="w-full rounded-xl bg-white dark:bg-[#192b33] border border-slate-200 dark:border-slate-700 p-3.5 text-xs font-bold outline-none focus:ring-2 focus:ring-[#13a4ec]" 
              placeholder="Ej: Sosteniendo un objeto, puños cerrados..."
            />
          </div>
        </section>

        {/* Sección 5: Composición */}
        <section>
          <h3 className="text-[#13a4ec] text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">layers</span> Composición
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Primer Plano</label>
                <input value={prompt.foreground} onChange={e => updatePrompt('foreground', e.target.value)} className="w-full rounded-xl bg-white dark:bg-[#192b33] border border-slate-200 dark:border-slate-700 p-3.5 text-xs font-bold outline-none" placeholder="Cerca..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1 tracking-widest">Fondo</label>
                <input value={prompt.background} onChange={e => updatePrompt('background', e.target.value)} className="w-full rounded-xl bg-white dark:bg-[#192b33] border border-slate-200 dark:border-slate-700 p-3.5 text-xs font-bold outline-none" placeholder="Lejos..." />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-1 tracking-widest">Iluminación</span>
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                  {['Natural', 'Chiaroscuro'].map(l => (
                    <button key={l} onClick={() => updatePrompt('lighting', l)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${prompt.lighting === l ? 'bg-white dark:bg-[#233c48] shadow-sm text-[#13a4ec]' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-1 tracking-widest">Lentes</span>
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                  {['35mm', '85mm'].map(o => (
                    <button key={o} onClick={() => updatePrompt('optics', o)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${prompt.optics === o ? 'bg-white dark:bg-[#233c48] shadow-sm text-[#13a4ec]' : 'text-slate-500 hover:text-slate-300'}`}>{o}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ÁREA DE PREVIEW */}
        <section className="mt-12 p-8 rounded-[2.5rem] bg-[#13a4ec]/5 border border-[#13a4ec]/20 shadow-inner">
          <div className="flex items-center justify-between mb-4 px-2">
             <div className="flex items-center gap-2 text-[#13a4ec] font-black text-[10px] uppercase tracking-[0.3em]">
                <span className="material-symbols-outlined text-sm">auto_fix_high</span> Preview
             </div>
             <div className="flex items-center gap-1.5 bg-[#13a4ec]/10 px-3 py-1 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-[#13a4ec] animate-pulse" />
               <span className="text-[8px] font-black text-[#13a4ec] uppercase tracking-tighter">Ready</span>
             </div>
          </div>
          <div className="bg-white dark:bg-[#0a1216] rounded-3xl p-6 border border-slate-200 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-[#92b7c9] leading-relaxed break-words shadow-inner min-h-[120px]">
            {generatedPrompt}
          </div>
        </section>

      </main>

      {/* Barra Inferior Fija */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#101c22]/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto">
          <button 
            onClick={copyToClipboard}
            className={`w-full h-14 rounded-2xl font-black text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-[#13a4ec] text-white shadow-[#13a4ec]/30'}`}
          >
            <span className="material-symbols-outlined">{copied ? 'done_all' : 'content_copy'}</span>
            {copied ? 'PROMPT COPIADO' : 'COPIAR PROMPT REFINADO'}
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;
