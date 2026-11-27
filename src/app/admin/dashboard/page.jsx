'use client';
import { usePadaria } from '@/context/PadariaContext';
import { Dashboard } from '@/components/admin/Dashboard';

export default function DashboardPage() {
  const { insumos, receitas, produtos, fabricacoes, pedidos, funcionarios } = usePadaria();
  return (
    <Dashboard
      insumos={insumos}
      receitas={receitas}
      produtos={produtos}
      fabricacoes={fabricacoes}
      pedidos={pedidos}
      funcionarios={funcionarios}
    />
  );
}
