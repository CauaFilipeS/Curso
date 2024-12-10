const express = require('express');
const router = express.Router();
const produtoController = require('../controller/produto2controller');


router.get('/produtos', produtoController.listarProdutos);

router.get('/produtos/:idProduto', produtoController.listarProdutosId);

router.get('/produtos/nome/:nomeProduto', produtoController.buscarProdutoNome);

router.post('/produtos', produtoController.adicionarProduto);

router.put('/produtos/:idProduto', produtoController.atualizarProduto);

router.delete('/produtos/:idProduto', produtoController.deletarProduto);

module.exports = router;