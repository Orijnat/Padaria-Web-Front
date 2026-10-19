import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
export function ListaFabricacao({ fabricacoes, produtos, funcionarios, onNova, onEditar, onExcluir, onMudarStatus, }) {
    const next = {
        planejado: 'em_producao',
        em_producao: 'concluido',
        concluido: null,
    };
    const nextLabel = {
        em_producao: 'Iniciar',
        concluido: 'Concluir',
    };
    const sorted = [...fabricacoes].sort((a, b) => b.data.localeCompare(a.data));
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            Fabricação
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
            Ordens de produção e controle
          </p>
        </div>
        <button onClick={onNova} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors" style={{ background: '#8a5420', color: '#faf6f0' }}>
          + Nova Ordem
        </button>
      </div>

      <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #e9d0aa' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5e9d6' }}>
              {['Produto', 'Data', 'Qtd', 'Responsável', 'Status', 'Ações'].map((h) => (<th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b3d16' }}>
                  {h}
                </th>))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((f, idx) => {
            const prod = produtos.find((p) => p.id === f.produtoId);
            const func = funcionarios.find((x) => x.id === f.funcionarioId);
            const nx = next[f.status];
            return (<tr key={f.id} className="table-row" style={{
                    background: idx % 2 === 0 ? '#fff' : '#fdf8f3',
                    borderTop: '1px solid #f2ead8',
                }}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#321a07' }}>
                    {prod?.emoji} {prod?.nome}
                  </td>
                  <td className="px-5 py-3.5 font-mono-data text-xs" style={{ color: '#6b3d16' }}>
                    {new Date(f.data + 'T12:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-3.5 font-mono-data text-sm font-semibold" style={{ color: '#321a07' }}>
                    {f.quantidade}
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: '#6b3d16' }}>
                    {func?.nome ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={f.status}/>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      {nx && (<button onClick={() => onMudarStatus(f.id, nx)} className="text-xs px-2.5 py-1 rounded font-medium cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                          {nextLabel[nx]}
                        </button>)}
                      <button onClick={() => onEditar(f)} className="text-xs px-2.5 py-1 rounded cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                        Editar
                      </button>
                      <button onClick={() => onExcluir(f.id)} className="text-xs px-2.5 py-1 rounded cursor-pointer transition-colors" style={{ background: '#fce8e6', color: '#c0392b' }}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
        {sorted.length === 0 && (<div className="py-12 text-center text-sm" style={{ color: '#a96e2c' }}>
            Nenhuma ordem registrada.
          </div>)}
      </div>
    </div>);
}
