const express = require('express');
const cors = require('cors');

const ticketRoutes = require('./routes/tickets');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas — exige JWT
app.use('/api/tickets', authMiddleware, ticketRoutes);

module.exports = app;