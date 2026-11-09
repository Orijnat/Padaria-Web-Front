import React, { useState } from 'react';
import { Field } from '@/components/ui/Field';
import { inp, IC, focusBrown, blurBrown } from '@/components/ui/styles';
export function LoginAdmin({ onLogin, onVoltar }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    function submit(e) {
        e.preventDefault();
        if (email === 'admin@padaria.com' && senha === '123456') {
            onLogin();
        }
        else {
            setErro('Credenciais incorretas. Tente: admin@padaria.com / 123456');
        }
    }
    return (<div className="min-h-screen flex" style={{ background: '#faf6f0' }}>
      <div className="hidden lg:flex flex-col justify-between p-12 shadow-xl" style={{ width: 480, background: '#4e2b0e', flexShrink: 0 }}>
        <div>
          <button onClick={onVoltar} className="text-xs mb-8 flex items-center gap-1 cursor-pointer transition-colors" style={{ color: '#c48d4a' }}>
            ← Voltar ao início
          </button>
          <div className="font-display text-4xl font-semibold italic" style={{ color: '#f5e9d6' }}>
            Padaria
          </div>
          <div className="text-sm mt-1" style={{ color: '#d9b07a' }}>
            Gestão & Produção
          </div>
        </div>
        <div>
          <div className="font-display text-3xl italic" style={{ color: '#f2ead8' }}>
            &ldquo;Cada pão conta
            <br />
            uma história.&rdquo;
          </div>
        </div>
        <div className="flex gap-8">
          {[
            ['48', 'Receitas'],
            ['12', 'Produtos'],
            ['6', 'Fornecedores'],
        ].map(([n, l]) => (<div key={l}>
              <div className="font-display text-3xl font-semibold" style={{ color: '#e8a020' }}>
                {n}
              </div>
              <div className="text-xs" style={{ color: '#a96e2c' }}>
                {l}
              </div>
            </div>))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <button onClick={onVoltar} className="text-sm mb-6 lg:hidden cursor-pointer" style={{ color: '#a96e2c' }}>
            ← Voltar ao início
          </button>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: '#321a07' }}>
            Acesso Administrativo
          </h1>
          <p className="text-sm mb-8" style={{ color: '#a96e2c' }}>
            Gestão interna e produção da padaria
          </p>
          <form onSubmit={submit} className="flex flex-col gap-5">
            <Field label="E-mail">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@padaria.com" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            <Field label="Senha">
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" required className={IC} style={inp()} onFocus={focusBrown} onBlur={blurBrown}/>
            </Field>
            {erro && (<p className="text-xs px-3 py-2 rounded" style={{ background: '#fce8e6', color: '#c0392b' }}>
                {erro}
              </p>)}
            <button type="submit" className="py-3 rounded-lg text-sm font-semibold cursor-pointer shadow transition-all hover:brightness-110" style={{ background: '#8a5420', color: '#faf6f0' }}>
              Entrar no Painel
            </button>
            <div className="text-xs text-center mt-2" style={{ color: '#a96e2c' }}>
              Dica: use <strong>admin@padaria.com</strong> e senha <strong>123456</strong>
            </div>
          </form>
        </div>
      </div>
    </div>);
}
