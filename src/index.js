// IMPORTAÇÃO DE TODAS AS DEPENDÊNCIAS
require('dotenv').config();//Carrega variáveis de ambiente de um arquivo .env
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const db = require('./db/db');


const routes = require('./routes/routes'); //Importa as rotas
const clienteRoutes = require('./routes/clienteroutes');

const corsOptions = {
    origin: ['http://localhost:3333', 'https://meudominio.com'], // Lista de origens permitidas
    methods: 'GET,POST,PUT,PATCH,DELETE', // Métodos HTTP permitidos
    credentials: true, // Permite o encio de cookies
};

const app = express();
//O APP IRÁ RECEBER O EXPRESS E TODAS SUAS DEPENDENCIAS
// Middlewares de segurança de utilidades
app.use(helmet());// Protege a aplicação com headers de segurança
app.use(cors(corsOptions)); // Habilita o CORS
app.use(morgan('dev')); // Loga as requisições no console
app.use(express.json()); // Converte os dados recebidos para JSON

// Servindo arquivos estaticos
app.use(express.static(path.join(__dirname,'public'))); // Pasta de arquivos estaticos
// O PATH RETORNA O CAMINHO DE FORMA DINAMICA

// Rota para servir o home.html como sendo nossa página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'home.html'));
});

// Configuração de rotas
// APOS DECLARAR NOSAS ROTAS, AQUI FALAMOS PARA NOSSO APP USAR ELAS COMO REFERENCIA
app.use('/', routes);

app.use('/', clienteRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Algo deu errado!')
})

// Inicialização do servidor
//AQUI DEFINIMOS QUEM IRA ESCUTAR NOSSO CHAMADO E NOS RESPONDER
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
