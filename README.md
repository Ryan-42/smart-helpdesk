# ⬡ Smart Helpdesk

Sistema de helpdesk inteligente com análise automática de tickets via IA, autenticação JWT e painel de administração.

![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=flat-square&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

 **Demo:** https://SEU_USUARIO.github.io/smart-helpdesk/demo/login-demo.html

##  Funcionalidades

- **Criação de tickets** com análise automática de categoria, prioridade e sentimento
- **Autenticação JWT** com sessão de 8 horas
- **Controle de acesso por perfil** (admin / agente)
- **Dashboard** com métricas em tempo real
- **Painel de usuários** exclusivo para administradores
- **Interface Neural Deep Dark** — tema espacial com animações

---

##  Tecnologias

**Backend**
- Node.js + Express
- better-sqlite3 (banco de dados local)
- jsonwebtoken (autenticação)
- bcryptjs (hash de senhas)
- dotenv

**Frontend**
- HTML, CSS e JavaScript puro (sem frameworks)
- Google Fonts — Orbitron, Rajdhani, JetBrains Mono

---

##  Estrutura do projeto

```
smart-helpdesk/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── ticketController.js
│   ├── database/
│   │   └── database.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── ticketModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tickets.js
│   ├── services/
│   │   └── aiAnalyzer.js
│   ├── utils/
│   │   └── helpers.js
│   ├── .env.example
│   ├── app.js
│   └── server.js
└── frontend/
    ├── index.html       ← Criar ticket
    ├── dashboard.html   ← Listar tickets
    ├── ticket.html      ← Detalhes do ticket
    ├── login.html       ← Autenticação
    ├── usuarios.html    ← Gestão de usuários (admin)
    ├── script.js
    └── style.css
```

---

##  Como rodar

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/smart-helpdesk.git
cd smart-helpdesk
```

**2. Configure o backend**
```bash
cd backend
npm install
```

**3. Crie o arquivo `.env`**
```bash
cp .env.example .env
```
Edite o `.env` com seus valores:
```
PORT=2500
JWT_SECRET=sua_chave_secreta_aqui
```

**4. Inicie o servidor**
```bash
node server.js
```

Saída esperada:
```
[seed] Admin criado com sucesso — login: admin / senha: admin
Servidor rodando em http://localhost:2500
```

**5. Abra o frontend**

Abra `frontend/index.html` com o **Live Server** do VS Code ou qualquer servidor local.

---

##  Acesso padrão

| Campo | Valor |
|---|---|
| Login | `admin` |
| Senha | `admin` |

>  Altere a senha do admin após o primeiro acesso em produção.

---

##  Rotas da API

### Autenticação
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Autenticar usuário |
| POST | `/api/auth/register` | Admin | Criar novo usuário |
| GET | `/api/auth/me` | Autenticado | Dados do usuário logado |
| GET | `/api/auth/usuarios` | Admin | Listar todos os usuários |

### Tickets
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/api/tickets` | Autenticado | Listar tickets (admin = todos, agente = os seus) |
| POST | `/api/tickets` | Autenticado | Criar ticket |
| GET | `/api/tickets/:id` | Autenticado | Buscar ticket por ID |
| PUT | `/api/tickets/:id/status` | Autenticado | Atualizar status |
| DELETE | `/api/tickets/:id` | Admin | Deletar ticket |

---

##  Perfis de acesso

| Funcionalidade | Admin | Agente |
|---|---|---|
| Ver todos os tickets | ✅ | ❌ |
| Ver próprios tickets | ✅ | ✅ |
| Criar ticket | ✅ | ✅ |
| Atualizar status | ✅ | ✅ |
| Deletar ticket | ✅ | ❌ |
| Criar usuários | ✅ | ❌ |
| Painel de usuários | ✅ | ❌ |

---

##  Análise de IA

O `aiAnalyzer` processa a descrição do ticket automaticamente e retorna:

- **Categoria** — `acesso`, `rede`, `geral`
- **Prioridade** — `alta`, `baixa`
- **Sentimento** — `frustrado`, `neutro`
- **Resposta sugerida** — texto de resposta automática

---

##  Licença

Este projeto foi desenvolvido para fins de portfólio pessoal.