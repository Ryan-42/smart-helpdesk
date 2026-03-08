const db = require('../database/database');

// Admin vê todos, agente vê só os seus
exports.getAll = (usuario) => {
  if (usuario.role === 'admin') {
    return db.prepare('SELECT * FROM tickets ORDER BY criado_em DESC').all();
  }
  return db.prepare('SELECT * FROM tickets WHERE criado_por = ? ORDER BY criado_em DESC').all(usuario.id);
};

exports.getById = (id, usuario) => {
  if (usuario.role === 'admin') {
    return db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  }
  return db.prepare('SELECT * FROM tickets WHERE id = ? AND criado_por = ?').get(id, usuario.id);
};

exports.create = (ticket) => {
  const stmt = db.prepare(`
    INSERT INTO tickets
    (nome, email, assunto, descricao, categoria, prioridade, sentimento, resposta_sugerida, criado_por)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    ticket.nome,
    ticket.email,
    ticket.assunto,
    ticket.descricao,
    ticket.categoria,
    ticket.prioridade,
    ticket.sentimento,
    ticket.resposta_sugerida,
    ticket.criado_por
  );
  return { id: result.lastInsertRowid, ...ticket };
};

exports.updateStatus = (id, status) => {
  db.prepare('UPDATE tickets SET status = ? WHERE id = ?').run(status, id);
  return { id, status };
};

exports.delete = (id) => {
  return db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
};