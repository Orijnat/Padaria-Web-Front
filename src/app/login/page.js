'use client';

import { useState } from 'react';
import api, { CHAVE_TOKEN } from '@/utils/axios';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setMensagem('');
    setCarregando(true);

    try {
      const { data } = await api.post('/auth/login', { email, senha });

      if (data?.token) {
        localStorage.setItem(CHAVE_TOKEN, data.token);
      }

      setMensagem(`Bem-vindo, ${data.usuario.nome}!`);
    } catch (erro) {
      const msg = erro?.response?.data?.erro || erro?.response?.data?.message || 'Não foi possível conectar à API.';
      setMensagem(msg);
    }

    setCarregando(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.titulo}>Padaria</h1>
        <p className={styles.subtitulo}>Acesse sua conta</p>

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
        />

        <button className={styles.botao} onClick={entrar} disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
      </div>
    </div>
  );
}
