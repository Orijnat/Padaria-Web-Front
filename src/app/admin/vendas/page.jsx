'use client';
import { usePadaria } from '@/context/PadariaContext';
import { Vendas } from '@/components/admin/Vendas';

export default function VendasPage() {
  const { pedidos, produtos, mudarStatusPedido } = usePadaria();
  return (
    <Vendas
      pedidos={pedidos}
      produtos={produtos}
      onMudarStatus={mudarStatusPedido}
    />
  );
}
