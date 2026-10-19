import React from 'react';
export function CadHeader({ title, subtitle, onVoltar, voltar }) {
    return (<div className="mb-8">
      <button onClick={onVoltar} className="flex items-center gap-1.5 text-sm mb-5 group cursor-pointer" style={{ color: '#a96e2c' }}>
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        Voltar para {voltar}
      </button>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: '#f5e9d6', color: '#6b3d16' }}>
          {title[0]}
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            {title}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#a96e2c' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>);
}
