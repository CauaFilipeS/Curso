const express = require('express');
const router = express.Router();

// Exemplo de uma rota GET
router.get('/usuario', (req, res) => {
    res.send('Rota do usuário');
});


// Exemplo de outra rota GET
router.get('/caua', (req, res) => {
    res.send('Rota do Caua');
});
// Exporte o roteador para que ele possa ser usado no index.js
module.exports = router;
