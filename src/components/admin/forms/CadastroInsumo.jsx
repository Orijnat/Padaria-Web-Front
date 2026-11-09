import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { CadHeader } from '@/components/ui/CadHeader';
import { FormActions } from '@/components/ui/FormActions';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
export function CadastroInsumo({ editando, onSalvar, onCancelar }) {
    const [form, setForm] = useState({
        nome: editando?.nome ?? '',
        unidade: editando?.unidade ?? 'kg',
        estoque: editando ? String(editando.estoque) : '',
        minimo: editando ? String(editando.minimo) : '',
        custo: editando ? String(editando.custo) : '',
        fornecedor: editando?.fornecedor ?? '',
    });
    const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    function submit(e) {
        e.preventDefault();
        const data = {
            nome: form.nome,
            unidade: form.unidade,
            estoque: Number(form.estoque),
            minimo: Number(form.minimo),
            custo: Number(form.custo),
            fornecedor: form.fornecedor,
        };
        if (editando)
            onSalvar({ ...data, id: editando.id });
        else
            onSalvar(data);
    }
    const isLow = form.estoque !== '' && form.minimo !== '' && Number(form.estoque) <= Number(form.minimo);
    return (<div className="flex-1 p-8 overflow-auto" style={{ maxWidth: 800 }}>
      <CadHeader title={editando ? 'Editar Insumo' : 'Cadastro de Insumo'} subtitle="Registre uma nova matéria-prima no estoque" onVoltar={onCancelar} voltar="Insumos"/>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Identificação" icon="⬡">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome do insumo">
              <input type="text" value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Ex: Farinha de trigo tipo 1" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Fornecedor">
              <input type="text" value={form.fornecedor} onChange={(e) => setF('fornecedor', e.target.value)} placeholder="Ex: Moinho São Paulo" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
          <Field label="Unidade de medida">
            <select value={form.unidade} onChange={(e) => setF('unidade', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
              {['kg', 'g', 'L', 'mL', 'unidade', 'dúzia', 'caixa', 'saco', 'pacote'].map((u) => (<option key={u}>{u}</option>))}
            </select>
          </Field>
        </FormSection>

        <FormSection title="Controle de Estoque" icon="📦">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Estoque atual" hint="quantidade disponível">
              <input type="number" step="0.01" min="0" value={form.estoque} onChange={(e) => setF('estoque', e.target.value)} placeholder="0" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Estoque mínimo" hint="alerta abaixo disso">
              <input type="number" step="0.01" min="0" value={form.minimo} onChange={(e) => setF('minimo', e.target.value)} placeholder="0" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Custo unitário" hint="em reais (R$)">
              <input type="number" step="0.01" min="0" value={form.custo} onChange={(e) => setF('custo', e.target.value)} placeholder="0,00" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
          {form.estoque !== '' && form.minimo !== '' && (<div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: isLow ? '#fce8e6' : '#d1fae5' }}>
              <span>{isLow ? '⚠️' : '✅'}</span>
              <span className="text-sm font-medium" style={{ color: isLow ? '#c0392b' : '#065f46' }}>
                {isLow
                ? 'Estoque abaixo do mínimo — gere alerta de reposição'
                : 'Estoque dentro do nível adequado'}
              </span>
            </div>)}
        </FormSection>

        <FormActions onCancel={onCancelar} label={editando ? 'Salvar Alterações' : 'Cadastrar Insumo'}/>
      </form>
    </div>);
}
