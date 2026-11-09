import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { CadHeader } from '@/components/ui/CadHeader';
import { FormActions } from '@/components/ui/FormActions';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
export function CadastroFabricacao({ editando, produtos, funcionarios, onSalvar, onCancelar, }) {
    const hoje = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState({
        produtoId: editando ? String(editando.produtoId) : String(produtos[0]?.id ?? ''),
        funcionarioId: editando ? String(editando.funcionarioId) : String(funcionarios[0]?.id ?? ''),
        data: editando?.data ?? hoje,
        quantidade: editando ? String(editando.quantidade) : '',
        status: (editando?.status ?? 'planejado'),
    });
    const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const prodSel = produtos.find((p) => p.id === Number(form.produtoId));
    function submit(e) {
        e.preventDefault();
        const data = {
            produtoId: Number(form.produtoId),
            funcionarioId: Number(form.funcionarioId),
            data: form.data,
            quantidade: Number(form.quantidade),
            status: form.status,
        };
        if (editando)
            onSalvar({ ...data, id: editando.id });
        else
            onSalvar(data);
    }
    return (<div className="flex-1 p-8 overflow-auto" style={{ maxWidth: 800 }}>
      <CadHeader title={editando ? 'Editar Ordem de Fabricação' : 'Ordem de Fabricação'} subtitle="Registre uma nova ordem de produção" onVoltar={onCancelar} voltar="Fabricação"/>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Produto a Fabricar" icon="⟳">
          <Field label="Produto">
            <select value={form.produtoId} onChange={(e) => setF('produtoId', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
              {produtos
            .filter((p) => p.ativo)
            .map((p) => (<option key={p.id} value={p.id}>
                    {p.emoji} {p.nome}
                  </option>))}
            </select>
          </Field>
          {prodSel && (<div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#f5e9d6' }}>
              <span style={{ fontSize: 24 }}>{prodSel.emoji}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: '#321a07' }}>
                  {prodSel.nome}
                </div>
                <div className="text-xs" style={{ color: '#a96e2c' }}>
                  {prodSel.descricao}
                </div>
              </div>
            </div>)}
        </FormSection>

        <FormSection title="Planejamento" icon="📅">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Data de produção">
              <input type="date" value={form.data} onChange={(e) => setF('data', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Quantidade a produzir">
              <input type="number" min="1" value={form.quantidade} onChange={(e) => setF('quantidade', e.target.value)} placeholder="Ex: 100 unidades" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Responsável e Status" icon="◷">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Funcionário responsável">
              <select value={form.funcionarioId} onChange={(e) => setF('funcionarioId', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
                {funcionarios
            .filter((f) => f.ativo)
            .map((f) => (<option key={f.id} value={f.id}>
                      {f.nome} — {f.cargo}
                    </option>))}
              </select>
            </Field>
            <Field label="Status inicial">
              <select value={form.status} onChange={(e) => setF('status', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
                <option value="planejado">Planejado</option>
                <option value="em_producao">Em Produção</option>
                <option value="concluido">Concluído</option>
              </select>
            </Field>
          </div>
        </FormSection>

        <FormActions onCancel={onCancelar} label={editando ? 'Salvar Alterações' : 'Criar Ordem de Fabricação'}/>
      </form>
    </div>);
}
