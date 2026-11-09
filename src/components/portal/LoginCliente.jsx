import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
export function LoginCliente({ clientes, onLogin, onCadastrar, onVoltar, }) {
    const [aba, setAba] = useState('entrar');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [nome, setNome] = useState('');
    const [cEmail, setCEmail] = useState('');
    const [cSenha, setCSenha] = useState('');
    function submitLogin(e) {
        e.preventDefault();
        const c = clientes.find((c) => c.email.toLowerCase() === email.toLowerCase() && c.senha === senha);
        if (c) {
            onLogin(c);
        }
        else {
            setErro('E-mail ou senha inválidos. Exemplo: ana@email.com / 123');
        }
    }
    function submitCadastro(e) {
        e.preventDefault();
        const existente = clientes.find((c) => c.email.toLowerCase() === cEmail.toLowerCase());
        if (existente) {
            setErro('Já existe uma conta com este e-mail.');
            return;
        }
        const novo = onCadastrar(nome, cEmail, cSenha);
        onLogin(novo);
    }
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

        <div className="flex rounded-xl overflow-hidden mb-8 shadow-sm" style={{ border: '1px solid #e9d0aa' }}>
          {['entrar', 'cadastrar'].map((a) => (<button key={a} onClick={() => {
                setAba(a);
                setErro('');
            }} className="flex-1 py-3 text-sm font-medium cursor-pointer transition-all" style={{
                background: aba === a ? '#8a5420' : '#fff',
                color: aba === a ? '#faf6f0' : '#a96e2c',
            }}>
              {a === 'entrar' ? 'Entrar' : 'Criar conta'}
            </button>))}
        </div>

        {aba === 'entrar' ? (<form onSubmit={submitLogin} className="flex flex-col gap-4">
            <Field label="E-mail">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Senha">
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            {erro && (<p className="text-xs px-3 py-2 rounded" style={{ background: '#fce8e6', color: '#c0392b' }}>
                {erro}
              </p>)}
            <button type="submit" className="py-3 rounded-lg text-sm font-semibold mt-2 cursor-pointer shadow transition-all hover:brightness-110" style={{ background: '#8a5420', color: '#faf6f0' }}>
              Entrar
            </button>
            <div className="text-xs text-center mt-2" style={{ color: '#a96e2c' }}>
              Conta de teste: <strong>ana@email.com</strong> / senha <strong>123</strong>
            </div>
          </form>) : (<form onSubmit={submitCadastro} className="flex flex-col gap-4">
            <Field label="Nome completo">
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Ana Maria" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="E-mail">
              <input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="seu@email.com" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Senha">
              <input type="password" value={cSenha} onChange={(e) => setCSenha(e.target.value)} placeholder="Mínimo 3 caracteres" minLength={3} required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            {erro && (<p className="text-xs px-3 py-2 rounded" style={{ background: '#fce8e6', color: '#c0392b' }}>
                {erro}
              </p>)}
            <button type="submit" className="py-3 rounded-lg text-sm font-semibold mt-2 cursor-pointer shadow transition-all hover:brightness-110" style={{ background: '#8a5420', color: '#faf6f0' }}>
              Criar conta e entrar
            </button>
          </form>)}
      </div>
    </div>);
}
