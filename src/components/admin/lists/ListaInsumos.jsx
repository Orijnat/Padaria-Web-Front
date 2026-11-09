import React, { useState } from 'react';
import { StockBar } from '@/components/ui/StockBar';
export function ListaInsumos({ insumos, onNovo, onEditar, onExcluir, }) {
    const [busca, setBusca] = useState('');
    const filtrados = insumos.filter((i) => i.nome.toLowerCase().includes(busca.toLowerCase()) ||
        i.fornecedor.toLowerCase().includes(busca.toLowerCase()));
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            Insumos
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
            Matérias-primas e controle de estoque
          </p>
        </div>
        <button onClick={onNovo} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors" style={{ background: '#8a5420', color: '#faf6f0' }}>
          + Novo Insumo
        </button>
      </div>

      <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou fornecedor…" className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm mb-6 outline-none" style={{
            background: '#fff',
            border: '1.5px solid #e9d0aa',
            color: '#321a07',
            fontFamily: 'inherit',
        }}/>

      <div className="rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #e9d0aa' }}>
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5e9d6' }}>
              {['Nome', 'Unidade', 'Estoque', 'Mínimo', 'Custo/un', 'Fornecedor', 'Ações'].map((h) => (<th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b3d16' }}>
                    {h}
                  </th>))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((ins, idx) => (<tr key={ins.id} className="table-row" style={{
                background: idx % 2 === 0 ? '#fff' : '#fdf8f3',
                borderTop: '1px solid #f2ead8',
            }}>
                <td className="px-5 py-3.5 text-sm font-medium" style={{ color: '#321a07' }}>
                  {ins.nome}
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-mono-data text-xs px-2 py-0.5 rounded" style={{ background: '#f2ead8', color: '#6b3d16' }}>
                    {ins.unidade}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StockBar atual={ins.estoque} minimo={ins.minimo}/>
                </td>
                <td className="px-5 py-3.5 font-mono-data text-xs" style={{ color: '#a96e2c' }}>
                  {ins.minimo}
                </td>
                <td className="px-5 py-3.5 font-mono-data text-sm" style={{ color: '#321a07' }}>
                  R$ {ins.custo.toFixed(2)}
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: '#6b3d16' }}>
                  {ins.fornecedor}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button onClick={() => onEditar(ins)} className="text-xs px-3 py-1 rounded cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                      Editar
                    </button>
                    <button onClick={() => onExcluir(ins.id)} className="text-xs px-3 py-1 rounded cursor-pointer transition-colors" style={{ background: '#fce8e6', color: '#c0392b' }}>
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>))}
          </tbody>
        </table>
        {filtrados.length === 0 && (<div className="py-12 text-center text-sm" style={{ color: '#a96e2c' }}>
            Nenhum insumo encontrado.
          </div>)}
      </div>
    </div>);
}
