'use client';
import { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
import { ListaFabricacao } from '@/components/admin/lists/ListaFabricacao';
import { CadastroFabricacao } from '@/components/admin/forms/CadastroFabricacao';

export default function FabricacaoPage() {
  const { fabricacoes, produtos, funcionarios, salvarFab, excluirFab, mudarStatusFabricacao } = usePadaria();
  const [editando, setEditando] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  if (cadastrando || editando !== null) {
    return (
      <CadastroFabricacao
        editando={editando}
        produtos={produtos}
        funcionarios={funcionarios}
        onSalvar={(f) => { salvarFab(f); setCadastrando(false); setEditando(null); }}
        onCancelar={() => { setCadastrando(false); setEditando(null); }}
      />
    );
  }

  return (
    <ListaFabricacao
      fabricacoes={fabricacoes}
      produtos={produtos}
      funcionarios={funcionarios}
      onNova={() => { setEditando(null); setCadastrando(true); }}
      onEditar={(f) => { setEditando(f); setCadastrando(false); }}
      onExcluir={excluirFab}
      onMudarStatus={mudarStatusFabricacao}
    />
  );
}
