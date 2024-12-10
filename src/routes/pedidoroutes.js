const express = require('express');
const router = express.Router();
const pedidoController = require('../controller/pedidocontroller');

router.get('/pedido', pedidoController.listarPedido);

router.get('/pedido/:idPedido', pedidoController.listarPedidoId);

router.post('/pedido', pedidoController.adicionarPedido);

router.put('/pedido/:idPedido',  pedidoController.atualizarPedido);

router.delete('/pedido/:idPedido', pedidoController.deletarPedido);

module.exports = router;