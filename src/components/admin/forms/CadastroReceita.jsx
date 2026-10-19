import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { CadHeader } from '@/components/ui/CadHeader';
import { FormActions } from '@/components/ui/FormActions';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
export function CadastroReceita({ editando, insumos, categorias, onSalvar, onCancelar, }) {
    const [form, setForm] = useState({
        nome: editando?.nome ?? '',
        categoriaId: editando ? String(editando.categoriaId) : String(categorias[0]?.id ?? ''),
        rendimento: editando ? String(editando.rendimento) : '',
        unidadeRendimento: editando?.unidadeRendimento ?? 'unidades',
        tempoPreparo: editando ? String(editando.tempoPreparo) : '',
        instrucoes: editando?.instrucoes ?? '',
    });
    const [ings, setIngs] = useState(editando?.ingredientes.map((i) => ({ ...i })) ?? [
        { insumoId: insumos[0]?.id ?? 1, quantidade: 0 },
    ]);
    const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const addIng = () => setIngs((p) => [...p, { insumoId: insumos[0]?.id ?? 1, quantidade: 0 }]);
    const remIng = (i) => setIngs((p) => p.filter((_, j) => j !== i));
    const setIng = (i, k, v) => setIngs((p) => p.map((ing, j) => (j === i ? { ...ing, [k]: Number(v) } : ing)));
    const custTotal = ings.reduce((acc, ing) => {
        const ins = insumos.find((i) => i.id === ing.insumoId);
        return acc + (ins?.custo ?? 0) * ing.quantidade;
    }, 0);
    function submit(e) {
        e.preventDefault();
        const data = {
            nome: form.nome,
            categoriaId: Number(form.categoriaId),
            rendimento: Number(form.rendimento),
            unidadeRendimento: form.unidadeRendimento,
            tempoPreparo: Number(form.tempoPreparo),
            instrucoes: form.instrucoes,
            ingredientes: ings,
        };
        if (editando)
            onSalvar({ ...data, id: editando.id });
        else
            onSalvar(data);
    }
    return (<div className="flex-1 p-8 overflow-auto" style={{ maxWidth: 900 }}>
      <CadHeader title={editando ? 'Editar Receita' : 'Cadastro de Receita'} subtitle="Registre uma nova formulação ou receita artesanal" onVoltar={onCancelar} voltar="Receitas"/>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Informações Gerais" icon="◈">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome da receita">
              <input type="text" value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Ex: Pão de Mel Artesanal" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
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
          <div className="grid grid-cols-3 gap-4">
            <Field label="Rendimento">
              <input type="number" min="1" value={form.rendimento} onChange={(e) => setF('rendimento', e.target.value)} placeholder="Ex: 30" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Unidade do rendimento">
              <select value={form.unidadeRendimento} onChange={(e) => setF('unidadeRendimento', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
                {['unidades', 'fatias', 'porções', 'dúzias', 'kg'].map((u) => (<option key={u}>{u}</option>))}
              </select>
            </Field>
            <Field label="Tempo de preparo" hint="em minutos">
              <input type="number" min="1" value={form.tempoPreparo} onChange={(e) => setF('tempoPreparo', e.target.value)} placeholder="Ex: 90" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Ingredientes" icon="🧂">
          <div className="flex flex-col gap-2">
            {ings.map((ing, idx) => (<div key={idx} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#fdf8f3', border: '1px solid #f2ead8' }}>
                <div className="flex-1">
                  <select value={ing.insumoId} onChange={(e) => setIng(idx, 'insumoId', e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{
                background: '#fff',
                border: '1px solid #e9d0aa',
                color: '#321a07',
                fontFamily: 'inherit',
            }}>
                    {insumos.map((i) => (<option key={i.id} value={i.id}>
                        {i.nome} ({i.unidade})
                      </option>))}
                  </select>
                </div>
                <div style={{ width: 130 }}>
                  <input type="number" step="0.001" min="0" value={ing.quantidade || ''} onChange={(e) => setIng(idx, 'quantidade', e.target.value)} placeholder="Quantidade" className="w-full px-3 py-2 rounded-lg text-sm text-right outline-none" style={{
                background: '#fff',
                border: '1px solid #e9d0aa',
                color: '#321a07',
                fontFamily: 'inherit',
            }}/>
                </div>
                {ings.length > 1 && (<button type="button" onClick={() => remIng(idx)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 cursor-pointer" style={{ background: '#fce8e6', color: '#c0392b' }}>
                    ×
                  </button>)}
              </div>))}
          </div>
          <button type="button" onClick={addIng} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium self-start cursor-pointer transition-colors" style={{ background: '#f5e9d6', color: '#8a5420' }}>
            + Adicionar ingrediente
          </button>
          {custTotal > 0 && (<div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: '#f5e9d6' }}>
              <span className="text-sm font-medium" style={{ color: '#6b3d16' }}>
                Custo estimado da receita
              </span>
              <span className="font-display font-semibold" style={{ color: '#4e2b0e' }}>
                R$ {custTotal.toFixed(2)}
              </span>
            </div>)}
        </FormSection>

        <FormSection title="Modo de Preparo" icon="📋">
          <textarea value={form.instrucoes} onChange={(e) => setF('instrucoes', e.target.value)} placeholder="Descreva passo a passo o preparo da receita…" rows={5} className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none" style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
        </FormSection>

        <FormActions onCancel={onCancelar} label={editando ? 'Salvar Alterações' : 'Cadastrar Receita'}/>
      </form>
    </div>);
}
