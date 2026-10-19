import React from 'react';
export function FormSection({ title, icon, children }) {
    return (<div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
      <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid #f2ead8' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#6b3d16' }}>
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>);
}
