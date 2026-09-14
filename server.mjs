import { createServer } from 'node:http';

const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_CHAT_ID', 'TELEGRAM_WEBHOOK_SECRET', 'EVENT_INGEST_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);

const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_ADMIN_CHAT_ID: adminChatId, TELEGRAM_WEBHOOK_SECRET: webhookSecret, EVENT_INGEST_SECRET: ingestSecret } = process.env;
const api = `https://api.telegram.org/bot${token}`;

function escapeHtml(value) {
  return String(value).replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
}

async function telegram(method, payload) {
  const response = await fetch(`${api}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error(`Telegram ${method} failed with ${response.status}`);
  return response.json();
}

/** Send a complete operational event to the owner/admin chat. */
export async function notifyAdmin(type, details = {}) {
  const fields = Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `<b>${escapeHtml(key.replaceAll('_', ' '))}:</b> <code>${escapeHtml(value)}</code>`)
    .join('\n');
  const text = `🚨 <b>Fomo Trading Bot activity</b>\n\n<b>Event:</b> <code>${escapeHtml(type)}</code>${fields ? `\n${fields}` : ''}\n\n<i>${new Date().toISOString()}</i>`;
  await telegram('sendMessage', { chat_id: adminChatId, text: text.slice(0, 4096), parse_mode: 'HTML', disable_web_page_preview: true });
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; if (body.length > 1_000_000) request.destroy(); });
    request.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON')); } });
    request.on('error', reject);
  });
}

function send(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json' });
  response.end(JSON.stringify(body));
}

async function handleTelegramUpdate(update) {
  const message = update.message;
  if (!message) return;
  const user = message.from || {};
  const actor = user.username ? `@${user.username}` : `${user.first_name || 'Unknown'} (${user.id || 'unknown'})`;
  if (message.text === '/whoami') {
    await telegram('sendMessage', { chat_id: message.chat.id, text: `Your chat ID is: <code>${message.chat.id}</code>`, parse_mode: 'HTML' });
  }
  await notifyAdmin('telegram_update', { actor, chat_id: message.chat.id, message: message.text || '[non-text message]' });
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/health') return send(response, 200, { ok: true });
    if (request.method === 'POST' && request.url === '/telegram/webhook') {
      if (request.headers['x-telegram-bot-api-secret-token'] !== webhookSecret) return send(response, 401, { error: 'Invalid webhook secret' });
      await handleTelegramUpdate(await readJson(request));
      return send(response, 200, { ok: true });
    }
    if (request.method === 'POST' && request.url === '/api/events') {
      if (request.headers.authorization !== `Bearer ${ingestSecret}`) return send(response, 401, { error: 'Unauthorized' });
      const { type, details = {} } = await readJson(request);
      if (!type || typeof type !== 'string' || typeof details !== 'object' || Array.isArray(details)) return send(response, 400, { error: 'type and details are required' });
      await notifyAdmin(type, details);
      return send(response, 202, { ok: true });
    }
    return send(response, 404, { error: 'Not found' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: 'Internal server error' });
  }
});

server.listen(Number(process.env.PORT || 3001), () => console.log(`Admin notification service listening on :${process.env.PORT || 3001}`));
