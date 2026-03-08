const API_URL = "http://localhost:2500/api/tickets";

/* =============================================
   AUTH GUARD
============================================= */
const token = localStorage.getItem('sh_token');
const usuarioLogado = JSON.parse(localStorage.getItem('sh_usuario') || 'null');
const paginaAtual = window.location.pathname.split('/').pop();
const paginasProtegidas = ['index.html', 'dashboard.html', 'ticket.html', 'usuarios.html', ''];

if (paginasProtegidas.includes(paginaAtual) && !token) {
  window.location.href = 'login.html';
}

/* =============================================
   HELPERS
============================================= */
function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

function showMsg(el, text, type) {
  el.textContent = type === 'sucesso' ? '✓  ' + text : '✗  ' + text;
  el.className = 'mensagem show ' + type;
  setTimeout(() => { el.className = 'mensagem'; }, 5000);
}

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

function handleAuthError(status) {
  if (status === 401) {
    localStorage.removeItem('sh_token');
    localStorage.removeItem('sh_usuario');
    window.location.href = 'login.html';
  }
}

/* =============================================
   HEADER — usuário logado + logout + link admin
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (nav && usuarioLogado) {

    // Link Usuários só para admin
    if (usuarioLogado.role === 'admin' && paginaAtual !== 'usuarios.html') {
      const adminLink = document.createElement('a');
      adminLink.href = 'usuarios.html';
      adminLink.textContent = 'Usuários';
      adminLink.style.color = 'var(--neon-violet)';
      nav.appendChild(adminLink);
    }

    // Badge usuário + logout
    const userEl = document.createElement('span');
    userEl.style.cssText = `
      font-family:'JetBrains Mono',monospace; font-size:0.7rem;
      color:var(--text-muted); padding:8px 12px;
      border:1px solid var(--border); border-radius:var(--radius-sm);
      display:flex; align-items:center; gap:8px;
    `;
    const roleColor = usuarioLogado.role === 'admin' ? 'var(--neon-violet)' : 'var(--neon-blue)';
    userEl.innerHTML = `
      <span style="color:${roleColor};opacity:0.9">◉</span>
      ${escapeHtml(usuarioLogado.nome)}
      <span style="color:${roleColor};opacity:0.6;font-size:0.6rem">[${usuarioLogado.role}]</span>
      <button onclick="logout()" style="
        background:none; border:none; color:var(--text-muted); cursor:pointer;
        font-family:'JetBrains Mono',monospace; font-size:0.65rem;
        padding:0 0 0 8px; border-left:1px solid var(--border); margin-left:4px;
        transition:color 0.2s;
      " onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='var(--text-muted)'">sair</button>
    `;
    nav.appendChild(userEl);
  }
});

function logout() {
  localStorage.removeItem('sh_token');
  localStorage.removeItem('sh_usuario');
  window.location.href = 'login.html';
}

/* =============================================
   CRIAR TICKET — index.html
============================================= */
const form = document.getElementById("ticketForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    const mensagem = document.getElementById("mensagem");

    btn.classList.add("loading");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          nome: document.getElementById("nome").value.trim(),
          email: document.getElementById("email").value.trim(),
          assunto: document.getElementById("assunto").value.trim(),
          descricao: document.getElementById("descricao").value.trim()
        })
      });
      handleAuthError(response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      showMsg(mensagem, `Ticket #${data.id} transmitido com sucesso!`, 'sucesso');
      form.reset();
    } catch (error) {
      showMsg(mensagem, "Falha na transmissão. Verifique se o servidor está online.", 'erro');
    } finally {
      btn.classList.remove("loading");
    }
  });
}

/* =============================================
   DASHBOARD — dashboard.html
============================================= */
const tabela = document.getElementById("ticketsTable");
if (tabela) carregarTickets();

