const db = require('../database/database');

exports.findByEmail = (email) => {
  return db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
};

exports.findById = (id) => {
  return db.prepare('SELECT id, nome, email, role, criado_em FROM usuarios WHERE id = ?').get(id);
};

exports.create = ({ nome, email, senha, role = 'agente' }) => {
  const stmt = db.prepare(
    'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(nome, email, senha, role);
  return { id: result.lastInsertRowid, nome, email, role };
};

exports.getAll = () => {
  return db.prepare('SELECT id, nome, email, role, criado_em FROM usuarios ORDER BY criado_em DESC').all();
};