import React, { useState } from 'react';
export function ListaReceitas({ receitas, insumos, categorias, onNova, onEditar, onExcluir, }) {
    const [detalhe, setDetalhe] = useState(null);
    const [catFiltro, setCatFiltro] = useState(null);
    const filtradas = catFiltro
        ? receitas.filter((r) => r.categoriaId === catFiltro)
        : receitas;
    if (detalhe) {
        const cat = categorias.find((c) => c.id === detalhe.categoriaId);
        return (<div className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl">
          <button onClick={() => setDetalhe(null)} className="text-sm mb-6 flex items-center gap-1 cursor-pointer" style={{ color: '#a96e2c' }}>
            ← Voltar para lista de receitas
          </button>
          <div className="flex items-start justify-between mb-2">
            <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
              {detalhe.nome}
            </h1>
            <div className="flex gap-2 mt-1">
              <button onClick={() => {
                setDetalhe(null);
                onEditar(detalhe);
            }} className="text-xs px-3 py-1 rounded cursor-pointer" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                Editar
              </button>
              {cat && (<span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: cat.cor + '22', color: cat.cor }}>
                  {cat.emoji} {cat.nome}
                </span>)}
            </div>
          </div>
          <div className="flex gap-6 text-sm mb-8" style={{ color: '#a96e2c' }}>
            <span>⏱ {detalhe.tempoPreparo} min</span>
            <span>↗ {detalhe.rendimento} {detalhe.unidadeRendimento}</span>
          </div>
          <div className="rounded-xl p-6 mb-5" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
            <h2 className="font-semibold text-sm uppercase tracking-wide mb-4" style={{ color: '#6b3d16' }}>
              Ingredientes
            </h2>
            {detalhe.ingredientes.map((ing, i) => {
                const ins = insumos.find((x) => x.id === ing.insumoId);
                return (<div key={i} className="flex justify-between py-2" style={{ borderBottom: '1px solid #f2ead8' }}>
                  <span className="text-sm" style={{ color: '#321a07' }}>
                    {ins?.nome ?? '—'}
                  </span>
                  <span className="font-mono-data text-sm font-medium" style={{ color: '#6b3d16' }}>
                    {ing.quantidade} {ins?.unidade}
                  </span>
                </div>);
            })}
          </div>
          <div className="rounded-xl p-6" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
            <h2 className="font-semibold text-sm uppercase tracking-wide mb-3" style={{ color: '#6b3d16' }}>
              Modo de Preparo
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#4e2b0e' }}>
              {detalhe.instrucoes}
            </p>
          </div>
        </div>
      </div>);
    }
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            Receitas
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
            Formulações e fichas técnicas
          </p>
        </div>
        <button onClick={onNova} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors" style={{ background: '#8a5420', color: '#faf6f0' }}>
          + Nova Receita
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setCatFiltro(null)} className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer" style={{
            background: !catFiltro ? '#8a5420' : '#f5e9d6',
            color: !catFiltro ? '#faf6f0' : '#6b3d16',
        }}>
          Todas
        </button>
        {categorias.map((c) => (<button key={c.id} onClick={() => setCatFiltro(c.id)} className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer" style={{
                background: catFiltro === c.id ? '#8a5420' : '#f5e9d6',
                color: catFiltro === c.id ? '#faf6f0' : '#6b3d16',
            }}>
            {c.emoji} {c.nome}
          </button>))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtradas.map((r) => {
            const cat = categorias.find((c) => c.id === r.categoriaId);
            return (<div key={r.id} className="rounded-xl p-5 cursor-pointer transition-all shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }} onClick={() => setDetalhe(r)} onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#c48d4a')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e9d0aa')}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm" style={{ color: '#321a07' }}>
                  {r.nome}
                </h3>
                {cat && (<span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cat.cor + '22', color: cat.cor }}>
                    {cat.emoji} {cat.nome}
                  </span>)}
              </div>
              <div className="flex gap-3 text-xs mb-4" style={{ color: '#a96e2c' }}>
                <span>⏱ {r.tempoPreparo}min</span>
                <span>↗ {r.rendimento} {r.unidadeRendimento}</span>
                <span>🧂 {r.ingredientes.length}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={(e) => {
                    e.stopPropagation();
                    onEditar(r);
                }} className="text-xs px-3 py-1 rounded cursor-pointer" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                  Editar
                </button>
                <button onClick={(e) => {
                    e.stopPropagation();
                    onExcluir(r.id);
                }} className="text-xs px-3 py-1 rounded cursor-pointer" style={{ background: '#fce8e6', color: '#c0392b' }}>
                  Excluir
                </button>
              </div>
            </div>);
        })}
      </div>
      {filtradas.length === 0 && (<div className="py-16 text-center text-sm" style={{ color: '#a96e2c' }}>
          Nenhuma receita encontrada.
        </div>)}
    </div>);
}
