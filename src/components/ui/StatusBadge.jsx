export function StatusBadge({ status }) {
    const map = {
        planejado: { l: 'Planejado', bg: '#f5e9d6', c: '#8a5420' },
        em_producao: { l: 'Em Produção', bg: '#fef3c7', c: '#b45309' },
        concluido: { l: 'Concluído', bg: '#d1fae5', c: '#065f46' },
    };
    const s = map[status] || map.planejado;
    return (<span className="font-mono-data text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap" style={{ background: s.bg, color: s.c }}>
      {s.l}
    </span>);
}
