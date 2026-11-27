'use client';
import { useRouter } from 'next/navigation';
import { usePadaria } from '@/context/PadariaContext';
import { LoginForm } from '@/components/portal/LoginForm';

export default function PortalClientePage() {
  const router = useRouter();
  const { clienteLogado, entrar } = usePadaria();

  // Se já estiver logado, redireciona para o portal
  if (clienteLogado) {
    router.replace('/portal');
    return null;
  }

  async function handleEntrar(email, senha) {
    const resultado = await entrar(email, senha, 'cliente');
    if (resultado.ok) router.push('/portal');
    return resultado;
  }

  return (
    <LoginForm
      titulo="Padaria"
      subtitulo="Área do cliente"
      labelBotao="Entrar"
      onEntrar={handleEntrar}
      onVoltar={() => router.push('/portal')}
    />
  );
}
