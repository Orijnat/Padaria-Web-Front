import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { CadHeader } from '@/components/ui/CadHeader';
import { FormActions } from '@/components/ui/FormActions';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
const emojis = ['🥖', '🥐', '🍞', '🍫', '🧀', '☕', '🍰', '🥮', '🧁', '🍩', '🥨', '🫓', '🍕', '🥗', '🧆', '🫙'];
export function CadastroProduto({ editando, receitas, categorias, onSalvar, onCancelar, }) {
    const [form, setForm] = useState({
        nome: editando?.nome ?? '',
        categoriaId: editando ? String(editando.categoriaId) : String(categorias[0]?.id ?? ''),
        receitaId: editando?.receitaId ? String(editando.receitaId) : '',
        preco: editando ? String(editando.preco) : '',
        descricao: editando?.descricao ?? '',
        emoji: editando?.emoji ?? '🥖',
    });
    const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const receitaSel = receitas.find((r) => r.id === Number(form.receitaId));
    function submit(e) {
        e.preventDefault();
        const data = {
            nome: form.nome,
            categoriaId: Number(form.categoriaId),
            receitaId: form.receitaId ? Number(form.receitaId) : null,
            preco: Number(form.preco),
            descricao: form.descricao,
            emoji: form.emoji,
        };
        if (editando)
            onSalvar({ ...data, id: editando.id, ativo: editando.ativo });
        else
            onSalvar(data);
    }
    return (<div className="flex-1 p-8 overflow-auto" style={{ maxWidth: 900 }}>
      <CadHeader title={editando ? 'Editar Produto' : 'Cadastro de Produto'} subtitle="Adicione um produto ao catálogo de vendas da padaria" onVoltar={onCancelar} voltar="Produtos"/>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Identidade Visual" icon="🎨">
          <Field label="Escolha um emoji representativo">
            <div className="flex gap-2 flex-wrap">
              {emojis.map((e) => (<button key={e} type="button" onClick={() => setF('emoji', e)} className="w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer" style={{
                background: form.emoji === e ? '#f5e9d6' : '#fdf8f3',
                border: `2px solid ${form.emoji === e ? '#c48d4a' : '#f2ead8'}`,
            }}>
                  {e}
                </button>))}
            </div>
          </Field>
        </FormSection>

        <FormSection title="Informações do Produto" icon="◉">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome do produto">
              <input type="text" value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Ex: Croissant de Presunto" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Categoria">
              <select value={form.categoriaId} onChange={(e) => setF('categoriaId', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
                {categorias
            .filter((c) => c.ativo)
            .map((c) => (<option key={c.id} value={c.id}>
                      {c.emoji} {c.nome}
                    </option>))}
              </select>
            </Field>
          </div>
          <Field label="Descrição para o cliente" hint="aparece no cardápio">
            <input type="text" value={form.descricao} onChange={(e) => setF('descricao', e.target.value)} placeholder="Ex: Folhado artesanal com presunto e queijo suíço" className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Preço de venda" hint="R$">
              <input type="number" step="0.01" min="0" value={form.preco} onChange={(e) => setF('preco', e.target.value)} placeholder="0,00" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Receita base" hint="opcional">
              <select value={form.receitaId} onChange={(e) => setF('receitaId', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
                <option value="">— Sem receita vinculada —</option>
                {receitas.map((r) => (<option key={r.id} value={r.id}>
                    {r.nome}
                  </option>))}
              </select>
            </Field>
          </div>
          {receitaSel && (<div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#f5e9d6' }}>
              <span>📋</span>
              <span className="text-sm" style={{ color: '#6b3d16' }}>
                Receita: <strong>{receitaSel.nome}</strong> — rende {receitaSel.rendimento}{' '}
                {receitaSel.unidadeRendimento} em {receitaSel.tempoPreparo} min
              </span>
            </div>)}
        </FormSection>

        <FormActions onCancel={onCancelar} label={editando ? 'Salvar Alterações' : 'Cadastrar Produto'}/>
      </form>
    </div>);
}
