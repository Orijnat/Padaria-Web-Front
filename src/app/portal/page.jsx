'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePadaria } from '@/context/PadariaContext';
import { EscolhaAcesso } from '@/components/portal/EscolhaAcesso';
import { LoginCliente } from '@/components/portal/LoginCliente';
import { PortalCliente } from '@/components/portal/PortalCliente';

export default function PortalPage() {
  const router = useRouter();
  const {
    clienteLogado, adminLogado,
    entrar, sair, cadastrarCliente,
    produtos, categorias, pedidos, novoPedidoCliente,
  } = usePadaria();

  // Se admin já estiver logado, redireciona direto para o painel
  useEffect(() => {
    if (adminLogado) router.replace('/dashboard');
  }, [adminLogado, router]);

  if (clienteLogado) {
    return (
      <PortalCliente
        cliente={clienteLogado}
        produtos={produtos}
        categorias={categorias}
        pedidos={pedidos}
        onNovoPedido={novoPedidoCliente}
        onLogout={() => sair()}
      />
    );
  }

  // Tela de escolha: exibe LoginCliente inline quando o usuário clica em "Cliente"
  // A EscolhaAcesso redireciona para /dashboard (admin) ou mostra LoginCliente
  return (
    <EscolhaAcesso
      onAdmin={() => router.push('/')}
      onCliente={() => router.push('/portal/cliente')}
    />
  );
}
