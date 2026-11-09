import React, { useState } from 'react';
export function ListaFuncionarios({ funcionarios, onNovo, onEditar, onExcluir, }) {
    const [busca, setBusca] = useState('');
    const filtrados = funcionarios.filter((f) => f.nome.toLowerCase().includes(busca.toLowerCase()) ||
        f.cargo.toLowerCase().includes(busca.toLowerCase()));
    return (<div className="flex-1 p-8 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold italic" style={{ color: '#321a07' }}>
            Funcionários
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#a96e2c' }}>
            Equipe da padaria
          </p>
        </div>
        <button onClick={onNovo} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors" style={{ background: '#8a5420', color: '#faf6f0' }}>
          + Novo Funcionário
        </button>
      </div>

      <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou cargo…" className="w-full max-w-sm px-4 py-2.5 rounded-xl text-sm mb-6 outline-none" style={{
            background: '#fff',
            border: '1.5px solid #e9d0aa',
            color: '#321a07',
            fontFamily: 'inherit',
        }}/>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filtrados.map((f) => (<div key={f.id} className="rounded-xl p-5 shadow-sm transition-all" style={{
                background: '#fff',
                border: `1px solid ${f.ativo ? '#e9d0aa' : '#f0ece4'}`,
                opacity: f.ativo ? 1 : 0.7,
            }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg font-semibold" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                  {f.nome.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#321a07' }}>
                    {f.nome}
                  </div>
                  <div className="text-xs" style={{ color: '#a96e2c' }}>
                    {f.cargo}
                  </div>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                background: f.ativo ? '#d1fae5' : '#f5e9d6',
                color: f.ativo ? '#065f46' : '#a96e2c',
            }}>
                {f.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 mb-4" style={{ borderTop: '1px solid #f2ead8', paddingTop: 12 }}>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#a96e2c' }}>E-mail</span>
                <span style={{ color: '#321a07' }}>{f.email}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#a96e2c' }}>Telefone</span>
                <span style={{ color: '#321a07' }}>{f.telefone}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#a96e2c' }}>Admissão</span>
                <span className="font-mono-data" style={{ color: '#321a07' }}>
                  {new Date(f.dataAdmissao + 'T12:00').toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#a96e2c' }}>Salário</span>
                <span className="font-mono-data font-semibold" style={{ color: '#4e2b0e' }}>
                  R$ {f.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEditar(f)} className="text-xs px-3 py-1.5 rounded font-medium cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
                Editar
              </button>
              <button onClick={() => onExcluir(f.id)} className="text-xs px-3 py-1.5 rounded ml-auto cursor-pointer transition-colors" style={{ background: '#fce8e6', color: '#c0392b' }}>
                Excluir
              </button>
            </div>
          </div>))}
      </div>
      {filtrados.length === 0 && (<div className="py-16 text-center text-sm" style={{ color: '#a96e2c' }}>
          Nenhum funcionário encontrado.
        </div>)}
    </div>);
}
