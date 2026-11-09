import React from 'react';
export function FormActions({ onCancel, label = 'Salvar Cadastro' }) {
    return (<div className="flex gap-3 items-center pt-2">
      <button type="submit" className="px-7 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all" style={{ background: '#8a5420', color: '#faf6f0' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#6b3d16')} onMouseLeave={(e) => (e.currentTarget.style.background = '#8a5420')}>
        {label}
      </button>
      <button type="button" onClick={onCancel} className="px-7 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all" style={{ background: '#f5e9d6', color: '#6b3d16' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#e9d0aa')} onMouseLeave={(e) => (e.currentTarget.style.background = '#f5e9d6')}>
        Cancelar
      </button>
    </div>);
}
