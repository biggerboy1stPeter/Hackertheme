// server.js
const express = require('express');
const app = express();

// ────────────────────────────────────────────────
//   MOBILE-FRIENDLY HACKER CONSOLE LOGGER
// ────────────────────────────────────────────────
const reset         = '\x1b[0m';
const brightGreen   = '\x1b[92m';
const dimGreen      = '\x1b[2m\x1b[32m';
const brightRed     = '\x1b[91m';
const yellow        = '\x1b[93m';
const brightMagenta = '\x1b[95m';
const brightCyan    = '\x1b[96m';

// Short timestamp: HH:MM:SS + rare glitch
const getShortTs = () => {
  const d = new Date();
  const h = d.getHours().toString().padStart(2,'0');
  const m = d.getMinutes().toString().padStart(2,'0');
  const s = d.getSeconds().toString().padStart(2,'0');

  if (Math.random() < 0.09) {
    return `${dimGreen}[GL:${h}:${m}:${s}]${reset}`;
  }
  return `${dimGreen}[${h}:${m}:${s}]${reset}`;
};

function chaosLog(level = 'INFO', ...msgParts) {
  const ts = getShortTs();

  // Single char prefixes – very compact
  const prefixes = {
    INFO:   `${brightGreen}I${reset}`,
    ACCESS: `${brightCyan}A${reset}`,
    DB:     `${brightMagenta}D${reset}`,
    INTR:   `${brightRed}!${reset}`,
    CRYPTO: `${yellow}C${reset}`,
    SYS:    `${brightGreen}S${reset}`,
    ERROR:  `${brightRed}E${reset}`,
    GLITCH: `${brightMagenta}G${reset}`,
    TOR:    `${brightMagenta}T${reset}`,
    ONION:  `${yellow}O${reset}`,
    I2P:    `${brightCyan}2${reset}`
  };

  const prefix = prefixes[level] || `${brightGreen}?${reset}`;
  const line = `${ts} ${prefix} `;

  let msg = msgParts.join(' ').trim();
  // Truncate long messages for mobile
  if (msg.length > 62) msg = msg.slice(0, 59) + '...';

  // Very rare subtle noise marker
  const noise = Math.random() < 0.05 ? `${dimGreen}~${reset}` : '';

  console.log(`${line}${noise}${msg}`);
}

// Tiny startup banner – fits small screens
function printStartupBanner() {
  const uptime = Math.floor(process.uptime());
  console.log(`${brightGreen}>> STEADYBOMBER NODE 13.37${reset}`);
  console.log(`${dimGreen} TOR+I2P | PARANOID MODE${reset}`);
  console.log(`${dimGreen} Up: ${uptime}s | sim${reset}`);
  console.log(`${brightGreen}── boot ok ──${reset}`);
}

// ────────────────────────────────────────────────
//   Fake helpers (shortened output where possible)
// ────────────────────────────────────────────────
const fakeNodes = [
  'A1B2C3D4..', 'FEDCBA98..', '1337BEEF..',
  'E5F67890..', 'C0FFEEFA..'
];

const randomNode = () => fakeNodes[Math.floor(Math.random() * fakeNodes.length)];

const randomPath = () => {
  const hops = Math.floor(Math.random() * 3) + 3;
  return Array(hops).fill(0).map(randomNode).join('>');
};

const fakeBlindedKey = () => 'blnd-' + Math.random().toString(36).slice(2,9);

const fakeTunnelId = () => `t-${Math.floor(Math.random() * 99999)}`;

// ────────────────────────────────────────────────
//         MOCK CHAOTIC BACKGROUND NOISE
// ────────────────────────────────────────────────
const fakeActivity = () => {
  const r = Math.random();

  if (r < 0.24) {
    const cid = Math.floor(Math.random() * 99999);
    const roll = Math.random();
         if (roll < 0.25) chaosLog('TOR', `Bootstrap 60-80%`);
    else if (roll < 0.55) chaosLog('TOR', `CIRC ${cid} EXT ${randomNode()}`);
    else if (roll < 0.8)  chaosLog('TOR', `CIRC ${cid} BUILT ${randomPath()}`);
    else                  chaosLog('TOR', `CIRC ${cid} fail/close`);
  }
  else if (r < 0.34) {
    chaosLog('TOR', `Guard ${randomNode()}`);
  }
  else if (r < 0.45) {
    chaosLog('ONION', `HSv3 desc ${fakeBlindedKey()}`);
  }
  else if (r < 0.58) {
    chaosLog('I2P', `Tunnel ${fakeTunnelId()} active`);
  }
  else if (r < 0.72) {
    chaosLog('INTR', `Probe 185.220.*.* blocked`);
  }
  else if (r < 0.84) {
    chaosLog('SYS', `Check ${Math.random() > 0.88 ? 'TAMPER' : 'ok'}`);
  }
  else {
    chaosLog('GLITCH', `seq ${Math.floor(Math.random()*99999)}`);
  }
};

const startChaos = () => {
  setInterval(() => {
    if (Math.random() < 0.7) fakeActivity();
  }, 1800 + Math.random() * 3400); // slower = better mobile reading
};

// ────────────────────────────────────────────────
//                   SERVER SETUP
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  const up = Math.floor(process.uptime());
  res.type('text/html').send(`
<pre style="color:lime;background:#000;padding:1rem;font-family:monospace;font-size:0.95rem;line-height:1.35;white-space:pre-wrap;word-break:break-all;">
>> STEADYBOMBER 13.37
TOR + I2P ACTIVE
PARANOID TRACE

Ext: ${req.hostname}
Up: ${up}s
~${Math.floor(Math.random()*10)+3} circuits

/status → grid info
</pre>
  `);
});

app.get('/status', (req, res) => {
  chaosLog('ACCESS', `Probe ${req.ip.split('.').slice(0,3).join('.')}.*`);
  res.json({
    grid: 'active',
    tor: Math.floor(Math.random()*12)+2,
    i2p: Math.floor(Math.random()*8)+1,
    latency: Math.floor(Math.random()*40)+8,
    blocked: Math.floor(Math.random()*500)
  });
});

app.use((req, res) => {
  chaosLog('INTR', `${req.method} ${req.path} denied`);
  res.status(404).type('text/html').send(`
<pre style="color:#ff0044;background:#000;padding:1.2rem;font-family:monospace;">
ACCESS DENIED
TRACE TERMINATED
</pre>
  `);
});

app.use((err, req, res, next) => {
  chaosLog('ERROR', err.message || 'fault');
  res.status(500).json({ status: 'fractured' });
});

// ────────────────────────────────────────────────
//                      LAUNCH
// ────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  printStartupBanner();

  chaosLog('SYS',   `Node ${PORT} online`);
  chaosLog('TOR',   `SOCKS5 layer up`);
  chaosLog('ONION', `HSv3 publishing`);
  chaosLog('I2P',   `Garlic active`);

  startChaos();
});

process.on('SIGTERM', () => {
  chaosLog('SYS', 'SIGTERM → shutdown');
  setTimeout(() => process.exit(0), 800);
});