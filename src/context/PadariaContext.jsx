'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { categoriasBase, funcionariosBase, insumosBase, receitasBase, produtosBase, fabricacoesBase, pedidosBase, clientesBase, } from '@/data/mockData';
import api from '@/utils/api';
const PadariaContext = createContext(undefined);
export function PadariaProvider({ children }) {
    const [insumos, setInsumos] = useState(insumosBase);
    const [receitas, setReceitas] = useState(receitasBase);
    const [produtos, setProdutos] = useState(produtosBase);
    const [fabricacoes, setFabricacoes] = useState(fabricacoesBase);
    const [funcionarios, setFuncionarios] = useState(funcionariosBase);
    const [categorias, setCategorias] = useState(categoriasBase);
    const [pedidos, setPedidos] = useState(pedidosBase);
    const [clientes, setClientes] = useState(clientesBase);
    const [adminLogado, setAdminLogado] = useState(false);
    const [clienteLogado, setClienteLogado] = useState(null);
    // 1. Carregamento inicial de localStorage e sincronização com API
    useEffect(() => {
        try {
            const savedInsumos = localStorage.getItem('padaria_insumos');
            if (savedInsumos)
                setInsumos(JSON.parse(savedInsumos));
            const savedReceitas = localStorage.getItem('padaria_receitas');
            if (savedReceitas)
                setReceitas(JSON.parse(savedReceitas));
            const savedProdutos = localStorage.getItem('padaria_produtos');
            if (savedProdutos)
                setProdutos(JSON.parse(savedProdutos));
            const savedFabricacoes = localStorage.getItem('padaria_fabricacoes');
            if (savedFabricacoes)
                setFabricacoes(JSON.parse(savedFabricacoes));
            const savedFuncionarios = localStorage.getItem('padaria_funcionarios');
            if (savedFuncionarios)
                setFuncionarios(JSON.parse(savedFuncionarios));
            const savedCategorias = localStorage.getItem('padaria_categorias');
            if (savedCategorias)
                setCategorias(JSON.parse(savedCategorias));
            const savedPedidos = localStorage.getItem('padaria_pedidos');
            if (savedPedidos)
                setPedidos(JSON.parse(savedPedidos));
            const savedClientes = localStorage.getItem('padaria_clientes');
            if (savedClientes)
                setClientes(JSON.parse(savedClientes));
        }
        catch { }
        // Sincronização opcional se API estiver disponível
        async function syncWithApi() {
            try {
                const resInsumos = await api.get('/insumos');
                if (Array.isArray(resInsumos.data) && resInsumos.data.length > 0) {
                    const mapped = resInsumos.data.map((item) => ({
                        id: item.id,
                        nome: item.nome,
                        unidade: item.unidade_medida || item.unidade || 'kg',
                        estoque: item.quantidade_atual !== undefined ? item.quantidade_atual : (item.estoque || 0),
                        minimo: item.estoque_minimo !== undefined ? item.estoque_minimo : (item.minimo || 0),
                        custo: Number(item.custo) || 0,
                        fornecedor: item.fornecedor || '',
                    }));
                    setInsumos(mapped);
                }
            }
            catch { }
            try {
                const resProdutos = await api.get('/produtos');
                if (Array.isArray(resProdutos.data) && resProdutos.data.length > 0) {
                    const mapped = resProdutos.data.map((item) => ({
                        id: item.id,
                        nome: item.nome,
                        categoriaId: item.categoria_id || item.categoriaId || 1,
                        receitaId: item.receita_id || item.receitaId || null,
                        preco: Number(item.preco) || 0,
                        ativo: item.ativo !== undefined ? Boolean(item.ativo) : true,
                        descricao: item.descricao || '',
                        emoji: item.emoji || '🥖',
                    }));
                    setProdutos(mapped);
                }
            }
            catch { }
        }
        syncWithApi();
    }, []);
    // 2. Persistência no LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem('padaria_insumos', JSON.stringify(insumos));
        }
        catch { }
    }, [insumos]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_receitas', JSON.stringify(receitas));
        }
        catch { }
    }, [receitas]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_produtos', JSON.stringify(produtos));
        }
        catch { }
    }, [produtos]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_fabricacoes', JSON.stringify(fabricacoes));
        }
        catch { }
    }, [fabricacoes]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_funcionarios', JSON.stringify(funcionarios));
        }
        catch { }
    }, [funcionarios]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_categorias', JSON.stringify(categorias));
        }
        catch { }
    }, [categorias]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_pedidos', JSON.stringify(pedidos));
        }
        catch { }
    }, [pedidos]);
    useEffect(() => {
        try {
            localStorage.setItem('padaria_clientes', JSON.stringify(clientes));
        }
        catch { }
    }, [clientes]);
    // Insumo actions
    async function salvarInsumo(i) {
        if ('id' in i) {
            setInsumos((p) => p.map((x) => (x.id === i.id ? i : x)));
            try {
                await api.put(`/insumos/${i.id}`, {
                    nome: i.nome,
                    unidade_medida: i.unidade,
                    quantidade_atual: i.estoque,
                    estoque_minimo: i.minimo,
                    custo: i.custo,
                    fornecedor: i.fornecedor,
                });
            }
            catch { }
        }
        else {
            const tempId = Date.now();
            const novo = { ...i, id: tempId };
            setInsumos((p) => [...p, novo]);
            try {
                const res = await api.post('/insumos', {
                    nome: i.nome,
                    unidade_medida: i.unidade,
                    quantidade_atual: i.estoque,
                    estoque_minimo: i.minimo,
                    custo: i.custo,
                    fornecedor: i.fornecedor,
                });
                if (res.data?.id) {
                    setInsumos((p) => p.map((x) => (x.id === tempId ? { ...novo, id: res.data.id } : x)));
                }
            }
            catch { }
        }
    }
    async function excluirInsumo(id) {
        setInsumos((p) => p.filter((x) => x.id !== id));
        try {
            await api.delete(`/insumos/${id}`);
        }
        catch { }
    }
    // Receita actions
    function salvarReceita(r) {
        if ('id' in r) {
            setReceitas((p) => p.map((x) => (x.id === r.id ? r : x)));
        }
        else {
            setReceitas((p) => [...p, { ...r, id: Date.now() }]);
        }
    }
    function excluirReceita(id) {
        setReceitas((p) => p.filter((x) => x.id !== id));
    }
    // Produto actions
    async function salvarProduto(p) {
        if ('id' in p) {
            setProdutos((prev) => prev.map((x) => (x.id === p.id ? p : x)));
            try {
                await api.put(`/produtos/${p.id}`, {
                    nome: p.nome,
                    preco: p.preco,
                    categoria_id: p.categoriaId,
                    receita_id: p.receitaId,
                    descricao: p.descricao,
                    emoji: p.emoji,
                    ativo: p.ativo,
                });
            }
            catch { }
        }
        else {
            const tempId = Date.now();
            const novo = { ...p, id: tempId, ativo: true };
            setProdutos((prev) => [...prev, novo]);
            try {
                const res = await api.post('/produtos', {
                    nome: p.nome,
                    preco: p.preco,
                    categoria_id: p.categoriaId,
                    receita_id: p.receitaId,
                    descricao: p.descricao,
                    emoji: p.emoji,
                    ativo: true,
                });
                if (res.data?.id) {
                    setProdutos((prev) => prev.map((x) => (x.id === tempId ? { ...novo, id: res.data.id } : x)));
                }
            }
            catch { }
        }
    }
    function alternarStatusProduto(id) {
        setProdutos((p) => p.map((x) => (x.id === id ? { ...x, ativo: !x.ativo } : x)));
    }
    async function excluirProduto(id) {
        setProdutos((p) => p.filter((x) => x.id !== id));
        try {
            await api.delete(`/produtos/${id}`);
        }
        catch { }
    }
    // Fabricacao actions
    function salvarFab(f) {
        if ('id' in f) {
            setFabricacoes((p) => p.map((x) => (x.id === f.id ? f : x)));
        }
        else {
            setFabricacoes((p) => [...p, { ...f, id: Date.now() }]);
        }
    }
    function excluirFab(id) {
        setFabricacoes((p) => p.filter((x) => x.id !== id));
    }
    function mudarStatusFabricacao(id, s) {
        setFabricacoes((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
    }
    // Funcionario actions
    function salvarFunc(f) {
        if ('id' in f) {
            setFuncionarios((p) => p.map((x) => (x.id === f.id ? f : x)));
        }
        else {
            setFuncionarios((p) => [...p, { ...f, id: Date.now() }]);
        }
    }
    function excluirFunc(id) {
        setFuncionarios((p) => p.filter((x) => x.id !== id));
    }
    // Categoria actions
    function salvarCat(c) {
        if ('id' in c) {
            setCategorias((p) => p.map((x) => (x.id === c.id ? c : x)));
        }
        else {
            setCategorias((p) => [...p, { ...c, id: Date.now() }]);
        }
    }
    function excluirCat(id) {
        setCategorias((p) => p.filter((x) => x.id !== id));
    }
    // Pedidos & Clientes
    function mudarStatusPedido(id, s) {
        setPedidos((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
    }
    function novoPedidoCliente(p) {
        setPedidos((prev) => [...prev, { ...p, id: Date.now() }]);
    }
    function cadastrarCliente(nome, email, senha) {
        const novo = { id: Date.now(), nome, email, senha };
        setClientes((p) => [...p, novo]);
        api.post('/clientes', { nome, email }).catch(() => { });
        return novo;
    }
    return (<PadariaContext.Provider value={{
            insumos,
            receitas,
            produtos,
            fabricacoes,
            funcionarios,
            categorias,
            pedidos,
            clientes,
            adminLogado,
            clienteLogado,
            setAdminLogado,
            setClienteLogado,
            salvarInsumo,
            excluirInsumo,
            salvarReceita,
            excluirReceita,
            salvarProduto,
            alternarStatusProduto,
            excluirProduto,
            salvarFab,
            excluirFab,
            mudarStatusFabricacao,
            salvarFunc,
            excluirFunc,
            salvarCat,
            excluirCat,
            mudarStatusPedido,
            novoPedidoCliente,
            cadastrarCliente,
        }}>
      {children}
    </PadariaContext.Provider>);
}
export function usePadaria() {
    const context = useContext(PadariaContext);
    if (!context) {
        throw new Error('usePadaria deve ser usado dentro de um PadariaProvider');
    }
    return context;
}
