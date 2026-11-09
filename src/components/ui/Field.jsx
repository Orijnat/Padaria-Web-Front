import React from 'react';
export function Field({ label, hint, children }) {
    return (<div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="text-sm font-medium" style={{ color: '#6b3d16' }}>
          {label}
        </label>
        {hint && (<span className="text-xs" style={{ color: '#c48d4a' }}>
            {hint}
          </span>)}
      </div>
      {children}
    </div>);
}
