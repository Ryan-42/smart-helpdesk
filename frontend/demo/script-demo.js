/* =============================================
   SMART HELPDESK — DEMO MODE
   Dados fictícios para demonstração estática
============================================= */

const usuarioLogado = {
  id: 1,
  nome: 'Admin Demo',
  email: 'admin',
  role: 'admin'
};

const TICKETS_MOCK = [
  { id: 1, nome: 'Rafael Souza', email: 'rafael@email.com', assunto: 'Não consigo acessar o sistema', descricao: 'Tento fazer login mas aparece erro de credenciais inválidas desde ontem.', categoria: 'acesso', prioridade: 'alta', sentimento: 'frustrado', resposta_sugerida: 'Tente redefinir sua senha no portal interno.', status: 'aberto', criado_por: 2 },
  { id: 2, nome: 'Camila Torres', email: 'camila@email.com', assunto: 'Internet caindo toda hora', descricao: 'A rede está instável, cai a cada 10 minutos e afeta toda a equipe.', categoria: 'rede', prioridade: 'alta', sentimento: 'frustrado', resposta_sugerida: 'Nossa equipe de infraestrutura já foi acionada.', status: 'em_andamento', criado_por: 3 },
  { id: 3, nome: 'Lucas Mendes', email: 'lucas@email.com', assunto: 'Solicitar novo equipamento', descricao: 'Preciso de um monitor adicional para trabalho remoto.', categoria: 'geral', prioridade: 'baixa', sentimento: 'neutro', resposta_sugerida: 'Nossa equipe irá analisar seu chamado.', status: 'aberto', criado_por: 4 },
  { id: 4, nome: 'Fernanda Lima', email: 'fernanda@email.com', assunto: 'Erro no sistema de notas fiscais', descricao: 'O sistema não está gerando NF corretamente, urgente!', categoria: 'geral', prioridade: 'alta', sentimento: 'frustrado', resposta_sugerida: 'Nossa equipe irá analisar seu chamado.', status: 'resolvido', criado_por: 2 },
  { id: 5, nome: 'Bruno Alves', email: 'bruno@email.com', assunto: 'Configurar VPN para home office', descricao: 'Preciso de acesso VPN para trabalhar de casa.', categoria: 'rede', prioridade: 'baixa', sentimento: 'neutro', resposta_sugerida: 'Nossa equipe irá analisar seu chamado.', status: 'fechado', criado_por: 3 },
  { id: 6, nome: 'Mariana Costa', email: 'mariana@email.com', assunto: 'Senha expirada bloqueando acesso', descricao: 'Minha senha expirou e não consigo redefinir pelo portal.', categoria: 'acesso', prioridade: 'alta', sentimento: 'frustrado', resposta_sugerida: 'Tente redefinir sua senha no portal interno.', status: 'em_andamento', criado_por: 4 },
];

/* =============================================
   HELPERS
============================================= */
function badgeStatus(status) {
  const labels = { aberto: '● Aberto', em_andamento: '◎ Em Andamento', resolvido: '✓ Resolvido', fechado: '○ Fechado' };
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

function badgePrioridade(p) {
  return `<span class="badge badge-${p}">▲ ${p.charAt(0).toUpperCase() + p.slice(1)}</span>`;
}

function escapeHtml(str) {
  if (!str) return '—';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 20) || 1;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

function showMsg(el, text, type) {
  el.textContent = type === 'sucesso' ? '✓  ' + text : '✗  ' + text;
  el.className = 'mensagem show ' + type;
  setTimeout(() => { el.className = 'mensagem'; }, 4000);
}

/* =============================================
   HEADER — badge usuário demo
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (nav && usuarioLogado) {
    if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('index') || window.location.pathname.includes('ticket')) {
      const adminLink = document.createElement('a');
      adminLink.href = 'usuarios-demo.html';
      adminLink.textContent = 'Usuários';
      adminLink.style.color = 'var(--neon-violet)';
      nav.appendChild(adminLink);
    }

    const userEl = document.createElement('span');
    userEl.style.cssText = `
      font-family:'JetBrains Mono',monospace; font-size:0.7rem;
      color:var(--text-muted); padding:8px 12px;
      border:1px solid var(--border); border-radius:var(--radius-sm);
      display:flex; align-items:center; gap:8px;
    `;
    userEl.innerHTML = `
      <span style="color:var(--neon-violet);opacity:0.9">◉</span>
      ${escapeHtml(usuarioLogado.nome)}
      <span style="color:var(--neon-violet);opacity:0.6;font-size:0.6rem">[${usuarioLogado.role}]</span>
      <button onclick="window.location.href='login-demo.html'" style="
        background:none; border:none; color:var(--text-muted); cursor:pointer;
        font-family:'JetBrains Mono',monospace; font-size:0.65rem;
        padding:0 0 0 8px; border-left:1px solid var(--border); margin-left:4px;
        transition:color 0.2s;
      " onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='var(--text-muted)'">sair</button>
    `;
    nav.appendChild(userEl);
  }
});

/* =============================================
   LOGIN — login-demo.html
============================================= */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    const btn = document.getElementById('loginBtn');
    const msg = document.getElementById('loginMsg');

    btn.classList.add('loading');

    setTimeout(() => {
      if (email === 'admin' && senha === 'admin') {
        msg.textContent = '✓  Autenticado! Redirecionando...';
        msg.className = 'mensagem show sucesso';
        setTimeout(() => { window.location.href = 'dashboard-demo.html'; }, 800);
      } else {
        msg.textContent = '✗  Credenciais inválidas. Use admin / admin';
        msg.className = 'mensagem show erro';
        btn.classList.remove('loading');
      }
    }, 800);
  });
}

