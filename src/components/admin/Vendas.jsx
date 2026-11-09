import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PedidoStatusBadge } from '@/components/ui/PedidoStatusBadge';
export function Vendas({ pedidos, produtos, onMudarStatus }) {
    const [filtro, setFiltro] = useState('todos');
    const [aberto, setAberto] = useState(null);
    const hoje = new Date().toISOString().split('T')[0];
    const totalHoje = pedidos
        .filter((p) => p.data === hoje)
        .reduce((a, p) => a + p.total, 0);
    const pedidosHoje = pedidos.filter((p) => p.data === hoje).length;
    const sorted = [...pedidos]
        .filter((p) => filtro === 'todos' || p.status === filtro)
        .sort((a, b) => b.id - a.id);
    const next = {
        pendente: 'preparando',
        preparando: 'pronto',
        pronto: 'entregue',
        entregue: null,
    };
    const nextLabel = {
        preparando: 'Preparar',
        pronto: 'Pronto',
        entregue: 'Entregar',
    };
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
          Vendas
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
          Pedidos de clientes e controle de entregas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
            { l: 'Receita Hoje', v: `R$ ${totalHoje.toFixed(2)}`, s: `${pedidosHoje} pedidos` },
            {
                l: 'Ticket Médio',
                v: `R$ ${pedidosHoje > 0 ? (totalHoje / pedidosHoje).toFixed(2) : '0.00'}`,
                s: 'por pedido',
            },
            {
                l: 'Pendentes',
                v: pedidos.filter((p) => ['pendente', 'preparando'].includes(p.status)).length,
                s: 'em aberto',
            },
        ].map((kpi) => (<div key={kpi.l} className="rounded-xl p-5 shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: '#a96e2c' }}>
              {kpi.l}
            </div>
            <div className="font-display text-3xl font-semibold mt-1" style={{ color: '#321a07' }}>
              {kpi.v}
            </div>
            <div className="text-xs mt-1" style={{ color: '#c48d4a' }}>
              {kpi.s}
            </div>
          </div>))}
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['todos', 'pendente', 'preparando', 'pronto', 'entregue'].map((s) => (<button key={s} onClick={() => setFiltro(s)} className="px-4 py-1.5 rounded-full text-sm font-medium capitalize cursor-pointer transition-colors" style={{
                background: filtro === s ? '#8a5420' : '#f5e9d6',
                color: filtro === s ? '#faf6f0' : '#6b3d16',
            }}>
            {s === 'todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>))}
      </div>

      <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #e9d0aa' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5e9d6' }}>
              {['Pedido', 'Cliente', 'Data', 'Total', 'Status', 'Ações'].map((h) => (<th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b3d16' }}>
                  {h}
                </th>))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => {
            const nx = next[p.status];
            return (<tr key={p.id} className="table-row" style={{
                    background: idx % 2 === 0 ? '#fff' : '#fdf8f3',
                    borderTop: '1px solid #f2ead8',
                }}>
                  <td className="px-5 py-3.5 font-mono-data text-xs font-semibold" style={{ color: '#a96e2c' }}>
                    #{p.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-sm font-medium" style={{ color: '#321a07' }}>
                      {p.clienteNome}
                    </div>
                    <div className="text-xs" style={{ color: '#a96e2c' }}>
                      {p.clienteEmail}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono-data text-xs" style={{ color: '#6b3d16' }}>
                    {new Date(p.data + 'T12:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-3.5 font-display font-semibold text-sm" style={{ color: '#4e2b0e' }}>
                    R$ {p.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <PedidoStatusBadge status={p.status}/>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => setAberto(p)} className="text-xs px-2.5 py-1 rounded cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                        Ver detalhes
                      </button>
                      {nx && (<button onClick={() => onMudarStatus(p.id, nx)} className="text-xs px-2.5 py-1 rounded font-medium cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#6b3d16' }}>
                          {nextLabel[nx]}
                        </button>)}
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>
        {sorted.length === 0 && (<div className="py-12 text-center text-sm" style={{ color: '#a96e2c' }}>
            Nenhum pedido encontrado.
          </div>)}
      </div>

      {aberto && (<Modal title={`Pedido #${aberto.id}`} onClose={() => setAberto(null)}>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold" style={{ color: '#321a07' }}>
                  {aberto.clienteNome}
                </div>
                <div className="text-xs" style={{ color: '#a96e2c' }}>
                  {aberto.clienteEmail}
                </div>
              </div>
              <PedidoStatusBadge status={aberto.status}/>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e9d0aa' }}>
              {aberto.itens.map((it, i) => {
                const prod = produtos.find((p) => p.id === it.produtoId);
                return (<div key={i} className="flex justify-between px-4 py-3" style={{
                        borderBottom: i < aberto.itens.length - 1 ? '1px solid #f2ead8' : 'none',
                        background: '#fff',
                    }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#321a07' }}>
                        {prod?.emoji} {prod?.nome}
                      </div>
                      <div className="text-xs" style={{ color: '#a96e2c' }}>
                        R$ {it.precoUnit.toFixed(2)} × {it.quantidade}
                      </div>
                    </div>
                    <span className="font-mono-data font-semibold text-sm" style={{ color: '#4e2b0e' }}>
                      R$ {(it.precoUnit * it.quantidade).toFixed(2)}
                    </span>
                  </div>);
            })}
              <div className="flex justify-between px-4 py-3" style={{ background: '#f5e9d6' }}>
                <span className="font-semibold text-sm" style={{ color: '#321a07' }}>
                  Total
                </span>
                <span className="font-display font-semibold text-lg" style={{ color: '#4e2b0e' }}>
                  R$ {aberto.total.toFixed(2)}
                </span>
              </div>
            </div>
            {aberto.observacao && (<div className="px-4 py-3 rounded-lg text-sm italic" style={{ background: '#f5e9d6', color: '#6b3d16' }}>
                &ldquo;{aberto.observacao}&rdquo;
              </div>)}
            <div className="flex gap-2 pt-2">
              {next[aberto.status] && (<button onClick={() => {
                    const nextSt = next[aberto.status];
                    onMudarStatus(aberto.id, nextSt);
                    setAberto((p) => (p ? { ...p, status: nextSt } : null));
                }} className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: '#8a5420', color: '#faf6f0' }}>
                  Marcar como {nextLabel[next[aberto.status]]}
                </button>)}
              <button onClick={() => setAberto(null)} className="px-4 py-2 rounded-lg text-sm cursor-pointer" style={{ background: '#f5e9d6', color: '#6b3d16' }}>
                Fechar
              </button>
            </div>
          </div>
        </Modal>)}
    </div>);
}
