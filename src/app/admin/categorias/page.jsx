'use client';
import { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
import { ListaCategorias } from '@/components/admin/lists/ListaCategorias';
import { CadastroCategoria } from '@/components/admin/forms/CadastroCategoria';

export default function CategoriasPage() {
  const { categorias, salvarCat, excluirCat } = usePadaria();
  const [editando, setEditando] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  if (cadastrando || editando !== null) {
    return (
      <CadastroCategoria
        editando={editando}
        onSalvar={(c) => { salvarCat(c); setCadastrando(false); setEditando(null); }}
        onCancelar={() => { setCadastrando(false); setEditando(null); }}
      />
    );
  }

  return (
    <ListaCategorias
      categorias={categorias}
      onNova={() => { setEditando(null); setCadastrando(true); }}
      onEditar={(c) => { setEditando(c); setCadastrando(false); }}
      onExcluir={excluirCat}
    />
  );
}
