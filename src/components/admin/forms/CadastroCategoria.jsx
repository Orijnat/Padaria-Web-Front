import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { CadHeader } from '@/components/ui/CadHeader';
import { FormActions } from '@/components/ui/FormActions';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
const emojis = [
    '🥖',
    '🍰',
    '🥐',
    '🧀',
    '☕',
    '🍩',
    '🧁',
    '🫓',
    '🍕',
    '🥗',
    '🧆',
    '🫙',
    '🍪',
    '🥧',
    '🍮',
    '🥨',
];
const cores = [
    '#c48d4a',
    '#e8a020',
    '#d9b07a',
    '#8a5420',
    '#6b3d16',
    '#a96e2c',
    '#3d7a4a',
    '#1e40af',
    '#7c3aed',
    '#be185d',
];
export function CadastroCategoria({ editando, onSalvar, onCancelar, }) {
    const [form, setForm] = useState({
        nome: editando?.nome ?? '',
        descricao: editando?.descricao ?? '',
        emoji: editando?.emoji ?? '🥖',
        cor: editando?.cor ?? '#c48d4a',
        ativo: editando ? editando.ativo : true,
    });
    const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    function submit(e) {
        e.preventDefault();
        const data = {
            nome: form.nome,
            descricao: form.descricao,
            emoji: form.emoji,
            cor: form.cor,
            ativo: form.ativo,
        };
        if (editando)
            onSalvar({ ...data, id: editando.id });
        else
            onSalvar(data);
    }
    return (<div className="flex-1 p-8 overflow-auto" style={{ maxWidth: 700 }}>
      <CadHeader title={editando ? 'Editar Categoria' : 'Cadastro de Categoria'} subtitle="Organize os produtos por categorias para o cardápio" onVoltar={onCancelar} voltar="Categorias"/>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Identidade da Categoria" icon="◧">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: form.cor + '22', border: `2px solid ${form.cor}` }}>
              {form.emoji}
            </div>
            <div className="flex-1">
              <Field label="Nome da categoria">
                <input type="text" value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Ex: Bolos e Tortas" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
              </Field>
            </div>
          </div>
          <Field label="Descrição">
            <input type="text" value={form.descricao} onChange={(e) => setF('descricao', e.target.value)} placeholder="Ex: Bolos inteiros, fatias e tortas doces" className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
          </Field>
        </FormSection>

        <FormSection title="Aparência" icon="🎨">
          <Field label="Emoji da categoria">
            <div className="flex gap-2 flex-wrap">
              {emojis.map((e) => (<button key={e} type="button" onClick={() => setF('emoji', e)} className="w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer" style={{
                background: form.emoji === e ? '#f5e9d6' : '#fdf8f3',
                border: `2px solid ${form.emoji === e ? '#c48d4a' : '#f2ead8'}`,
            }}>
                  {e}
                </button>))}
            </div>
          </Field>
          <Field label="Cor de destaque">
            <div className="flex gap-3 flex-wrap">
              {cores.map((c) => (<button key={c} type="button" onClick={() => setF('cor', c)} className="w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer" style={{
                background: c,
                border: `3px solid ${form.cor === c ? '#321a07' : 'transparent'}`,
                transform: form.cor === c ? 'scale(1.15)' : 'scale(1)',
            }}>
                  {form.cor === c && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                </button>))}
            </div>
          </Field>
          <Field label="Status">
            <div className="flex gap-3" style={{ maxWidth: 300 }}>
              {[true, false].map((v) => (<button key={String(v)} type="button" onClick={() => setF('ativo', v)} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer" style={{
                background: form.ativo === v ? (v ? '#d1fae5' : '#fce8e6') : '#fdf8f3',
                color: form.ativo === v ? (v ? '#065f46' : '#c0392b') : '#a96e2c',
                border: `1.5px solid ${form.ativo === v ? (v ? '#6ee7b7' : '#fca5a5') : '#f2ead8'}`,
            }}>
                  {v ? '✓ Ativa' : '✗ Inativa'}
                </button>))}
            </div>
          </Field>
        </FormSection>

        <FormActions onCancel={onCancelar} label={editando ? 'Salvar Alterações' : 'Cadastrar Categoria'}/>
      </form>
    </div>);
}
