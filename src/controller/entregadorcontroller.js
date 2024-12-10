const db = require('../db/db');
const Joi = require('joi');

const entregadorSchema = Joi.object({
    idEntregador: Joi.string().required(),
    nomeEntregador: Joi.string().required(),
    cnh: Joi.string().required(),
    telefoneEntregador: Joi.string().required()
});

// Listar todos os entregador
exports.listarEntregador = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM entregador');
        res.json(result);
    } catch (err) {
        console.error('Erro ao buscar entregador:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Buscar um entregador pelo ID
exports.listarEntregadorId = async (req, res) => {
    const { idEntregador } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM entregador WHERE idEntregador = ?', [idEntregador]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Entregador não encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar entregador:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Adicionar um novo entregador
exports.adicionarEntregador = async (req, res) => {
    const { idEntregador, nomeEntregador, cnh, telefoneEntregador } = req.body;
    // Validação de dados
    const { error } = entregadorSchema.validate({ idEntregador, nomeEntregador, cnh, telefoneEntregador });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const novoEntregador = { idEntregador, nomeEntregador, cnh, telefoneEntregador };
        await db.query('INSERT INTO entregador SET ?', novoEntregador);

        res.json({ message: 'Entregador adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar Entregador ', err);
        res.status(500).json({ error: 'Erro ao adicionar Entregador ' });
    }
};
// Atualizar um entregador
exports.atualizarEntregador = async (req, res) => {
    const { idEntregador } = req.params;
    const { telefoneEntregador } = req.body;
    //Validação de dados
    const { error } = entregadorSchema.validate({ idEntregador, telefoneEntregador });
    if (error) {
        return res.status(404).json({ error: error.details[0].message });
    }
    try {
        //verificar se o produto existe antes de atualizar
        const [result] = await db.query('SELECT * FROM entregador WHERE idEntregador = ?', [idEntregador]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'entregador não encontrado' })
        }
        const entregadorAtualizado = { telefoneEntregador };
        await db.query('UPDATE entregador SET ? WHERE idEntregador = ?', entregadorAtualizado, idEntregador);
        res.json({ message: 'Entregador atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar entregador:', err);
        res.status(500).json({ error: 'Erro ao atualizar entregador' })
    }
};
exports.deletarEntregador = async (req, res) => {
    const { idEntregador } = req.params;
    try {
        //Verificar se o entregador existe antes de deletar
        const [result] = await db.query('SELECT * FROM entregador WHERE idEntregador = ?', [idEntregador]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Entregador não encontrado' });
        }
        await db.query('DELETE FROM entregador WHERE idEntregador = ?', [idEntregador]);
        res.json({ message: 'Entregador deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar entregador', err);
        res.status(500).json({ error: 'Erro ao deletar entregador' });
    }
};