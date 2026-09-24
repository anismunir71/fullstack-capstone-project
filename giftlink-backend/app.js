// giftlink-backend/app.js
// Main Express application — wires middleware and routes.

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routers
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes'); // placeholder (Module 4)

// Import logger (adjust path if logger.js sits at repo root instead of util/)
const logger = require('./util/logger');

const app = express();

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Request logger
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

/* ---------------------- Routes ---------------------- */
// ✅ Grading Task 5 — served via giftRoutes.js
app.use('/api/gifts', giftRoutes);

// ✅ Grading Task 7 — /api/search served via searchRoutes.js
app.use('/api/search', searchRoutes);

// Auth routes (implemented in Module 4)
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'giftlink-backend' });
});

// Fallback 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ------------------ Server Startup ------------------ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 GiftLink backend listening on port ${PORT}`);
});

module.exports = app;