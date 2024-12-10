const express = require('express');
const router = express.Router();
const entregadorController = require('../controller/entregadorcontroller');

router.get('/entregador', entregadorController.listarEntregador);

router.get('/entregador/:idEntregador', entregadorController.listarEntregadorId);

router.post('/entregador', entregadorController.adicionarEntregador);

router.put('/entregador/:idEntregador', entregadorController.atualizarEntregador);

router.delete('/entregador/:idEntregador', entregadorController.deletarEntregador);

module.exports = router;