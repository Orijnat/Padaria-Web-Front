export function PedidoStatusBadge({ status }) {
    const map = {
        pendente: { l: 'Pendente', bg: '#f5e9d6', c: '#8a5420' },
        preparando: { l: 'Preparando', bg: '#fef3c7', c: '#b45309' },
        pronto: { l: 'Pronto', bg: '#dbeafe', c: '#1e40af' },
        entregue: { l: 'Entregue', bg: '#d1fae5', c: '#065f46' },
    };
    const s = map[status] || map.pendente;
    return (<span className="font-mono-data text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap" style={{ background: s.bg, color: s.c }}>
      {s.l}
    </span>);
}
