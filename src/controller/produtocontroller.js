const db = require('../db/db');
const Joi = require('joi');

const produtoSchema = Joi.object({
    idProduto: Joi.string().length().required(),
    nomeProduto: Joi.string().required(30),
    tipo: Joi.string().required(30),
    descricao: Joi.string().required().max(30)
    valorUnit: Joi.string().required(),
    imagem: Joi.string().required(200)
});

// Listar todos os produtos
exports.listarProdutos = async (req, res) => {
    try {
    const [result] = await db.query('SELECT * FROM pedido');
    res.json(result);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar um produto pelo ID
exports.listarProdutosId = async (req, res) => {
    const { idProduto } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM produto WHERE idProduto = ?', [idProduto]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado'});
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Adicionar um novo produto
exports.adicionarProduto = async (req, res) => {
    const { idProduto, nomeProduto, tipo, descricao, valorUnit, imagem } = req.body;
    // Validação de dados
    const { error } = produtoSchema.validate({ idProduto, nomeProduto, tipo, descricao, valorUnit, imagem });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const novoProduto = { idProduto, nomeProduto, tipo, descricao, valorUnit, imagem };
        await db.query('INSERT INTO produto SET ?', novoProduto);

        res.json({ message: 'Produto adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar produto', err);
        res.status(500).json({ error: 'Erro ao adicionar produto' });
    }
};

// Atualizar um Produto
exports.atualizarProduto = async (req, res) => {
    const { idProduto } = req.params;
    const { nomeProduto, tipo, descricao, valorUnit, imagem } = req.body;
    //Validação de dados
    const { error } = produtoSchema.validate({ idProduto, nomeProduto, tipo, descricao, valorUnit, imagem});
    if (error) {
        return res.status(404).json({ error: error.details[0].message });
    }
    try {
        //verificar se o produto existe antes de atualizar
        const [result] = await db.query('SELECT * FROM produto WHERE idProduto = ?', [idProduto]);
        if (result.length === 0 ) {
            return res.status(404).json({ error: 'Produto não encontrado'})
        }
        const produtoAtualizado = { idProduto, nomeProduto, tipo, descricao, valorUnit, imagem };
        await db.query('UPDATE produto SET ? WHERE idProduto = ?', produtoAtualizado, idProduto);
        res.json({ message: 'Produto atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500.json({ error: 'Erro ao atualizar Produto'}))
    }
};