/* =============================================
   DASHBOARD — dashboard-demo.html
============================================= */
const tabela = document.getElementById('ticketsTable');
if (tabela) {
  animateNumber('statTotal', TICKETS_MOCK.length);
  animateNumber('statAbertos', TICKETS_MOCK.filter(t => t.status === 'aberto').length);
  animateNumber('statAndamento', TICKETS_MOCK.filter(t => t.status === 'em_andamento').length);
  animateNumber('statResolvidos', TICKETS_MOCK.filter(t => t.status === 'resolvido').length);

  tabela.innerHTML = '';
  TICKETS_MOCK.forEach((ticket, i) => {
    const row = document.createElement('tr');
    row.style.animationDelay = `${i * 0.06}s`;
    row.classList.add('animate-in');
    row.innerHTML = `
      <td>#${String(ticket.id).padStart(4,'0')}</td>
      <td>${escapeHtml(ticket.nome)}</td>
      <td>${escapeHtml(ticket.assunto)}</td>
      <td><span style="color:var(--text-secondary);font-size:0.85rem">${escapeHtml(ticket.categoria)}</span></td>
      <td>${badgePrioridade(ticket.prioridade)}</td>
      <td>${badgeStatus(ticket.status)}</td>
      <td><a href="ticket-demo.html?id=${ticket.id}" class="btn btn-ghost btn-sm">Ver →</a></td>
      <td><button onclick="alert('Demo: ticket #${String(ticket.id).padStart(4,'0')} deletado!')" class="btn btn-sm" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#f87171">✕</button></td>
    `;
    row.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) window.location.href = `ticket-demo.html?id=${ticket.id}`;
    });
    tabela.appendChild(row);
  });
}

/* =============================================
   CRIAR TICKET — index-demo.html
============================================= */
const form = document.getElementById('ticketForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const mensagem = document.getElementById('mensagem');
    btn.classList.add('loading');

    setTimeout(() => {
      const novoId = TICKETS_MOCK.length + 1;
      btn.classList.remove('loading');
      showMsg(mensagem, `Ticket #${String(novoId).padStart(4,'0')} transmitido com sucesso! (modo demo)`, 'sucesso');
      form.reset();
    }, 900);
  });
}

/* =============================================
   DETALHES — ticket-demo.html
============================================= */
const params = new URLSearchParams(window.location.search);
const ticketId = params.get('id');

if (ticketId && document.getElementById('id')) {
  const ticket = TICKETS_MOCK.find(t => t.id === parseInt(ticketId));

  if (ticket) {
    const titleEl = document.getElementById('ticketIdTitle');
    if (titleEl) titleEl.textContent = `#${String(ticket.id).padStart(4,'0')}`;

    document.getElementById('id').textContent = `#${String(ticket.id).padStart(4,'0')}`;
    document.getElementById('nome').textContent = ticket.nome;
    document.getElementById('email').textContent = ticket.email;
    document.getElementById('assunto').textContent = ticket.assunto;
    document.getElementById('categoria').textContent = ticket.categoria;
    document.getElementById('descricao').textContent = ticket.descricao;
    document.getElementById('prioridade').textContent = ticket.prioridade;
    document.getElementById('sentimento').textContent = ticket.sentimento;
    document.getElementById('resposta').textContent = ticket.resposta_sugerida;
    document.getElementById('status').innerHTML = badgeStatus(ticket.status);

    const select = document.getElementById('novoStatus');
    if (select) select.value = ticket.status;
  }
}

/* =============================================
   ATUALIZAR STATUS — ticket-demo.html
============================================= */
const btnStatus = document.getElementById('atualizarStatus');
if (btnStatus) {
  btnStatus.addEventListener('click', () => {
    const novoStatus = document.getElementById('novoStatus').value;
    const mensagem = document.getElementById('mensagem');
    const btn = document.getElementById('atualizarStatus');
    btn.classList.add('loading');

    setTimeout(() => {
      btn.classList.remove('loading');
      document.getElementById('status').innerHTML = badgeStatus(novoStatus);
      showMsg(mensagem, 'Status atualizado! (modo demo)', 'sucesso');
    }, 600);
  });
}
