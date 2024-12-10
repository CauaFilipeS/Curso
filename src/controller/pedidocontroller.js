const db = require('../db/db');
const Joi = require('joi');

const pedidoSchema = Joi.object({
    idPedido: Joi.string().required(),
    dataPedido:Joi.string().required(),
    qtdeItens: Joi.string().required(),
    formaPagto: Joi.string().required(),
    valorTotal: Joi.string().required(),
    observacao: Joi.string().required().max(50),
    cpf: Joi.string().length(11).required(),
    idEntregador: Joi.string().required()
});

exports.listarPedido = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM pedido');
        res.json(result);
    } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

exports.listarPedidoId = async (req, res) => {
    const { idPedido } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [idPedido]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar Pedido:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

exports.adicionarPedido = async (req, res) => {
    const { idPedido, dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador } = req.body;
    // Validação de dados
    const { error } = pedidoSchema.validate({ idPedido, dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const novoPedido = { idPedido, dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador };
        await db.query('INSERT INTO pedido SET ?', novoPedido);

        res.json({ message: 'Pedido adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar Pedido ', err);
        res.status(500).json({ error: 'Erro ao adicionar Pedido' });
    }
};

exports.atualizarPedido = async (req, res) => {
    const { idEPedido } = req.params;
    const { idPedido, dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador } = req.body;
    //Validação de dados
    const { error } = pedidoSchema.validate({ idPedido, dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador });
    if (error) {
        return res.status(404).json({ error: error.details[0].message });
    }
    try {
        //verificar se o produto existe antes de atualizar
        const [result] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [idPedido]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' })
        }
        const PedidoAtualizado = { idPedido, dataPedido, qtdeItens, formaPagto, valorTotal, observacao, cpf, idEntregador };
        await db.query('UPDATE pedido SET ? WHERE idPedido = ?', PedidoAtualizado, idPedido);
        res.json({ message: 'Pedido atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar Pedido:', err);
        res.status(500).json({ error: 'Erro ao atualizar Pedido' })
    }
};

exports.deletarPedido = async (req, res) => {
    const { idPedido } = req.params;
    try {
        //Verificar se o entregador existe antes de deletar
        const [result] = await db.query('SELECT * FROM pedido WHERE idPedido = ?', [idPedido]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        await db.query('DELETE FROM pedido WHERE idPedido = ?', [idPedido]);
        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar pedido', err);
        res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
};