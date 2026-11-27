'use client';
import { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
import { ListaReceitas } from '@/components/admin/lists/ListaReceitas';
import { CadastroReceita } from '@/components/admin/forms/CadastroReceita';

export default function ReceitasPage() {
  const { receitas, insumos, categorias, salvarReceita, excluirReceita } = usePadaria();
  const [editando, setEditando] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  if (cadastrando || editando !== null) {
    return (
      <CadastroReceita
        editando={editando}
        insumos={insumos}
        categorias={categorias}
        onSalvar={(r) => { salvarReceita(r); setCadastrando(false); setEditando(null); }}
        onCancelar={() => { setCadastrando(false); setEditando(null); }}
      />
    );
  }

  return (
    <ListaReceitas
      receitas={receitas}
      insumos={insumos}
      categorias={categorias}
      onNova={() => { setEditando(null); setCadastrando(true); }}
      onEditar={(r) => { setEditando(r); setCadastrando(false); }}
      onExcluir={excluirReceita}
    />
  );
}
