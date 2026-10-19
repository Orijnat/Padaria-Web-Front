import React, { useRef, useEffect } from 'react';
export function Modal({ title, onClose, children }) {
    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    return (<div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(50,26,7,0.45)', backdropFilter: 'blur(2px)' }}>
      <div ref={ref} className="rounded-2xl shadow-2xl w-full overflow-y-auto" style={{ background: '#faf6f0', border: '1px solid #e9d0aa', maxWidth: 560, maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#e9d0aa' }}>
          <h2 className="font-display text-xl font-semibold italic" style={{ color: '#321a07' }}>
            {title}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-lg cursor-pointer transition-colors" style={{ color: '#a96e2c', background: '#f5e9d6' }} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>);
}
