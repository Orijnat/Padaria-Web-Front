import React from 'react';
export function StockBar({ atual, minimo }) {
    const safeMin = minimo <= 0 ? 1 : minimo;
    const pct = Math.min((atual / (safeMin * 3)) * 100, 100);
    const low = atual <= minimo;
    return (<div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#e9d0aa' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: low ? '#c0392b' : '#3d7a4a' }}/>
      </div>
      <span className="font-mono-data text-xs" style={{ color: low ? '#c0392b' : '#6b3d16' }}>
        {atual}
      </span>
    </div>);
}
