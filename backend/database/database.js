const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const db = new Database('tickets.db');

// Tabela de tickets — criado_por vincula ao usuário agente
db.prepare(`
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    assunto TEXT,
    descricao TEXT,
    categoria TEXT,
    prioridade TEXT,
    sentimento TEXT,
    resposta_sugerida TEXT,
    status TEXT DEFAULT 'aberto',
    criado_por INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Tabela de usuários
db.prepare(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    role TEXT DEFAULT 'agente',
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Seed — cria admin padrão automaticamente se não existir
const adminExiste = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('admin');

if (!adminExiste) {
  const hash = bcrypt.hashSync('admin', 10);
  db.prepare('INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)')
    .run('Administrador', 'admin', hash, 'admin');
  console.log('[seed] Admin criado — login: admin / senha: admin');
}

module.exports = db;