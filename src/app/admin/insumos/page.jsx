'use client';
import { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
import { ListaInsumos } from '@/components/admin/lists/ListaInsumos';
import { CadastroInsumo } from '@/components/admin/forms/CadastroInsumo';

export default function InsumosPage() {
  const { insumos, categorias, salvarInsumo, excluirInsumo } = usePadaria();
  const [editando, setEditando] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  if (cadastrando || editando !== null) {
    return (
      <CadastroInsumo
        editando={editando}
        onSalvar={async (i) => { await salvarInsumo(i); setCadastrando(false); setEditando(null); }}
        onCancelar={() => { setCadastrando(false); setEditando(null); }}
      />
    );
  }

  return (
    <ListaInsumos
      insumos={insumos}
      categorias={categorias}
      onNovo={() => { setEditando(null); setCadastrando(true); }}
      onEditar={(i) => { setEditando(i); setCadastrando(false); }}
      onExcluir={excluirInsumo}
    />
  );
}
