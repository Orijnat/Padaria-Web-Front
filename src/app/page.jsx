'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePadaria } from '@/context/PadariaContext';
import { EscolhaAcesso } from '@/components/portal/EscolhaAcesso';
import { LoginAdmin } from '@/components/portal/LoginAdmin';
import { LoginCliente } from '@/components/portal/LoginCliente';

export default function Home() {
    const router = useRouter();
    const [modo, setModo] = useState('escolha');
    const { adminLogado, clienteLogado, entrar, cadastrarCliente } = usePadaria();

    useEffect(() => {
        if (adminLogado) {
            router.replace('/admin/dashboard');
        } else if (clienteLogado) {
            router.replace('/portal');
        }
    }, [adminLogado, clienteLogado, router]);

    if (adminLogado || clienteLogado) {
        return null;
    }

    if (modo === 'cliente') {
        return (
            <LoginCliente
                onEntrar={(email, senha) => entrar(email, senha, 'cliente')}
                onCadastrar={cadastrarCliente}
                onVoltar={() => setModo('escolha')}
            />
        );
    }

    if (modo === 'admin') {
        return (
            <LoginAdmin
                onEntrar={(email, senha) => entrar(email, senha, 'funcionario')}
                onVoltar={() => setModo('escolha')}
            />
        );
    }

    return (
        <EscolhaAcesso
            onAdmin={() => setModo('admin')}
            onCliente={() => setModo('cliente')}
        />
    );
}
