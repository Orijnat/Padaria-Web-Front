'use client';
import { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
import { ListaProdutos } from '@/components/admin/lists/ListaProdutos';
import { CadastroProduto } from '@/components/admin/forms/CadastroProduto';

export default function ProdutosPage() {
  const { produtos, categorias, receitas, salvarProduto, alternarStatusProduto, excluirProduto } = usePadaria();
  const [editando, setEditando] = useState(null);
  const [cadastrando, setCadastrando] = useState(false);

  if (cadastrando || editando !== null) {
    return (
      <CadastroProduto
        editando={editando}
        categorias={categorias}
        receitas={receitas}
        onSalvar={async (p) => { await salvarProduto(p); setCadastrando(false); setEditando(null); }}
        onCancelar={() => { setCadastrando(false); setEditando(null); }}
      />
    );
  }

  return (
    <ListaProdutos
      produtos={produtos}
      categorias={categorias}
      receitas={receitas}
      onNovo={() => { setEditando(null); setCadastrando(true); }}
      onEditar={(p) => { setEditando(p); setCadastrando(false); }}
      onToggle={alternarStatusProduto}
      onExcluir={excluirProduto}
    />
  );
}
