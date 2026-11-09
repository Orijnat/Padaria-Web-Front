export const categoriasBase = [
    { id: 1, nome: 'Pães', descricao: 'Pães artesanais e industriais', emoji: '🥖', cor: '#c48d4a', ativo: true },
    { id: 2, nome: 'Bolos', descricao: 'Bolos inteiros e fatias', emoji: '🍰', cor: '#e8a020', ativo: true },
    { id: 3, nome: 'Folhados', descricao: 'Croissants e massas folhadas', emoji: '🥐', cor: '#d9b07a', ativo: true },
    { id: 4, nome: 'Salgados', descricao: 'Salgadinhos e esfihas', emoji: '🧀', cor: '#8a5420', ativo: true },
    { id: 5, nome: 'Bebidas', descricao: 'Cafés, sucos e vitaminas', emoji: '☕', cor: '#6b3d16', ativo: true },
];
export const funcionariosBase = [
    { id: 1, nome: 'João Silva', cargo: 'Padeiro', email: 'joao@padaria.com', telefone: '(11) 99999-0001', cpf: '123.456.789-00', dataAdmissao: '2020-03-15', salario: 2800, ativo: true },
    { id: 2, nome: 'Maria Souza', cargo: 'Confeiteira', email: 'maria@padaria.com', telefone: '(11) 99999-0002', cpf: '234.567.890-11', dataAdmissao: '2019-07-01', salario: 3200, ativo: true },
    { id: 3, nome: 'Carlos Ferreira', cargo: 'Atendente', email: 'carlos@padaria.com', telefone: '(11) 99999-0003', cpf: '345.678.901-22', dataAdmissao: '2022-01-10', salario: 1900, ativo: true },
    { id: 4, nome: 'Ana Lima', cargo: 'Caixa', email: 'ana.lima@padaria.com', telefone: '(11) 99999-0004', cpf: '456.789.012-33', dataAdmissao: '2021-06-20', salario: 2100, ativo: false },
];
export const insumosBase = [
    { id: 1, nome: 'Farinha de trigo', unidade: 'kg', estoque: 50, minimo: 10, custo: 4.5, fornecedor: 'Moinho São Paulo' },
    { id: 2, nome: 'Açúcar refinado', unidade: 'kg', estoque: 20, minimo: 5, custo: 3.2, fornecedor: 'Usina Central' },
    { id: 3, nome: 'Manteiga', unidade: 'kg', estoque: 8, minimo: 3, custo: 32.0, fornecedor: 'Laticínios Silva' },
    { id: 4, nome: 'Ovos', unidade: 'dúzia', estoque: 15, minimo: 5, custo: 12.0, fornecedor: 'Granja Boa Vista' },
    { id: 5, nome: 'Fermento biológico', unidade: 'kg', estoque: 2, minimo: 1, custo: 18.0, fornecedor: 'Fleischmann' },
    { id: 6, nome: 'Sal', unidade: 'kg', estoque: 5, minimo: 1, custo: 1.5, fornecedor: 'Distribuidora Norte' },
    { id: 7, nome: 'Leite integral', unidade: 'L', estoque: 3, minimo: 5, custo: 5.5, fornecedor: 'Laticínios Silva' },
    { id: 8, nome: 'Chocolate em pó', unidade: 'kg', estoque: 4, minimo: 2, custo: 22.0, fornecedor: 'Cacau Show' },
];
export const receitasBase = [
    {
        id: 1,
        nome: 'Pão Francês',
        categoriaId: 1,
        rendimento: 30,
        unidadeRendimento: 'unidades',
        tempoPreparo: 180,
        ingredientes: [
            { insumoId: 1, quantidade: 1 },
            { insumoId: 5, quantidade: 0.01 },
            { insumoId: 6, quantidade: 0.02 },
        ],
        instrucoes: 'Misturar ingredientes, sovar 15min, descansar 1h, modelar e assar a 220°C por 20min.',
    },
    {
        id: 2,
        nome: 'Bolo de Chocolate',
        categoriaId: 2,
        rendimento: 12,
        unidadeRendimento: 'fatias',
        tempoPreparo: 90,
        ingredientes: [
            { insumoId: 1, quantidade: 0.3 },
            { insumoId: 2, quantidade: 0.4 },
            { insumoId: 3, quantidade: 0.15 },
            { insumoId: 4, quantidade: 0.25 },
            { insumoId: 8, quantidade: 0.1 },
        ],
        instrucoes: 'Bater manteiga e açúcar, adicionar ovos, alternar farinha e chocolate. Assar a 180°C por 40min.',
    },
    {
        id: 3,
        nome: 'Croissant',
        categoriaId: 3,
        rendimento: 12,
        unidadeRendimento: 'unidades',
        tempoPreparo: 360,
        ingredientes: [
            { insumoId: 1, quantidade: 0.5 },
            { insumoId: 3, quantidade: 0.25 },
            { insumoId: 2, quantidade: 0.05 },
            { insumoId: 6, quantidade: 0.01 },
            { insumoId: 5, quantidade: 0.008 },
        ],
        instrucoes: 'Preparar massa, laminar com manteiga em 3 dobras. Refrigerar 30min entre dobras. Assar a 200°C por 18min.',
    },
];
export const produtosBase = [
    { id: 1, nome: 'Pão Francês', categoriaId: 1, receitaId: 1, preco: 0.9, ativo: true, descricao: 'Crocante por fora, macio por dentro.', emoji: '🥖' },
    { id: 2, nome: 'Bolo de Chocolate', categoriaId: 2, receitaId: 2, preco: 12.0, ativo: true, descricao: 'Fatia generosa do nosso bolo úmido.', emoji: '🍫' },
    { id: 3, nome: 'Croissant', categoriaId: 3, receitaId: 3, preco: 8.5, ativo: true, descricao: 'Folhado artesanal com manteiga francesa.', emoji: '🥐' },
    { id: 4, nome: 'Pão de Queijo (6un)', categoriaId: 4, receitaId: null, preco: 18.0, ativo: true, descricao: 'Pão de queijo mineiro tradicional.', emoji: '🧀' },
    { id: 5, nome: 'Café com Leite', categoriaId: 5, receitaId: null, preco: 7.0, ativo: true, descricao: 'Café coado artesanal com leite vaporizado.', emoji: '☕' },
];
export const fabricacoesBase = [
    { id: 1, produtoId: 1, funcionarioId: 1, data: '2026-08-17', quantidade: 200, status: 'concluido' },
    { id: 2, produtoId: 3, funcionarioId: 2, data: '2026-08-17', quantidade: 24, status: 'em_producao' },
    { id: 3, produtoId: 2, funcionarioId: 1, data: '2026-08-18', quantidade: 3, status: 'planejado' },
];
export const pedidosBase = [
    {
        id: 1,
        clienteNome: 'Ana Costa',
        clienteEmail: 'ana@email.com',
        itens: [
            { produtoId: 1, quantidade: 6, precoUnit: 0.9 },
            { produtoId: 5, quantidade: 2, precoUnit: 7.0 },
        ],
        total: 19.4,
        status: 'entregue',
        data: '2026-08-17',
        observacao: 'Sem açúcar no café',
    },
    {
        id: 2,
        clienteNome: 'Bruno Lima',
        clienteEmail: 'bruno@email.com',
        itens: [
            { produtoId: 3, quantidade: 2, precoUnit: 8.5 },
            { produtoId: 2, quantidade: 1, precoUnit: 12.0 },
        ],
        total: 29.0,
        status: 'pronto',
        data: '2026-08-17',
        observacao: '',
    },
    {
        id: 3,
        clienteNome: 'Carla Nunes',
        clienteEmail: 'carla@email.com',
        itens: [{ produtoId: 4, quantidade: 1, precoUnit: 18.0 }],
        total: 18.0,
        status: 'preparando',
        data: '2026-08-17',
        observacao: 'Retirada às 10h',
    },
];
export const clientesBase = [
    { id: 1, nome: 'Ana Costa', email: 'ana@email.com', senha: '123' },
    { id: 2, nome: 'Bruno Lima', email: 'bruno@email.com', senha: '123' },
];
