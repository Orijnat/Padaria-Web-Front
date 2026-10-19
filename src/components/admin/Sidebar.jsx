import React from 'react';
export const NAV_GROUPS = [
    {
        label: 'Principal',
        items: [
            { key: 'dashboard', icon: '⊞', label: 'Painel' },
            { key: 'vendas', icon: '◎', label: 'Vendas' },
        ],
    },
    {
        label: 'Cadastros',
        items: [
            { key: 'insumos', icon: '⬡', label: 'Insumos' },
            { key: 'receitas', icon: '◈', label: 'Receitas' },
            { key: 'produtos', icon: '◉', label: 'Produtos' },
            { key: 'fabricacao', icon: '⟳', label: 'Fabricação' },
            { key: 'funcionarios', icon: '◷', label: 'Funcionários' },
            { key: 'categorias', icon: '◧', label: 'Categorias' },
        ],
    },
];
export function Sidebar({ current, onNav, onLogout }) {
    const active = (key) => current === key ||
        (key === 'insumos' && current === 'cad-insumo') ||
        (key === 'receitas' && current === 'cad-receita') ||
        (key === 'produtos' && current === 'cad-produto') ||
        (key === 'fabricacao' && current === 'cad-fabricacao') ||
        (key === 'funcionarios' && current === 'cad-funcionario') ||
        (key === 'categorias' && current === 'cad-categoria');
    return (<aside className="flex flex-col" style={{
            width: 230,
            minHeight: '100vh',
            background: '#4e2b0e',
            borderRight: '1px solid #321a07',
            flexShrink: 0,
        }}>
      <div className="px-6 py-7 border-b" style={{ borderColor: '#6b3d16' }}>
        <div className="font-display text-xl font-semibold italic" style={{ color: '#f5e9d6' }}>
          Padaria
        </div>
        <div className="text-xs mt-0.5 font-medium" style={{ color: '#d9b07a' }}>
          Sistema de Gestão
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (<div key={group.label}>
            <div className="px-4 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b3d16' }}>
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (<button key={item.key} onClick={() => onNav(item.key)} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all cursor-pointer" style={{
                    background: active(item.key) ? '#8a5420' : 'transparent',
                    color: active(item.key) ? '#faf6f0' : '#c48d4a',
                }}>
                  <span style={{ fontSize: 15 }}>{item.icon}</span>
                  {item.label}
                </button>))}
            </div>
          </div>))}
      </nav>

      <div className="px-6 py-5 border-t" style={{ borderColor: '#6b3d16' }}>
        <div className="text-xs" style={{ color: '#a96e2c' }}>
          Administrador
        </div>
        <div className="text-sm font-medium mt-0.5 mb-3" style={{ color: '#f5e9d6' }}>
          Admin
        </div>
        <button onClick={onLogout} className="text-xs px-3 py-1.5 rounded w-full text-left cursor-pointer transition-colors" style={{ background: '#3a1d08', color: '#c48d4a' }}>
          Sair
        </button>
      </div>
    </aside>);
}
