import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { FormSection } from '@/components/ui/FormSection';
import { CadHeader } from '@/components/ui/CadHeader';
import { FormActions } from '@/components/ui/FormActions';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
const cargos = [
    'Padeiro',
    'Confeiteiro',
    'Atendente',
    'Caixa',
    'Gerente',
    'Auxiliar de Cozinha',
    'Entregador',
    'Supervisor',
];
export function CadastroFuncionario({ editando, onSalvar, onCancelar, }) {
    const [form, setForm] = useState({
        nome: editando?.nome ?? '',
        cargo: editando?.cargo ?? 'Padeiro',
        email: editando?.email ?? '',
        telefone: editando?.telefone ?? '',
        cpf: editando?.cpf ?? '',
        dataAdmissao: editando?.dataAdmissao ?? '',
        salario: editando ? String(editando.salario) : '',
        ativo: editando ? editando.ativo : true,
    });
    const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    function submit(e) {
        e.preventDefault();
        const data = {
            nome: form.nome,
            cargo: form.cargo,
            email: form.email,
            telefone: form.telefone,
            cpf: form.cpf,
            dataAdmissao: form.dataAdmissao,
            salario: Number(form.salario),
            ativo: form.ativo,
        };
        if (editando)
            onSalvar({ ...data, id: editando.id });
        else
            onSalvar(data);
    }
    return (<div className="flex-1 p-8 overflow-auto" style={{ maxWidth: 800 }}>
      <CadHeader title={editando ? 'Editar Funcionário' : 'Cadastro de Funcionário'} subtitle="Registre um novo colaborador na equipe da padaria" onVoltar={onCancelar} voltar="Funcionários"/>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <FormSection title="Dados Pessoais" icon="👤">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome completo">
              <input type="text" value={form.nome} onChange={(e) => setF('nome', e.target.value)} placeholder="Ex: Maria da Silva Santos" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="CPF">
              <input type="text" value={form.cpf} onChange={(e) => setF('cpf', e.target.value)} placeholder="000.000.000-00" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="E-mail">
              <input type="email" value={form.email} onChange={(e) => setF('email', e.target.value)} placeholder="funcionario@padaria.com" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Telefone">
              <input type="text" value={form.telefone} onChange={(e) => setF('telefone', e.target.value)} placeholder="(11) 99999-0000" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
        </FormSection>

        <FormSection title="Vínculo Empregatício" icon="💼">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cargo">
              <select value={form.cargo} onChange={(e) => setF('cargo', e.target.value)} className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}>
                {cargos.map((c) => (<option key={c}>{c}</option>))}
              </select>
            </Field>
            <Field label="Data de admissão">
              <input type="date" value={form.dataAdmissao} onChange={(e) => setF('dataAdmissao', e.target.value)} required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Salário mensal" hint="R$">
              <input type="number" step="0.01" min="0" value={form.salario} onChange={(e) => setF('salario', e.target.value)} placeholder="0,00" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Status">
              <div className="flex gap-3 pt-1">
                {[true, false].map((v) => (<button key={String(v)} type="button" onClick={() => setF('ativo', v)} className="flex-1 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer" style={{
                background: form.ativo === v ? (v ? '#d1fae5' : '#fce8e6') : '#fdf8f3',
                color: form.ativo === v ? (v ? '#065f46' : '#c0392b') : '#a96e2c',
                border: `1.5px solid ${form.ativo === v ? (v ? '#6ee7b7' : '#fca5a5') : '#f2ead8'}`,
            }}>
                    {v ? '✓ Ativo' : '✗ Inativo'}
                  </button>))}
              </div>
            </Field>
          </div>
        </FormSection>

        <FormActions onCancel={onCancelar} label={editando ? 'Salvar Alterações' : 'Cadastrar Funcionário'}/>
      </form>
    </div>);
}