async function carregarTickets() {
  try {
    const response = await fetch(API_URL, { headers: authHeaders() });
    handleAuthError(response.status);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const tickets = await response.json();

    animateNumber('statTotal', tickets.length);
    animateNumber('statAbertos', tickets.filter(t => t.status === 'aberto').length);
    animateNumber('statAndamento', tickets.filter(t => t.status === 'em_andamento').length);
    animateNumber('statResolvidos', tickets.filter(t => t.status === 'resolvido').length);

    if (tickets.length === 0) {
      tabela.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">◎</div><div class="empty-title">NENHUM TICKET ENCONTRADO</div><div class="empty-sub">// sistema operacional — aguardando chamados</div></div></td></tr>`;
      return;
    }

    tabela.innerHTML = "";
    const isAdmin = usuarioLogado && usuarioLogado.role === 'admin';

    tickets.forEach((ticket, i) => {
      const row = document.createElement("tr");
      row.style.animationDelay = `${i * 0.04}s`;
      row.classList.add('animate-in');
      row.innerHTML = `
        <td>#${String(ticket.id).padStart(4,'0')}</td>
        <td>${escapeHtml(ticket.nome)}</td>
        <td>${escapeHtml(ticket.assunto)}</td>
        <td><span style="color:var(--text-secondary);font-size:0.85rem">${escapeHtml(ticket.categoria||'—')}</span></td>
        <td>${badgePrioridade(ticket.prioridade||'baixa')}</td>
        <td>${badgeStatus(ticket.status)}</td>
        <td><a href="ticket.html?id=${ticket.id}" class="btn btn-ghost btn-sm">Ver →</a></td>
        <td>${isAdmin ? `<button onclick="deletarTicket(${ticket.id},this)" class="btn btn-sm" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#f87171">✕</button>` : ''}</td>
      `;
      row.addEventListener('click', (e) => {
        if (!e.target.closest('a') && !e.target.closest('button')) window.location.href = `ticket.html?id=${ticket.id}`;
      });
      tabela.appendChild(row);
    });

  } catch (error) {
    tabela.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="empty-icon">✗</div><div class="empty-title">FALHA NA CONEXÃO</div><div class="empty-sub">// servidor offline em localhost:2500</div></div></td></tr>`;
  }
}

async function deletarTicket(id, btn) {
  if (!confirm(`Deletar ticket #${String(id).padStart(4,'0')}? Esta ação não pode ser desfeita.`)) return;
  btn.classList.add('loading');
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: authHeaders() });
    handleAuthError(res.status);
    if (!res.ok) throw new Error();
    carregarTickets();
  } catch {
    alert('Erro ao deletar ticket.');
    btn.classList.remove('loading');
  }
}

/* =============================================
   DETALHES — ticket.html
============================================= */
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");
if (ticketId) carregarTicket(ticketId);

async function carregarTicket(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, { headers: authHeaders() });
    handleAuthError(response.status);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const ticket = await response.json();

    const titleEl = document.getElementById("ticketIdTitle");
    if (titleEl) titleEl.textContent = `#${String(ticket.id).padStart(4,'0')}`;

    document.getElementById("id").textContent = `#${String(ticket.id).padStart(4,'0')}`;
    document.getElementById("nome").textContent = ticket.nome || '—';
    document.getElementById("email").textContent = ticket.email || '—';
    document.getElementById("assunto").textContent = ticket.assunto || '—';
    document.getElementById("categoria").textContent = ticket.categoria || '—';
    document.getElementById("descricao").textContent = ticket.descricao || '—';
    document.getElementById("prioridade").textContent = ticket.prioridade || '—';
    document.getElementById("sentimento").textContent = ticket.sentimento || '—';
    document.getElementById("resposta").textContent = ticket.resposta_sugerida || '—';
    document.getElementById("status").innerHTML = badgeStatus(ticket.status);

    const select = document.getElementById("novoStatus");
    if (select) select.value = ticket.status;

  } catch (error) {
    const det = document.getElementById("ticketDetalhes");
    if (det) det.innerHTML = `<div class="empty-state"><div class="empty-icon">✗</div><div class="empty-title">TICKET NÃO ENCONTRADO</div><div class="empty-sub">// ID inválido ou sem permissão</div></div>`;
  }
}

/* =============================================
   ATUALIZAR STATUS — ticket.html
============================================= */
const btnStatus = document.getElementById("atualizarStatus");
if (btnStatus) btnStatus.addEventListener("click", atualizarStatus);

async function atualizarStatus() {
  const novoStatus = document.getElementById("novoStatus").value;
  const mensagem = document.getElementById("mensagem");
  const btn = document.getElementById("atualizarStatus");
  btn.classList.add("loading");
  try {
    const response = await fetch(`${API_URL}/${ticketId}/status`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status: novoStatus })
    });
    handleAuthError(response.status);
    if (!response.ok) throw new Error();
    showMsg(mensagem, "Status atualizado com sucesso!", 'sucesso');
    carregarTicket(ticketId);
  } catch {
    showMsg(mensagem, "Falha ao atualizar status.", 'erro');
  } finally {
    btn.classList.remove("loading");
  }
}