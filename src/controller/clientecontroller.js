const db = require('../db/db');// Módulo de conexão com o banco de dados
const Joi = require('joi');// Biblioteca de validação de dados
const bcrypt = require('bcrypt'); // Para encriptação de senhas

//validação do joi
const clienteSchema = Joi.object({
    cpf: Joi.string().length(11).required(), 
    // CPF deve ser uma string de exatamente 11 caracteres
    nome: Joi.string().required().max(50), 
    // Nome deve ser uma string e é obrigatorio
    endereco: Joi.string().required().max(80), 
    // Endereço deve ser uma string e é obrigatorio
    bairro: Joi.string().required().max(30), 
    // Bairro deve ser uma string e é obrigatorio
    cidade: Joi.string().required().max(30),
     // Cidade deve ser uma string e é obrigatorio
    cep: Joi.string().required(), 
    // CEP deve ser uma string e é obrigatorio
    telefone: Joi.string().required(), 
    // Telefone deve ser uma string e é obrigatorio
    email: Joi.string().email().required(), 
    // Email deve ser valido e é obrigatorio
    senha: Joi.string().min(6).required() 
    // Senha deve ter no minimo 6 caracteres e é obrigatorio
});

// Listar todos os clientes
exports.listarClientes = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM cliente');
        res.json(result);// Aqui retornamos apenas os dados da consulta
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({error: 'Erro interno do servidor' });
    }
};

// Buscar um cliente por CPF
exports.listarClientesCpf = async (req, res) => {
    const { cpf } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado'});
        }
        res.json(result[0]);
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        res.status(500).json({error: 'Erro interno do servidor' });
    }
};

// Adicionar um novo cliente 
exports.adicionarCliente = async (req, res) => {
    const { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha } = req.body;

// Validação de dados
const { error } = clienteSchema.validate({ cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha });
if (error) {
    return res.status(400).json({ error: error.details[0].message });
}
    try {
        // Criptogradando a senha
        const hash = await bcrypt.hash(senha, 10);
    
        const novoCliente = { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha: hash };
        await db.query('INSERT INTO cliente SET ?', novoCliente);

        res.json({ message: 'Cliente adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(500).json({ error: 'Erro ao adicionar cliente' });
    }
};

// Atualizar um cliente

exports.atualizarCliente = async (req, res) => {
    const { cpf } = req.params;
    const { nome, endereco, bairro, cidade, cep, telefone, email, senha } = req.body;
//Validação de dados
const { error } = clienteSchema.validate({cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha});
    if (error) {
        return res.status(404).json({ error: error.details[0].message });
    }
    try {
        //verificar se o cliente existe antes de atualizar
        const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado'})
        }
        //Criptografando a senha
        const hash = await bcrypt.hash(senha, 10);
        const clienteAtualizado = { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha: hash };
        await db.query('UPDATE cliente SET ? WHERE cpf = ?', [clienteAtualizado, cpf]);
        res.json({ message: 'Cliente atualizado com sucesso' });
    }   catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
};
//Deletar um cliente
exports.deletarCliente = async (req, res) => {
    const { cpf } = req.params;
    try {
        // verifica se o cliente existe antes de deletar
        const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        await db.query('DELETE FROM cliente WHERE cpf = ?', [cpf]);
        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar cliente:', err);
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
};