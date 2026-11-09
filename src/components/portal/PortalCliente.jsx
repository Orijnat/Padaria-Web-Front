import React, { useState } from 'react';
import { PedidoStatusBadge } from '@/components/ui/PedidoStatusBadge';
export function PortalCliente({ cliente, produtos, categorias, pedidos, onNovoPedido, onLogout, }) {
    const [vista, setVista] = useState('loja');
    const [carrinho, setCarrinho] = useState(new Map());
    const [obs, setObs] = useState('');
    const [pedidoFeito, setPedidoFeito] = useState(false);
    const [catFiltro, setCatFiltro] = useState(null);
    const ativos = produtos.filter((p) => p.ativo);
    const filtrados = catFiltro
        ? ativos.filter((p) => p.categoriaId === catFiltro)
        : ativos;
    const meusPedidos = pedidos.filter((p) => p.clienteEmail.toLowerCase() === cliente.email.toLowerCase());
    function addC(id) {
        setCarrinho((m) => new Map(m).set(id, (m.get(id) ?? 0) + 1));
    }
    function remC(id) {
        setCarrinho((m) => {
            const nm = new Map(m);
            const q = (nm.get(id) ?? 0) - 1;
            if (q <= 0)
                nm.delete(id);
            else
                nm.set(id, q);
            return nm;
        });
    }
    const totalPreco = [...carrinho.entries()].reduce((a, [id, q]) => {
        const p = produtos.find((p) => p.id === id);
        return a + (p?.preco ?? 0) * q;
    }, 0);
    function confirmar() {
        if (carrinho.size === 0)
            return;
        const itens = [...carrinho.entries()].map(([id, q]) => {
            const p = produtos.find((p) => p.id === id);
            return { produtoId: id, quantidade: q, precoUnit: p.preco };
        });
        onNovoPedido({
            clienteNome: cliente.nome,
            clienteEmail: cliente.email,
            itens,
            total: totalPreco,
            status: 'pendente',
            data: new Date().toISOString().split('T')[0],
            observacao: obs,
        });
        setCarrinho(new Map());
        setObs('');
        setPedidoFeito(true);
        setTimeout(() => {
            setPedidoFeito(false);
            setVista('meus-pedidos');
        }, 2000);
    }
    return (<div className="min-h-screen flex flex-col" style={{ background: '#faf6f0' }}>
      <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-md" style={{ background: '#4e2b0e', borderBottom: '1px solid #3a1d08' }}>
        <div className="flex items-center gap-3">
          <div className="font-display text-2xl font-semibold italic" style={{ color: '#f5e9d6' }}>
            Padaria Artesanal
          </div>
        </div>
        <div className="flex items-center gap-5">
          {['loja', 'meus-pedidos'].map((v) => (<button key={v} onClick={() => setVista(v)} className="text-sm font-medium relative py-1 cursor-pointer transition-colors" style={{ color: vista === v ? '#f5e9d6' : '#c48d4a' }}>
              {v === 'loja' ? 'Cardápio' : `Meus Pedidos (${meusPedidos.length})`}
              {vista === v && (<span className="absolute bottom-0 left-0 right-0 h-0.5 rounded" style={{ background: '#e8a020' }}/>)}
            </button>))}
          <div className="h-4 w-px" style={{ background: '#6b3d16' }}/>
          <span className="text-xs font-medium" style={{ color: '#f5e9d6' }}>
            Olá, {cliente.nome}
          </span>
          <button onClick={onLogout} className="text-xs px-3 py-1.5 rounded cursor-pointer transition-colors hover:brightness-125" style={{ background: '#3a1d08', color: '#c48d4a' }}>
            Sair
          </button>
        </div>
      </header>

      {pedidoFeito && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(50,26,7,0.5)', backdropFilter: 'blur(2px)' }}>
          <div className="rounded-2xl px-10 py-8 text-center shadow-2xl fade-up" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
            <div className="text-5xl mb-3">🥖</div>
            <div className="font-display text-2xl font-semibold italic mb-1" style={{ color: '#321a07' }}>
              Pedido Realizado com Sucesso!
            </div>
            <p className="text-sm" style={{ color: '#a96e2c' }}>
              Nossa equipe já está preparando suas delícias.
            </p>
          </div>
        </div>)}

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {vista === 'loja' && (<div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex gap-2 mb-6 flex-wrap items-center">
                <button onClick={() => setCatFiltro(null)} className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all" style={{
                background: !catFiltro ? '#8a5420' : '#f5e9d6',
                color: !catFiltro ? '#faf6f0' : '#6b3d16',
            }}>
                  Todos os Produtos
                </button>
                {categorias
                .filter((c) => c.ativo)
                .map((c) => (<button key={c.id} onClick={() => setCatFiltro(c.id)} className="px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all" style={{
                    background: catFiltro === c.id ? '#8a5420' : '#f5e9d6',
                    color: catFiltro === c.id ? '#faf6f0' : '#6b3d16',
                }}>
                      {c.emoji} {c.nome}
                    </button>))}
              </div>

              <div className="grid gap-3">
                {filtrados.map((p) => {
                const q = carrinho.get(p.id) ?? 0;
                return (<div key={p.id} className="flex items-center gap-4 rounded-xl px-5 py-4 shadow-sm transition-all" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
                      <span style={{ fontSize: 36 }}>{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base" style={{ color: '#321a07' }}>
                          {p.nome}
                        </div>
                        <div className="text-xs mt-0.5 line-clamp-2" style={{ color: '#a96e2c' }}>
                          {p.descricao}
                        </div>
                      </div>
                      <div className="font-display text-lg font-semibold whitespace-nowrap" style={{ color: '#4e2b0e' }}>
                        R$ {p.preco.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2">
                        {q > 0 && (<>
                            <button onClick={() => remC(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer transition-all hover:scale-105" style={{ background: '#f5e9d6', color: '#8a5420' }} aria-label="Diminuir">
                              −
                            </button>
                            <span className="font-mono-data text-sm font-semibold w-5 text-center">
                              {q}
                            </span>
                          </>)}
                        <button onClick={() => addC(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer transition-all hover:scale-105" style={{ background: '#8a5420', color: '#faf6f0' }} aria-label="Adicionar">
                          +
                        </button>
                      </div>
                    </div>);
            })}
              </div>
            </div>

            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-24 rounded-2xl p-5 shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
                <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: '#f2ead8' }}>
                  <h2 className="font-display font-semibold text-base" style={{ color: '#6b3d16' }}>
                    Seu Pedido
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                    {carrinho.size} {carrinho.size === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {carrinho.size === 0 ? (<div className="py-8 text-center">
                    <div className="text-3xl mb-2">🧺</div>
                    <p className="text-sm" style={{ color: '#c48d4a' }}>
                      Adicione itens do cardápio para pedir
                    </p>
                  </div>) : (<>
                    <div className="flex flex-col gap-2.5 mb-4 max-h-64 overflow-y-auto">
                      {[...carrinho.entries()].map(([id, q]) => {
                    const p = produtos.find((p) => p.id === id);
                    return (<div key={id} className="flex justify-between items-center text-sm">
                            <span className="truncate pr-2" style={{ color: '#321a07' }}>
                              {q}× {p.nome}
                            </span>
                            <span className="font-mono-data text-xs font-semibold whitespace-nowrap" style={{ color: '#6b3d16' }}>
                              R$ {(p.preco * q).toFixed(2)}
                            </span>
                          </div>);
                })}
                    </div>
                    <div className="border-t pt-3 mb-4" style={{ borderColor: '#f2ead8' }}>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm font-semibold" style={{ color: '#321a07' }}>
                          Total
                        </span>
                        <span className="font-display text-xl font-semibold" style={{ color: '#4e2b0e' }}>
                          R$ {totalPreco.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Observações do pedido (opcional)…" rows={2} className="w-full px-3 py-2 rounded-lg text-xs resize-none outline-none mb-4" style={{
                    background: '#fdf8f3',
                    border: '1px solid #e9d0aa',
                    color: '#321a07',
                    fontFamily: 'inherit',
                }}/>
                    <button onClick={confirmar} className="w-full py-3 rounded-xl text-sm font-semibold cursor-pointer shadow transition-all hover:brightness-110" style={{ background: '#8a5420', color: '#faf6f0' }}>
                      Confirmar e Enviar Pedido
                    </button>
                  </>)}
              </div>
            </div>
          </div>)}

        {vista === 'meus-pedidos' && (<div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
                Meus Pedidos
              </h1>
              <button onClick={() => setVista('loja')} className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                + Fazer outro pedido
              </button>
            </div>

            {meusPedidos.length === 0 ? (<div className="text-center py-16 bg-white rounded-2xl border p-8" style={{ borderColor: '#e9d0aa' }}>
                <div className="text-5xl mb-3">🧺</div>
                <p className="text-base font-medium" style={{ color: '#4e2b0e' }}>
                  Você ainda não fez nenhum pedido.
                </p>
                <p className="text-sm mt-1" style={{ color: '#a96e2c' }}>
                  Explore nosso cardápio de pães, doces e cafés artesanais!
                </p>
                <button onClick={() => setVista('loja')} className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow" style={{ background: '#8a5420', color: '#faf6f0' }}>
                  Ver Cardápio
                </button>
              </div>) : (<div className="flex flex-col gap-4">
                {[...meusPedidos].reverse().map((p) => (<div key={p.id} className="rounded-2xl p-6 shadow-sm" style={{ background: '#fff', border: '1px solid #e9d0aa' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono-data text-xs font-semibold" style={{ color: '#a96e2c' }}>
                        Pedido #{p.id} · {new Date(p.data + 'T12:00').toLocaleDateString('pt-BR')}
                      </span>
                      <PedidoStatusBadge status={p.status}/>
                    </div>
                    <div className="flex flex-col gap-1.5 py-2">
                      {p.itens.map((it, i) => {
                        const prod = produtos.find((pp) => pp.id === it.produtoId);
                        return (<div key={i} className="flex justify-between text-sm">
                            <span style={{ color: '#321a07' }}>
                              {it.quantidade}× {prod?.emoji} {prod?.nome}
                            </span>
                            <span className="font-mono-data text-xs" style={{ color: '#6b3d16' }}>
                              R$ {(it.quantidade * it.precoUnit).toFixed(2)}
                            </span>
                          </div>);
                    })}
                    </div>
                    {p.observacao && (<div className="text-xs italic px-3 py-1.5 rounded-lg my-2" style={{ background: '#f5e9d6', color: '#6b3d16' }}>
                        Obs: {p.observacao}
                      </div>)}
                    <div className="flex justify-end border-t pt-3 mt-2" style={{ borderColor: '#f2ead8' }}>
                      <span className="font-display font-semibold text-base" style={{ color: '#4e2b0e' }}>
                        Total: R$ {p.total.toFixed(2)}
                      </span>
                    </div>
                  </div>))}
              </div>)}
          </div>)}
      </main>
    </div>);
}
