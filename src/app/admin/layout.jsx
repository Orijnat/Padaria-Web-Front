'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePadaria } from '@/context/PadariaContext';
import { Sidebar } from '@/components/admin/Sidebar';

/**
 * Layout compartilhado para todas as rotas da área administrativa.
 * - Redireciona para /admin-login se o admin não estiver logado.
 * - Exibe a Sidebar com navegação entre as páginas.
 */
export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { adminLogado, sair } = usePadaria();

  useEffect(() => {
    if (!adminLogado) router.replace('/');
  }, [adminLogado, router]);

  // Extrai a tela atual a partir do pathname (/admin/dashboard → "dashboard")
  const current = pathname.split('/').filter(Boolean).pop() ?? 'dashboard';

  function handleNav(key) {
    router.push(`/admin/${key}`);
  }

  function handleLogout() {
    sair();
    router.push('/');
  }

  if (!adminLogado) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf6f0' }}>
      <Sidebar current={current} onNav={handleNav} onLogout={handleLogout} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
