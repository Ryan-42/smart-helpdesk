const ticketModel = require('../models/ticketModel');
const aiAnalyzer = require('../services/aiAnalyzer');

// Criar ticket
exports.createTicket = (req, res) => {
  try {
    const { nome, email, assunto, descricao } = req.body;
    const analysis = aiAnalyzer.analyze(descricao);

    const ticket = ticketModel.create({
      nome, email, assunto, descricao,
      categoria: analysis.categoria,
      prioridade: analysis.prioridade,
      sentimento: analysis.sentimento,
      resposta_sugerida: analysis.resposta,
      criado_por: req.usuario.id
    });

    res.json(ticket);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ erro: 'Erro ao criar ticket' });
  }
};

// Listar tickets (admin = todos, agente = só os seus)
exports.getTickets = (req, res) => {
  try {
    const tickets = ticketModel.getAll(req.usuario);
    res.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    res.status(500).json({ erro: 'Erro ao buscar tickets' });
  }
};

// Buscar por ID
exports.getTicketById = (req, res) => {
  try {
    const ticket = ticketModel.getById(req.params.id, req.usuario);
    if (!ticket) {
      return res.status(404).json({ erro: 'Ticket não encontrado ou sem permissão.' });
    }
    res.json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    res.status(500).json({ erro: 'Erro interno' });
  }
};

// Atualizar status
exports.updateStatus = (req, res) => {
  try {
    const { status } = req.body;
    const ticket = ticketModel.updateStatus(req.params.id, status);
    res.json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ erro: 'Erro ao atualizar status' });
  }
};

// Deletar — só admin
exports.deleteTicket = (req, res) => {
  try {
    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado. Apenas administradores podem deletar tickets.' });
    }
    ticketModel.delete(req.params.id);
    res.json({ mensagem: 'Ticket deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    res.status(500).json({ erro: 'Err   o ao deletar ticket' });
  }
};