import React, { useState } from 'react';
export function ListaProdutos({ produtos, receitas, categorias, onNovo, onEditar, onToggle, onExcluir, }) {
    const [busca, setBusca] = useState('');
    const [catFiltro, setCatFiltro] = useState(null);
    const filtrados = produtos.filter((p) => {
        const matchesBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
            p.descricao.toLowerCase().includes(busca.toLowerCase());
        const matchesCat = catFiltro ? p.categoriaId === catFiltro : true;
        return matchesBusca && matchesCat;
    });
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            Produtos
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
            Catálogo de produtos para venda
          </p>
        </div>
        <button onClick={onNovo} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors" style={{ background: '#8a5420', color: '#faf6f0' }}>
          + Novo Produto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto por nome ou descrição…" className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm outline-none" style={{
            background: '#fff',
            border: '1.5px solid #e9d0aa',
            color: '#321a07',
            fontFamily: 'inherit',
        }}/>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCatFiltro(null)} className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer" style={{
            background: !catFiltro ? '#8a5420' : '#f5e9d6',
            color: !catFiltro ? '#faf6f0' : '#6b3d16',
        }}>
            Todos
          </button>
          {categorias.map((c) => (<button key={c.id} onClick={() => setCatFiltro(c.id)} className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer" style={{
                background: catFiltro === c.id ? '#8a5420' : '#f5e9d6',
                color: catFiltro === c.id ? '#faf6f0' : '#6b3d16',
            }}>
              {c.emoji} {c.nome}
            </button>))}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {filtrados.map((p) => {
            const cat = categorias.find((c) => c.id === p.categoriaId);
            const rec = receitas.find((r) => r.id === p.receitaId);
            return (<div key={p.id} className="rounded-xl overflow-hidden shadow-sm transition-all" style={{
                    border: `1px solid ${p.ativo ? '#e9d0aa' : '#f0ece4'}`,
                    opacity: p.ativo ? 1 : 0.65,
                    background: '#fff',
                }}>
              <div className="h-2" style={{ background: cat?.cor ?? '#c48d4a' }}/>
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 24 }}>{p.emoji}</span>
                    <h3 className="font-semibold text-sm leading-snug" style={{ color: '#321a07' }}>
                      {p.nome}
                    </h3>
                  </div>
                  {cat && (<span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: cat.cor + '22', color: cat.cor }}>
                      {cat.nome}
                    </span>)}
                </div>
                {rec && (<div className="text-xs mb-1 ml-8 font-medium" style={{ color: '#a96e2c' }}>
                    Receita: {rec.nome}
                  </div>)}
                <p className="text-xs ml-8 mb-3 leading-relaxed" style={{ color: '#c48d4a' }}>
                  {p.descricao}
                </p>
                <div className="font-display text-2xl font-semibold mb-4" style={{ color: '#4e2b0e' }}>
                  R$ {p.preco.toFixed(2)}
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <button onClick={() => onEditar(p)} className="text-xs px-3 py-1.5 rounded font-medium cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                    Editar
                  </button>
                  <button onClick={() => onToggle(p.id)} className="text-xs px-3 py-1.5 rounded font-medium cursor-pointer transition-colors" style={{
                    background: p.ativo ? '#d1fae5' : '#f5e9d6',
                    color: p.ativo ? '#065f46' : '#6b3d16',
                }}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                  <button onClick={() => onExcluir(p.id)} className="text-xs px-3 py-1.5 rounded ml-auto cursor-pointer transition-colors" style={{ background: '#fce8e6', color: '#c0392b' }}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>);
        })}
      </div>
      {filtrados.length === 0 && (<div className="py-16 text-center text-sm" style={{ color: '#a96e2c' }}>
          Nenhum produto encontrado.
        </div>)}
    </div>);
}
