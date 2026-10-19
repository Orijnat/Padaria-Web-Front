import React from 'react';
export function EscolhaAcesso({ onAdmin, onCliente }) {
    return (<div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: '#4e2b0e' }}>
      <div className="font-display text-5xl sm:text-6xl font-semibold italic mb-3" style={{ color: '#f5e9d6' }}>
        Padaria Artesanal
      </div>
      <div className="text-base sm:text-lg mb-12 font-medium tracking-wide" style={{ color: '#d9b07a' }}>
        Tradição, paixão e frescor desde 1987
      </div>
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
        <button onClick={onAdmin} className="flex-1 px-8 py-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg hover:scale-105 transition-all" style={{ background: '#8a5420', color: '#faf6f0', border: '1px solid #a96e2c' }}>
          Área Administrativa
        </button>
        <button onClick={onCliente} className="flex-1 px-8 py-4 rounded-xl text-base font-semibold cursor-pointer shadow-lg hover:scale-105 transition-all" style={{ background: '#faf6f0', color: '#4e2b0e' }}>
          Fazer um Pedido
        </button>
      </div>
    </div>);
}
