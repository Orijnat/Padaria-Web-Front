'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { categoriasBase, funcionariosBase, insumosBase, receitasBase, produtosBase, fabricacoesBase, pedidosBase, } from '@/data/mockData';
import api, { CHAVE_TOKEN } from '@/utils/axios';
// Mensagem de erro amigável a partir de uma falha do axios.
function falhaDaApi(e) {
    return {
        ok: false,
        erro: e?.response?.data?.erro ?? e?.response?.data?.message ?? 'Sem conexão com o servidor. Tente novamente.',
        campos: e?.response?.data?.campos ?? e?.response?.data?.errors ?? {},
    };
}
function tokenValido(token) {
    try {
        const { exp } = jwtDecode(token);
        return !exp || exp * 1000 > Date.now();
    }
    catch {
        return false;
    }
}
function getSaved(key, fallback) {
    if (typeof window === 'undefined') return fallback;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

const PadariaContext = createContext(undefined);
export function PadariaProvider({ children }) {
    const [insumos, setInsumos] = useState(() => getSaved('padaria_insumos', insumosBase));
    const [receitas, setReceitas] = useState(() => getSaved('padaria_receitas', receitasBase));
    const [produtos, setProdutos] = useState(() => getSaved('padaria_produtos', produtosBase));
    const [fabricacoes, setFabricacoes] = useState(() => getSaved('padaria_fabricacoes', fabricacoesBase));
    const [funcionarios, setFuncionarios] = useState(() => getSaved('padaria_funcionarios', funcionariosBase));
    const [categorias, setCategorias] = useState(() => getSaved('padaria_categorias', categoriasBase));
    const [pedidos, setPedidos] = useState(() => getSaved('padaria_pedidos', pedidosBase));
    const [adminLogado, setAdminLogado] = useState(false);
    const [clienteLogado, setClienteLogado] = useState(null);
    // Ressincroniza todos os dados com a API após login de funcionário.
    async function sincronizarComApi() {
        // Insumos
        try {
            const resInsumos = await api.get('/insumos');
            if (Array.isArray(resInsumos.data) && resInsumos.data.length > 0) {
                setInsumos(resInsumos.data.map((item) => ({
                    id: item.id,
                    nome: item.nome,
                    unidade: item.unidadeMedida || 'kg',
                    estoque: Number(item.quantidadeAtual) || 0,
                    minimo: Number(item.estoqueMinimo) || 0,
                    custo: Number(item.custo) || 0,
                    fornecedor: item.fornecedor || '',
                })));
            }
        } catch { }
        // Produtos
        try {
            const resProdutos = await api.get('/produtos');
            if (Array.isArray(resProdutos.data) && resProdutos.data.length > 0) {
                setProdutos(resProdutos.data.map((item) => ({
                    id: item.id,
                    nome: item.nome,
                    categoriaId: item.categoriaId || 1,
                    receitaId: item.receitaId || null,
                    preco: Number(item.preco) || 0,
                    ativo: item.ativo !== undefined ? Boolean(item.ativo) : true,
                    descricao: item.descricao || '',
                    emoji: item.emoji || '',
                    estoque: Number(item.estoque) || 0,
                })));
            }
        } catch { }
        // Categorias (pública)
        try {
            const resCat = await api.get('/categorias');
            if (Array.isArray(resCat.data) && resCat.data.length > 0) {
                setCategorias(resCat.data.map((c) => ({
                    id: c.id,
                    nome: c.nome,
                    descricao: c.descricao || '',
                    emoji: c.emoji || '',
                    cor: c.cor || '#c48d4a',
                    ativo: c.ativo !== false,
                })));
            }
        } catch { }
        // Receitas (protegida por funcionário)
        try {
            const resReceitas = await api.get('/receitas');
            if (Array.isArray(resReceitas.data) && resReceitas.data.length > 0) {
                setReceitas(resReceitas.data.map((r) => ({
                    id: r.id,
                    nome: r.nome,
                    rendimento: Number(r.rendimento) || 1,
                    unidadeRendimento: r.unidadeRendimento || 'un',
                    tempoPreparo: r.tempoPreparo || '',
                    ingredientes: Array.isArray(r.ingredientes) ? r.ingredientes : [],
                })));
            }
        } catch { }
        // Fabricações (protegida por funcionário)
        try {
            const resFab = await api.get('/fabricacoes');
            if (Array.isArray(resFab.data) && resFab.data.length > 0) {
                setFabricacoes(resFab.data.map((f) => ({
                    id: f.id,
                    produtoId: f.produtoId,
                    funcionarioId: f.funcionarioId,
                    data: f.data,
                    quantidade: Number(f.quantidade) || 1,
                    status: f.status || 'planejado',
                    observacao: f.observacao || '',
                })));
            }
        } catch { }
        // Funcionários (protegida por funcionário)
        try {
            const resFunc = await api.get('/funcionarios');
            if (Array.isArray(resFunc.data) && resFunc.data.length > 0) {
                setFuncionarios(resFunc.data.map((f) => ({
                    id: f.id,
                    nome: f.nome,
                    cargo: f.cargo || '',
                    email: f.email || '',
                    telefone: f.telefone || '',
                    cpf: f.cpf || '',
                    dataAdmissao: f.dataAdmissao ? String(f.dataAdmissao).slice(0, 10) : '',
                    salario: Number(f.salario) || 0,
                    ativo: f.ativo !== false,
                })));
            }
        } catch { }
        // Pedidos (protegida — admin vê todos)
        try {
            const resPedidos = await api.get('/pedidos');
            if (Array.isArray(resPedidos.data)) {
                setPedidos(resPedidos.data.map((p) => ({
                    id: p.id,
                    clienteId: p.clienteId || null,
                    clienteNome: p.cliente?.nome || p.clienteNome || '',
                    clienteEmail: p.cliente?.email || p.clienteEmail || '',
                    itens: Array.isArray(p.itens) ? p.itens.map((it) => ({
                        produtoId: it.produtoId,
                        quantidade: it.quantidade,
                        precoUnit: Number(it.precoUnit) || 0,
                    })) : [],
                    total: Number(p.total) || 0,
                    status: p.status || 'pendente',
                    data: p.data
                        ? String(p.data).slice(0, 10)
                        : (p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : ''),
                    observacao: p.observacao || '',
                })));
            }
        } catch { }
    }
    // 1. Sincronização com API e restauração de sessão
    useEffect(() => {
        // Categorias e produtos são públicos — sincroniza no boot para todos
        async function syncPublico() {
            try {
                const resCat = await api.get('/categorias');
                if (Array.isArray(resCat.data) && resCat.data.length > 0) {
                    setCategorias(resCat.data.map((c) => ({
                        id: c.id, nome: c.nome, descricao: c.descricao || '',
                        emoji: c.emoji || '', cor: c.cor || '#c48d4a', ativo: c.ativo !== false,
                    })));
                }
            } catch { }
            try {
                const resProdutos = await api.get('/produtos');
                if (Array.isArray(resProdutos.data) && resProdutos.data.length > 0) {
                    setProdutos(resProdutos.data.map((item) => ({
                        id: item.id, nome: item.nome, categoriaId: item.categoriaId || 1,
                        receitaId: item.receitaId || null, preco: Number(item.preco) || 0,
                        ativo: item.ativo !== undefined ? Boolean(item.ativo) : true,
                        descricao: item.descricao || '', emoji: item.emoji || '',
                        estoque: Number(item.estoque) || 0,
                    })));
                }
            } catch { }
        }
        syncPublico();
        // Restaura o login salvo (token JWT no localStorage).
        const token = localStorage.getItem(CHAVE_TOKEN);
        if (token && tokenValido(token)) {
            api.get('/auth/me')
                .then(({ data }) => {
                if (data.usuario?.tipo === 'funcionario')
                    setAdminLogado(true);
                else
                    setClienteLogado(data.usuario ?? null);
            })
                .catch((e) => {
                if (e?.response?.status === 401)
                    localStorage.removeItem(CHAVE_TOKEN);
            });
        }
        else if (token) {
            localStorage.removeItem(CHAVE_TOKEN);
        }
         
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
    // Insumo actions
    async function salvarInsumo(i) {
        if ('id' in i) {
            setInsumos((p) => p.map((x) => (x.id === i.id ? i : x)));
            try {
                await api.put(`/insumos/${i.id}`, {
                    nome: i.nome,
                    unidadeMedida: i.unidade,
                    quantidadeAtual: i.estoque,
                    estoqueMinimo: i.minimo,
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
                    unidadeMedida: i.unidade,
                    quantidadeAtual: i.estoque,
                    estoqueMinimo: i.minimo,
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
    async function salvarReceita(r) {
        if ('id' in r) {
            setReceitas((p) => p.map((x) => (x.id === r.id ? r : x)));
            try { await api.put(`/receitas/${r.id}`, r); } catch { }
        } else {
            const tempId = Date.now();
            setReceitas((p) => [...p, { ...r, id: tempId }]);
            try {
                const res = await api.post('/receitas', r);
                if (res.data?.id) setReceitas((p) => p.map((x) => x.id === tempId ? { ...r, id: res.data.id } : x));
            } catch { }
        }
    }
    async function excluirReceita(id) {
        setReceitas((p) => p.filter((x) => x.id !== id));
        try { await api.delete(`/receitas/${id}`); } catch { }
    }
    // Produto actions
    async function salvarProduto(p) {
        if ('id' in p) {
            setProdutos((prev) => prev.map((x) => (x.id === p.id ? p : x)));
            try {
                await api.put(`/produtos/${p.id}`, {
                    nome: p.nome,
                    preco: p.preco,
                    categoriaId: p.categoriaId,
                    receitaId: p.receitaId,
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
                    categoriaId: p.categoriaId,
                    receitaId: p.receitaId,
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
    async function recarregarEstoque() {
        try {
            const [resInsumos, resProdutos] = await Promise.all([
                api.get('/insumos'),
                api.get('/produtos'),
            ]);
            if (Array.isArray(resInsumos.data)) {
                setInsumos(resInsumos.data.map((i) => ({
                    id: i.id, nome: i.nome, unidade: i.unidadeMedida,
                    estoque: Number(i.quantidadeAtual) || 0, minimo: Number(i.estoqueMinimo) || 0,
                    custo: Number(i.custo) || 0, fornecedor: i.fornecedor || '',
                })));
            }
            if (Array.isArray(resProdutos.data)) {
                setProdutos(resProdutos.data.map((item) => ({
                    id: item.id, nome: item.nome, categoriaId: item.categoriaId || 1,
                    receitaId: item.receitaId || null, preco: Number(item.preco) || 0,
                    ativo: item.ativo !== undefined ? Boolean(item.ativo) : true,
                    descricao: item.descricao || '', emoji: item.emoji || '',
                    estoque: Number(item.estoque) || 0,
                })));
            }
        } catch { }
    }
    // Fabricacao actions
    async function salvarFab(f) {
        if ('id' in f) {
            const anterior = fabricacoes.find((x) => x.id === f.id);
            setFabricacoes((p) => p.map((x) => (x.id === f.id ? f : x)));
            try {
                await api.put(`/fabricacoes/${f.id}`, f);
                if (f.status === 'concluido') await recarregarEstoque();
                return { ok: true };
            } catch (e) {
                if (anterior) setFabricacoes((p) => p.map((x) => (x.id === f.id ? anterior : x)));
                return falhaDaApi(e);
            }
        } else {
            const tempId = Date.now();
            setFabricacoes((p) => [...p, { ...f, id: tempId }]);
            try {
                const res = await api.post('/fabricacoes', f);
                if (res.data?.id) setFabricacoes((p) => p.map((x) => x.id === tempId ? { ...f, id: res.data.id } : x));
                if (f.status === 'concluido') await recarregarEstoque();
                return { ok: true };
            } catch (e) {
                setFabricacoes((p) => p.filter((x) => x.id !== tempId));
                return falhaDaApi(e);
            }
        }
    }
    async function excluirFab(id) {
        setFabricacoes((p) => p.filter((x) => x.id !== id));
        try { await api.delete(`/fabricacoes/${id}`); } catch { }
    }
    async function mudarStatusFabricacao(id, s) {
        const anterior = fabricacoes.find((x) => x.id === id);
        setFabricacoes((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
        try {
            await api.patch(`/fabricacoes/${id}`, { status: s });
            if (s === 'concluido') await recarregarEstoque();
            return { ok: true };
        } catch (e) {
            if (anterior) setFabricacoes((p) => p.map((x) => (x.id === id ? anterior : x)));
            return falhaDaApi(e);
        }
    }
    // Funcionario actions
    async function salvarFunc(f) {
        if ('id' in f) {
            setFuncionarios((p) => p.map((x) => (x.id === f.id ? f : x)));
            try { await api.put(`/funcionarios/${f.id}`, f); } catch { }
        } else {
            const tempId = Date.now();
            setFuncionarios((p) => [...p, { ...f, id: tempId }]);
            try {
                const res = await api.post('/funcionarios', f);
                if (res.data?.id) setFuncionarios((p) => p.map((x) => x.id === tempId ? { ...f, id: res.data.id } : x));
            } catch { }
        }
    }
    async function excluirFunc(id) {
        setFuncionarios((p) => p.filter((x) => x.id !== id));
        try { await api.delete(`/funcionarios/${id}`); } catch { }
    }
    // Categoria actions
    async function salvarCat(c) {
        if ('id' in c) {
            setCategorias((p) => p.map((x) => (x.id === c.id ? c : x)));
            try { await api.put(`/categorias/${c.id}`, c); } catch { }
        } else {
            const tempId = Date.now();
            setCategorias((p) => [...p, { ...c, id: tempId }]);
            try {
                const res = await api.post('/categorias', c);
                if (res.data?.id) setCategorias((p) => p.map((x) => x.id === tempId ? { ...c, id: res.data.id } : x));
            } catch { }
        }
    }
    async function excluirCat(id) {
        setCategorias((p) => p.filter((x) => x.id !== id));
        try { await api.delete(`/categorias/${id}`); } catch { }
    }
    // Pedidos & Clientes
    async function mudarStatusPedido(id, s) {
        const anterior = pedidos.find((x) => x.id === id);
        setPedidos((p) => p.map((x) => (x.id === id ? { ...x, status: s } : x)));
        try {
            await api.patch(`/pedidos/${id}`, { status: s });
            return { ok: true };
        } catch (e) {
            if (anterior) {
                setPedidos((p) => p.map((x) => (x.id === id ? anterior : x)));
            }
            return falhaDaApi(e);
        }
    }
    async function novoPedidoCliente(p) {
        const tempId = Date.now();
        setPedidos((prev) => [...prev, { ...p, id: tempId }]);
        try {
            const res = await api.post('/pedidos', {
                itens: p.itens,
                observacao: p.observacao || '',
            });
            if (res.data?.id) {
                setPedidos((prev) => prev.map((x) => x.id === tempId ? {
                    ...p,
                    id: res.data.id,
                    total: Number(res.data.total ?? p.total) || 0,
                    status: res.data.status || p.status,
                    data: res.data.data ? String(res.data.data).slice(0, 10) : p.data,
                } : x));
            }
            return { ok: true, data: res.data };
        } catch (e) {
            setPedidos((prev) => prev.filter((x) => x.id !== tempId));
            return falhaDaApi(e);
        }
    }
    // Autenticação (back-end em padariaApi)
    function guardarToken(token) {
        try {
            localStorage.setItem(CHAVE_TOKEN, token);
        }
        catch { }
    }
    // tipo: 'cliente' (portal) ou 'funcionario' (área administrativa)
    async function entrar(email, senha, tipo = 'cliente') {
        try {
            const { data } = await api.post('/auth/login', {
                email,
                senha,
                tipo: tipo === 'funcionario' ? 'funcionario' : undefined,
            });
            guardarToken(data.token);
            if (tipo === 'funcionario') {
                setAdminLogado(true);
                sincronizarComApi();
            }
            else
                setClienteLogado(data.usuario);
            return { ok: true, usuario: data.usuario };
        }
        catch (e) {
            return falhaDaApi(e);
        }
    }
    async function cadastrarCliente({ nome, email, telefone, senha }) {
        try {
            const { data } = await api.post('/usuarios', { nome, email, telefone, senha });
            if (data.token) {
                guardarToken(data.token);
                setClienteLogado(data.usuario);
            }
            return { ok: true, usuario: data.usuario };
        }
        catch (e) {
            return falhaDaApi(e);
        }
    }
    function sair() {
        try {
            localStorage.removeItem(CHAVE_TOKEN);
        }
        catch { }
        setAdminLogado(false);
        setClienteLogado(null);
    }
    return (<PadariaContext.Provider value={{
            insumos,
            receitas,
            produtos,
            fabricacoes,
            funcionarios,
            categorias,
            pedidos,
            adminLogado,
            clienteLogado,
            entrar,
            sair,
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
