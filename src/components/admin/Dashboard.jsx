import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
export function Dashboard({ insumos, receitas: _receitas, produtos, fabricacoes, pedidos, funcionarios, }) {
    const baixo = insumos.filter((i) => i.estoque <= i.minimo);
    const hoje = new Date().toISOString().split('T')[0];
    const fab = fabricacoes.filter((f) => f.data === hoje);
    const pendentes = pedidos.filter((p) => p.status === 'pendente' || p.status === 'preparando');
    const receitaHoje = pedidos
        .filter((p) => p.data === hoje)
        .reduce((a, p) => a + p.total, 0);
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
          Bom dia, Admin
        </h1>
        <p className="mt-1 text-sm capitalize" style={{ color: '#a96e2c' }}>
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        })}
        </p>
      </div>

      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
            {
                l: 'Insumos em Alerta',
                v: baixo.length,
                s: `de ${insumos.length} total`,
                alert: baixo.length > 0,
            },
            {
                l: 'Produtos Ativos',
                v: produtos.filter((p) => p.ativo).length,
                s: 'no catálogo',
                alert: false,
            },
            {
                l: 'Pedidos Abertos',
                v: pendentes.length,
                s: 'aguardando',
                alert: pendentes.length > 0,
            },
            {
                l: 'Receita Hoje',
                v: `R$ ${receitaHoje.toFixed(2)}`,
                s: `${pedidos.filter((p) => p.data === hoje).length} pedidos`,
                alert: false,
            },
        ].map((kpi) => (<div key={kpi.l} className="rounded-xl p-5 shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: '#a96e2c' }}>
              {kpi.l}
            </div>
            <div className="font-display text-3xl font-semibold mt-1" style={{ color: kpi.alert ? '#c0392b' : '#321a07' }}>
              {kpi.v}
            </div>
            <div className="text-xs mt-1" style={{ color: kpi.alert ? '#c0392b' : '#c48d4a' }}>
              {kpi.s}
            </div>
          </div>))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="rounded-xl p-6 shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
          <h2 className="font-semibold text-sm uppercase tracking-wide mb-4" style={{ color: '#6b3d16' }}>
            Alertas de Estoque
          </h2>
          {baixo.length === 0 ? (<p className="text-sm" style={{ color: '#a96e2c' }}>
              Todos os insumos estão em níveis adequados.
            </p>) : (<div className="flex flex-col gap-2">
              {baixo.map((i) => (<div key={i.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f2ead8' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#321a07' }}>
                      {i.nome}
                    </div>
                    <div className="text-xs" style={{ color: '#a96e2c' }}>
                      Mínimo: {i.minimo} {i.unidade}
                    </div>
                  </div>
                  <span className="font-mono-data text-xs font-semibold px-2 py-1 rounded" style={{ background: '#fce8e6', color: '#c0392b' }}>
                    {i.estoque} {i.unidade}
                  </span>
                </div>))}
            </div>)}
        </div>

        <div className="rounded-xl p-6 shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
          <h2 className="font-semibold text-sm uppercase tracking-wide mb-4" style={{ color: '#6b3d16' }}>
            Produção de Hoje
          </h2>
          {fab.length === 0 ? (<p className="text-sm" style={{ color: '#a96e2c' }}>
              Nenhuma ordem de fabricação para hoje.
            </p>) : (<div className="flex flex-col gap-2">
              {fab.map((f) => {
                const prod = produtos.find((p) => p.id === f.produtoId);
                const func = funcionarios.find((x) => x.id === f.funcionarioId);
                return (<div key={f.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f2ead8' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#321a07' }}>
                        {prod?.emoji} {prod?.nome}
                      </div>
                      <div className="text-xs" style={{ color: '#a96e2c' }}>
                        {func?.nome ?? 'Sem responsável'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-xs font-semibold" style={{ color: '#6b3d16' }}>
                        {f.quantidade} un
                      </span>
                      <StatusBadge status={f.status}/>
                    </div>
                  </div>);
            })}
            </div>)}
        </div>
      </div>
    </div>);
}
