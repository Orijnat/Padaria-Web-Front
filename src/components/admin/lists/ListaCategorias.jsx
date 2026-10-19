import React from 'react';
export function ListaCategorias({ categorias, onNova, onEditar, onExcluir, }) {
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            Categorias
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
            Organização do cardápio por categorias
          </p>
        </div>
        <button onClick={onNova} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors" style={{ background: '#8a5420', color: '#faf6f0' }}>
          + Nova Categoria
        </button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {categorias.map((c) => (<div key={c.id} className="rounded-2xl overflow-hidden shadow-sm transition-all" style={{
                border: `1px solid ${c.ativo ? '#e9d0aa' : '#f0ece4'}`,
                opacity: c.ativo ? 1 : 0.65,
                background: '#fff',
            }}>
            <div className="h-3" style={{ background: c.cor }}/>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: c.cor + '22' }}>
                  {c.emoji}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#321a07' }}>
                    {c.nome}
                  </div>
                  <span className="text-xs font-medium" style={{ color: c.ativo ? '#065f46' : '#a96e2c' }}>
                    {c.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: '#c48d4a' }}>
                {c.descricao}
              </p>
              <div className="flex gap-2">
                <button onClick={() => onEditar(c)} className="text-xs px-3 py-1.5 rounded font-medium cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                  Editar
                </button>
                <button onClick={() => onExcluir(c.id)} className="text-xs px-3 py-1.5 rounded ml-auto cursor-pointer transition-colors" style={{ background: '#fce8e6', color: '#c0392b' }}>
                  Excluir
                </button>
              </div>
            </div>
          </div>))}
      </div>
      {categorias.length === 0 && (<div className="py-16 text-center text-sm" style={{ color: '#a96e2c' }}>
          Nenhuma categoria cadastrada.
        </div>)}
    </div>);
}
