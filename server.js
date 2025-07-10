const express = require('express');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const commandHandler = require('./modules/commandHandler');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dashboard')));

const AUTH_TOKEN = process.env.DASHBOARD_TOKEN || '';
const SUPPORTED_PAIRS = process.env.SUPPORTED_PAIRS ? process.env.SUPPORTED_PAIRS.split(',').map(p=>p.trim().toUpperCase()) : [];
const CONFIG_DIR = path.join(__dirname, 'config');
const PENDING_DIR = path.join(__dirname, 'pending_orders');
const LIVE_DIR = path.join(__dirname, 'live_positions');
const PROMPT_DIR = path.join(__dirname, 'prompts');

let botSettings = { isNewsEnabled: process.env.ENABLE_NEWS_SEARCH === 'true' };

function auth(req, res, next) {
  if (!AUTH_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  const header = req.headers['authorization'] || '';
  if (header === `Bearer ${AUTH_TOKEN}`) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

async function getStatus() {
  const fake = { last: '', async sendMessage(id, { text }) { this.last = text; } };
  await commandHandler.handleConsolidatedStatusCommand(
    SUPPORTED_PAIRS,
    botSettings,
    fake,
    'dashboard'
  );
  return fake.last;
}

async function loadJsonFiles(dir) {
  try {
    const files = await fs.readdir(dir);
    const result = [];
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      const data = await fs.readFile(path.join(dir, f), 'utf8');
      result.push({ file: f, data: JSON.parse(data) });
    }
    return result;
  } catch (err) {
    return [];
  }
}

function parseEnv(str) {
  const obj = {};
  str.split(/\n/).forEach(line => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) obj[m[1]] = m[2];
  });
  return obj;
}

function stringifyEnv(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');
}

app.get('/status', auth, async (req, res) => {
  const msg = await getStatus();
  res.json({ message: msg });
});

app.get('/orders', auth, async (req, res) => {
  const pending = await loadJsonFiles(PENDING_DIR);
  const live = await loadJsonFiles(LIVE_DIR);
  res.json({ pending, live });
});

async function executeCommand(text) {
  const fake = { msgs: [], async sendMessage(id, { text }) { this.msgs.push(text); } };
  const chatId = 'dashboard';
  const cmd = text.split(' ')[0].toLowerCase();
  switch (cmd) {
    case '/status':
      await commandHandler.handleConsolidatedStatusCommand(SUPPORTED_PAIRS, botSettings, fake, chatId);
      break;
    case '/cls':
      await commandHandler.handleCloseCommand(text, chatId, fake);
      break;
    case '/settings':
    case '/setting':
      await commandHandler.handleSettingsCommand(text, botSettings, chatId, fake);
      break;
    case '/add_recipient':
      await commandHandler.handleAddRecipient(text, chatId, fake);
      break;
    case '/del_recipient':
      await commandHandler.handleDelRecipient(text, chatId, fake);
      break;
    case '/list_recipients':
      await commandHandler.handleListRecipients(chatId, fake);
      break;
    case '/pause':
      await commandHandler.handlePauseCommand(fake, chatId);
      break;
    case '/resume':
      await commandHandler.handleResumeCommand(fake, chatId);
      break;
    case '/profit_today':
      await commandHandler.handleProfitTodayCommand(fake, chatId);
      break;
    default:
      fake.msgs.push('Command not handled');
  }
  return fake.msgs;
}

app.post('/command', auth, async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: 'No command' });
  try {
    const result = await executeCommand(command);
    res.json({ messages: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/settings', auth, async (req, res) => {
  const envPath = path.join(__dirname, '.env');
  let env = {};
  try {
    const data = await fs.readFile(envPath, 'utf8');
    env = parseEnv(data);
  } catch {}
  const configs = await loadJsonFiles(CONFIG_DIR);
  res.json({ env, configs });
});

app.post('/settings', auth, async (req, res) => {
  const { env, configs } = req.body;
  const envPath = path.join(__dirname, '.env');
  if (env) {
    await fs.writeFile(envPath, stringifyEnv(env));
  }
  if (Array.isArray(configs)) {
    for (const c of configs) {
      if (c.file && c.data) {
        await fs.writeFile(path.join(CONFIG_DIR, c.file), JSON.stringify(c.data, null, 2));
      }
    }
  }
  res.json({ status: 'ok' });
});

app.get('/prompts', auth, async (req, res) => {
  const file = req.query.file;
  if (file) {
    try {
      const data = await fs.readFile(path.join(PROMPT_DIR, file), 'utf8');
      return res.json({ file, content: data });
    } catch (err) {
      return res.status(404).json({ error: 'Not found' });
    }
  }
  const files = await fs.readdir(PROMPT_DIR);
  res.json({ files });
});

app.post('/prompts', auth, async (req, res) => {
  const { file, content } = req.body;
  if (!file) return res.status(400).json({ error: 'No file' });
  await fs.writeFile(path.join(PROMPT_DIR, file), content || '');
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dashboard server running on port ${PORT}`);
});
