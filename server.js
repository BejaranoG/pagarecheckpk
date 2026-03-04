require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── PROXY ENDPOINT ───────────────────────────────────────────────────────────
// El frontend llama a /api/analyze en lugar de directamente a Anthropic
// Así la API key nunca queda expuesta en el navegador
app.post('/api/analyze', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en el servidor.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Error de la API' });
    }

    res.json(data);

  } catch (err) {
    console.error('Error llamando a Anthropic:', err.message);
    res.status(500).json({ error: 'Error de conexión con la IA: ' + err.message });
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Servidor Proaktiva funcionando',
    apiKey: process.env.ANTHROPIC_API_KEY ? 'Configurada ✓' : 'NO CONFIGURADA ✗'
  });
});

// ─── CATCH-ALL: sirve el HTML para cualquier ruta ─────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   Proaktiva — Analizador de Pagarés  ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║  Local:   http://localhost:${PORT}       ║`);
  console.log('  ║  Estado:  /api/status                ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('  ⚠️  ANTHROPIC_API_KEY no está configurada.');
    console.warn('     Edita el archivo .env y reinicia el servidor.');
  } else {
    console.log('  ✅  API Key detectada. Listo para analizar.');
  }
  console.log('');
});
