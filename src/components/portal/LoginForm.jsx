'use client';
import { useState } from 'react';
import styles from './LoginForm.module.css';

/**
 * Formulário de login compartilhado — mesmo visual para Admin e Cliente.
 *
 * Props:
 *   titulo     – texto do título (ex: "Padaria")
 *   subtitulo  – texto abaixo do título (ex: "Acesse sua conta")
 *   onEntrar   – async (email, senha) => { ok, erro }
 *   onVoltar   – função chamada ao clicar em "Voltar" (opcional)
 *   labelBotao – texto do botão principal (padrão: "Entrar")
 */
export function LoginForm({ titulo = 'Padaria', subtitulo = 'Acesse sua conta', onEntrar, onVoltar, labelBotao = 'Entrar' }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleEntrar() {
    setMensagem('');
    setErro('');
    setCarregando(true);

    try {
      const resultado = await onEntrar(email, senha);
      if (resultado && resultado.ok === false) {
        setErro(resultado.erro || 'Credenciais inválidas.');
      } else if (resultado && resultado.usuario) {
        setMensagem(`Bem-vindo, ${resultado.usuario.nome}!`);
      }
    } catch (e) {
      setErro(e?.response?.data?.erro || e?.response?.data?.message || 'Não foi possível conectar.');
    }

    setCarregando(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>{titulo}</h1>
        <p className={styles.subtitulo}>{subtitulo}</p>

        <label className={styles.label}>E-mail</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />

        <label className={styles.label}>Senha</label>
        <input
          className={styles.input}
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Sua senha"
          onKeyDown={(e) => e.key === 'Enter' && !carregando && handleEntrar()}
        />

        <button className={styles.botao} onClick={handleEntrar} disabled={carregando}>
          {carregando ? 'Entrando...' : labelBotao}
        </button>

        {onVoltar && (
          <button className={styles.botaoVoltar} onClick={onVoltar}>
            ← Voltar
          </button>
        )}

        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        {erro && <p className={styles.erro}>{erro}</p>}
      </div>
    </div>
  );
}
