const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const SECRET = process.env.JWT_SECRET || 'smart_helpdesk_secret_key';

// POST /api/auth/register — só admin pode registrar novos usuários
exports.register = async (req, res) => {
  try {
    // Verifica se quem está registrando é admin
    if (!req.usuario || req.usuario.role !== 'admin') {
      return res.status(403).json({ erro: 'Apenas administradores podem criar novos usuários.' });
    }

    const { nome, email, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    const exists = userModel.findByEmail(email);
    if (exists) {
      return res.status(409).json({ erro: 'Email já cadastrado.' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const usuario = userModel.create({ nome, email, senha: hash, role });

    res.status(201).json({ mensagem: 'Usuário criado com sucesso.', usuario });

  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({ erro: 'Erro interno ao registrar usuário.' });
  }
};

// POST /api/auth/login — público
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    const usuario = userModel.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role, nome: usuario.nome },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role }
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  const usuario = userModel.findById(req.usuario.id);
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  res.json(usuario);
};

// GET /api/auth/usuarios — só admin
exports.listarUsuarios = (req, res) => {
  try {
    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }s
    const usuarios = userModel.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
};