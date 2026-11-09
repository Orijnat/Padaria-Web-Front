import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
import { validarUsuario } from '@/lib/validacao';
const COR_ERRO = '#c0392b';
function ErroCampo({ children }) {
    if (!children)
        return null;
    return (<p className="text-xs mt-1.5" style={{ color: COR_ERRO }}>
      {children}
    </p>);
}
function AlertaErro({ children }) {
    if (!children)
        return null;
    return (<p role="alert" className="text-xs px-3 py-2 rounded" style={{ background: '#fce8e6', color: COR_ERRO }}>
      {children}
    </p>);
}
// Estilo do input: borda vermelha quando o campo tem erro.
function estiloCampo(erro) {
    return inp(erro ? { borderColor: COR_ERRO } : undefined);
}
export function LoginCliente({ onEntrar, onCadastrar, onVoltar, }) {
    const [aba, setAba] = useState('entrar');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [erros, setErros] = useState({});
    // Entrar
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    // Criar conta
    const [nome, setNome] = useState('');
    const [cEmail, setCEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cSenha, setCSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    function trocarAba(a) {
        setAba(a);
        setErro('');
        setErros({});
    }
    // Some com o erro de um campo assim que a pessoa começa a corrigi-lo.
    function alterar(campo, setter) {
        return (e) => {
            setter(e.target.value);
            if (erros[campo])
                setErros(({ [campo]: _, ...resto }) => resto);
        };
    }
    async function submitLogin(e) {
        e.preventDefault();
        setErro('');
        if (!email.trim() || !senha) {
            setErro('Informe e-mail e senha.');
            return;
        }
        setCarregando(true);
        const r = await onEntrar(email.trim(), senha);
        setCarregando(false);
        if (!r.ok)
            setErro(r.erro);
    }
    async function submitCadastro(e) {
        e.preventDefault();
        setErro('');
        const dados = { nome, email: cEmail, telefone, senha: cSenha };
        // Mesmas regras do servidor, para dar retorno imediato.
        const { erros: errosValidacao } = validarUsuario(dados);
        const novos = { ...errosValidacao };
        if (confirmacao !== cSenha)
            novos.confirmacao = 'As senhas não conferem.';
        setErros(novos);
        if (Object.keys(novos).length)
            return;
        setCarregando(true);
        const r = await onCadastrar(dados);
        setCarregando(false);
        if (!r.ok) {
            setErros(r.campos);
            if (!Object.keys(r.campos).length)
                setErro(r.erro);
        }
    }
    const botao = 'py-3 rounded-lg text-sm font-semibold mt-2 cursor-pointer shadow transition-all hover:brightness-110 disabled:cursor-wait disabled:opacity-70';
    return (<div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#faf6f0' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="fade-up">
        <button onClick={onVoltar} className="text-sm mb-6 flex items-center gap-1 cursor-pointer transition-colors" style={{ color: '#a96e2c' }}>
          ← Voltar ao início
        </button>
        <div className="font-display text-3xl font-semibold italic mb-2" style={{ color: '#4e2b0e' }}>
          Bem-vindo!
        </div>
        <p className="text-sm mb-8" style={{ color: '#a96e2c' }}>
          Acesse para pedir fornadas frescas todos os dias
        </p>

        <div role="tablist" className="flex rounded-xl overflow-hidden mb-8 shadow-sm" style={{ border: '1px solid #e9d0aa' }}>
          {['entrar', 'cadastrar'].map((a) => (<button key={a} type="button" role="tab" aria-selected={aba === a} onClick={() => trocarAba(a)} className="flex-1 py-3 text-sm font-medium cursor-pointer transition-all" style={{
                background: aba === a ? '#8a5420' : '#fff',
                color: aba === a ? '#faf6f0' : '#a96e2c',
            }}>
              {a === 'entrar' ? 'Entrar' : 'Criar conta'}
            </button>))}
        </div>

        {aba === 'entrar' ? (<form onSubmit={submitLogin} noValidate className="flex flex-col gap-4">
            <Field label="E-mail">
              <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Senha">
              <input type="password" name="senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <AlertaErro>{erro}</AlertaErro>
            <button type="submit" disabled={carregando} className={botao} style={{ background: '#8a5420', color: '#faf6f0' }}>
              {carregando ? 'Entrando…' : 'Entrar'}
            </button>
          </form>) : (<form onSubmit={submitCadastro} noValidate className="flex flex-col gap-4">
            <Field label="Nome completo">
              <input type="text" name="nome" autoComplete="name" value={nome} onChange={alterar('nome', setNome)} placeholder="Ex: Ana Maria" required className={IC} style={estiloCampo(erros.nome)} aria-invalid={!!erros.nome}/>
              <ErroCampo>{erros.nome}</ErroCampo>
            </Field>
            <Field label="E-mail">
              <input type="email" name="email" autoComplete="email" value={cEmail} onChange={alterar('email', setCEmail)} placeholder="seu@email.com" required className={IC} style={estiloCampo(erros.email)} aria-invalid={!!erros.email}/>
              <ErroCampo>{erros.email}</ErroCampo>
            </Field>
            <Field label="Telefone" hint="opcional">
              <input type="tel" name="telefone" autoComplete="tel" inputMode="tel" value={telefone} onChange={alterar('telefone', setTelefone)} placeholder="(49) 99999-9999" className={IC} style={estiloCampo(erros.telefone)} aria-invalid={!!erros.telefone}/>
              <ErroCampo>{erros.telefone}</ErroCampo>
            </Field>
            <Field label="Senha" hint="mín. 8 caracteres, com letras e números">
              <input type="password" name="senha" autoComplete="new-password" value={cSenha} onChange={alterar('senha', setCSenha)} placeholder="••••••••" required className={IC} style={estiloCampo(erros.senha)} aria-invalid={!!erros.senha}/>
              <ErroCampo>{erros.senha}</ErroCampo>
            </Field>
            <Field label="Confirmar senha">
              <input type="password" name="confirmacao" autoComplete="new-password" value={confirmacao} onChange={alterar('confirmacao', setConfirmacao)} placeholder="••••••••" required className={IC} style={estiloCampo(erros.confirmacao)} aria-invalid={!!erros.confirmacao}/>
              <ErroCampo>{erros.confirmacao}</ErroCampo>
            </Field>
            <AlertaErro>{erro}</AlertaErro>
            <button type="submit" disabled={carregando} className={botao} style={{ background: '#8a5420', color: '#faf6f0' }}>
              {carregando ? 'Criando conta…' : 'Criar conta e entrar'}
            </button>
          </form>)}
      </div>
    </div>);
}
