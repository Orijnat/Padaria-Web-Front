'use client';
import React, { useState } from 'react';
import { usePadaria } from '@/context/PadariaContext';
// UI & Layout
import { Sidebar } from '@/components/admin/Sidebar';
import { Dashboard } from '@/components/admin/Dashboard';
import { Vendas } from '@/components/admin/Vendas';
// Forms
import { CadastroInsumo } from '@/components/admin/forms/CadastroInsumo';
import { CadastroReceita } from '@/components/admin/forms/CadastroReceita';
import { CadastroProduto } from '@/components/admin/forms/CadastroProduto';
import { CadastroFabricacao } from '@/components/admin/forms/CadastroFabricacao';
import { CadastroFuncionario } from '@/components/admin/forms/CadastroFuncionario';
import { CadastroCategoria } from '@/components/admin/forms/CadastroCategoria';
// Lists
import { ListaInsumos } from '@/components/admin/lists/ListaInsumos';
import { ListaReceitas } from '@/components/admin/lists/ListaReceitas';
import { ListaProdutos } from '@/components/admin/lists/ListaProdutos';
import { ListaFabricacao } from '@/components/admin/lists/ListaFabricacao';
import { ListaFuncionarios } from '@/components/admin/lists/ListaFuncionarios';
import { ListaCategorias } from '@/components/admin/lists/ListaCategorias';
// Portal
import { EscolhaAcesso } from '@/components/portal/EscolhaAcesso';
import { LoginAdmin } from '@/components/portal/LoginAdmin';
import { LoginCliente } from '@/components/portal/LoginCliente';
import { PortalCliente } from '@/components/portal/PortalCliente';
export default function Home() {
    const [modo, setModo] = useState('escolha');
    const [screen, setScreen] = useState('dashboard');
    // Edit targets
    const [editInsumo, setEditInsumo] = useState(null);
    const [editReceita, setEditReceita] = useState(null);
    const [editProduto, setEditProduto] = useState(null);
    const [editFab, setEditFab] = useState(null);
    const [editFunc, setEditFunc] = useState(null);
    const [editCat, setEditCat] = useState(null);
    const { insumos, receitas, produtos, fabricacoes, funcionarios, categorias, pedidos, clientes, adminLogado, clienteLogado, setAdminLogado, setClienteLogado, salvarInsumo, excluirInsumo, salvarReceita, excluirReceita, salvarProduto, alternarStatusProduto, excluirProduto, salvarFab, excluirFab, mudarStatusFabricacao, salvarFunc, excluirFunc, salvarCat, excluirCat, mudarStatusPedido, novoPedidoCliente, cadastrarCliente, } = usePadaria();
    function navTo(s) {
        setScreen(s);
        setEditInsumo(null);
        setEditReceita(null);
        setEditProduto(null);
        setEditFab(null);
        setEditFunc(null);
        setEditCat(null);
    }
    // Handlers
    async function handleSalvarInsumo(i) {
        await salvarInsumo(i);
        navTo('insumos');
    }
    function handleSalvarReceita(r) {
        salvarReceita(r);
        navTo('receitas');
    }
    async function handleSalvarProduto(p) {
        await salvarProduto(p);
        navTo('produtos');
    }
    function handleSalvarFab(f) {
        salvarFab(f);
        navTo('fabricacao');
    }
    function handleSalvarFunc(f) {
        salvarFunc(f);
        navTo('funcionarios');
    }
    function handleSalvarCat(c) {
        salvarCat(c);
        navTo('categorias');
    }
    // View dispatch
    if (modo === 'escolha') {
        return (<EscolhaAcesso onAdmin={() => setModo('admin')} onCliente={() => setModo('cliente')}/>);
    }
    if (modo === 'cliente') {
        if (!clienteLogado) {
            return (<LoginCliente clientes={clientes} onLogin={setClienteLogado} onCadastrar={cadastrarCliente} onVoltar={() => setModo('escolha')}/>);
        }
        return (<PortalCliente cliente={clienteLogado} produtos={produtos} categorias={categorias} pedidos={pedidos} onNovoPedido={novoPedidoCliente} onLogout={() => {
                setClienteLogado(null);
                setModo('escolha');
            }}/>);
    }
    if (!adminLogado) {
        return (<LoginAdmin onLogin={() => setAdminLogado(true)} onVoltar={() => setModo('escolha')}/>);
    }
    return (<div style={{ display: 'flex', minHeight: '100vh', background: '#faf6f0' }}>
      <Sidebar current={screen} onNav={navTo} onLogout={() => {
            setAdminLogado(false);
            setModo('escolha');
        }}/>

      {screen === 'dashboard' && (<Dashboard insumos={insumos} receitas={receitas} produtos={produtos} fabricacoes={fabricacoes} pedidos={pedidos} funcionarios={funcionarios}/>)}

      {screen === 'insumos' && (<ListaInsumos insumos={insumos} categorias={categorias} onNovo={() => {
                setEditInsumo(null);
                setScreen('cad-insumo');
            }} onEditar={(i) => {
                setEditInsumo(i);
                setScreen('cad-insumo');
            }} onExcluir={excluirInsumo}/>)}
      {screen === 'cad-insumo' && (<CadastroInsumo editando={editInsumo} onSalvar={handleSalvarInsumo} onCancelar={() => navTo('insumos')}/>)}

      {screen === 'receitas' && (<ListaReceitas receitas={receitas} insumos={insumos} categorias={categorias} onNova={() => {
                setEditReceita(null);
                setScreen('cad-receita');
            }} onEditar={(r) => {
                setEditReceita(r);
                setScreen('cad-receita');
            }} onExcluir={excluirReceita}/>)}
      {screen === 'cad-receita' && (<CadastroReceita editando={editReceita} insumos={insumos} categorias={categorias} onSalvar={handleSalvarReceita} onCancelar={() => navTo('receitas')}/>)}

      {screen === 'produtos' && (<ListaProdutos produtos={produtos} categorias={categorias} receitas={receitas} onNovo={() => {
                setEditProduto(null);
                setScreen('cad-produto');
            }} onEditar={(p) => {
                setEditProduto(p);
                setScreen('cad-produto');
            }} onToggle={alternarStatusProduto} onExcluir={excluirProduto}/>)}
      {screen === 'cad-produto' && (<CadastroProduto editando={editProduto} categorias={categorias} receitas={receitas} onSalvar={handleSalvarProduto} onCancelar={() => navTo('produtos')}/>)}

      {screen === 'fabricacao' && (<ListaFabricacao fabricacoes={fabricacoes} produtos={produtos} funcionarios={funcionarios} onNova={() => {
                setEditFab(null);
                setScreen('cad-fabricacao');
            }} onEditar={(f) => {
                setEditFab(f);
                setScreen('cad-fabricacao');
            }} onExcluir={excluirFab} onMudarStatus={mudarStatusFabricacao}/>)}
      {screen === 'cad-fabricacao' && (<CadastroFabricacao editando={editFab} produtos={produtos} funcionarios={funcionarios} onSalvar={handleSalvarFab} onCancelar={() => navTo('fabricacao')}/>)}

      {screen === 'funcionarios' && (<ListaFuncionarios funcionarios={funcionarios} onNovo={() => {
                setEditFunc(null);
                setScreen('cad-funcionario');
            }} onEditar={(f) => {
                setEditFunc(f);
                setScreen('cad-funcionario');
            }} onExcluir={excluirFunc}/>)}
      {screen === 'cad-funcionario' && (<CadastroFuncionario editando={editFunc} onSalvar={handleSalvarFunc} onCancelar={() => navTo('funcionarios')}/>)}

      {screen === 'categorias' && (<ListaCategorias categorias={categorias} onNova={() => {
                setEditCat(null);
                setScreen('cad-categoria');
            }} onEditar={(c) => {
                setEditCat(c);
                setScreen('cad-categoria');
            }} onExcluir={excluirCat}/>)}
      {screen === 'cad-categoria' && (<CadastroCategoria editando={editCat} onSalvar={handleSalvarCat} onCancelar={() => navTo('categorias')}/>)}

      {screen === 'vendas' && (<Vendas pedidos={pedidos} produtos={produtos} onMudarStatus={mudarStatusPedido}/>)}
    </div>);
}
