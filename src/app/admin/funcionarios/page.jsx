'use client';
import { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
import { ListaFuncionarios } from '@/components/admin/lists/ListaFuncionarios';
import { CadastroFuncionario } from '@/components/admin/forms/CadastroFuncionario';

export default function FuncionariosPage() {
  const { funcionarios, salvarFunc, excluirFunc } = usePadaria();
  const [editando, setEditando] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  if (cadastrando || editando !== null) {
    return (
      <CadastroFuncionario
        editando={editando}
        onSalvar={(f) => { salvarFunc(f); setCadastrando(false); setEditando(null); }}
        onCancelar={() => { setCadastrando(false); setEditando(null); }}
      />
    );
  }

  return (
    <ListaFuncionarios
      funcionarios={funcionarios}
      onNovo={() => { setEditando(null); setCadastrando(true); }}
      onEditar={(f) => { setEditando(f); setCadastrando(false); }}
      onExcluir={excluirFunc}
    />
  );
}
