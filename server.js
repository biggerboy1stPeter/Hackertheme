const express = require('express');
const app = express();

// ────────────────────────────────────────────────
//   MOBILE-FRIENDLY HACKER CONSOLE LOGGER + MORE CATEGORIES
// ────────────────────────────────────────────────
const reset         = '\x1b[0m';
const brightGreen   = '\x1b[92m';
const dimGreen      = '\x1b[2m\x1b[32m';
const brightRed     = '\x1b[91m';
const yellow        = '\x1b[93m';
const brightMagenta = '\x1b[95m';
const brightCyan    = '\x1b[96m';
const brightYellow  = '\x1b[93m\x1b[1m';

// Short timestamp: HH:MM:SS + rare glitch
const getShortTs = () => {
  const d = new Date();
  const h = d.getHours().toString().padStart(2,'0');
  const m = d.getMinutes().toString().padStart(2,'0');
  const s = d.getSeconds().toString().padStart(2,'0');

  return Math.random() < 0.09
    ? `${dimGreen}[GL:${h}:${m}:${s}]${reset}`
    : `${dimGreen}[${h}:${m}:${s}]${reset}`;
};

function chaosLog(level = 'INFO', ...msgParts) {
  const ts = getShortTs();

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
    I2P:    `${brightCyan}2${reset}`,
    NET:    `${brightCyan}N${reset}`,
    FW:     `${brightRed}F${reset}`,
    SCAN:   `${yellow}S${reset}`,
    AUTH:   `${brightYellow}L${reset}`,
    MAL:    `${brightRed}M${reset}`,
    VPN:    `${brightMagenta}V${reset}`,
    DNS:    `${brightCyan}Z${reset}`,
    PROXY:  `${dimGreen}P${reset}`,
    BOOT:   `${brightGreen}B${reset}`,
    QUANT:  `${brightMagenta}Q${reset}`
  };

  const prefix = prefixes[level] || `${brightGreen}?${reset}`;
  const line = `${ts} ${prefix} `;

  let msg = msgParts.join(' ').trim();
  if (msg.length > 62) msg = msg.slice(0, 59) + '...';

  const noise = Math.random() < 0.05 ? `${dimGreen}~${reset}` : '';

  console.log(`${line}${noise}${msg}`);
}

// Compact startup banner
function printStartupBanner() {
  const uptime = Math.floor(process.uptime());
  console.log(`${brightGreen}>> STEADYBOMBER NODE 13.37${reset}`);
  console.log(`${dimGreen} TOR+I2P+QUANT | PARANOID${reset}`);
  console.log(`${dimGreen} Up: ${uptime}s | sim${reset}`);
  console.log(`${brightGreen}── boot ok ──${reset}`);
}

// ────────────────────────────────────────────────
//   Fake helpers
// ────────────────────────────────────────────────
const fakeNodes = ['A1B2C3D4..','FEDCBA98..','1337BEEF..','E5F67890..','C0FFEEFA..'];

const randomNode = () => fakeNodes[Math.floor(Math.random() * fakeNodes.length)];

const randomPath = () => {
  const hops = Math.floor(Math.random() * 3) + 3;
  return Array(hops).fill(0).map(randomNode).join('>');
};

const fakeBlindedKey = () => 'blnd-' + Math.random().toString(36).slice(2,9);

const fakeTunnelId = () => `t-${Math.floor(Math.random() * 99999)}`;

// ────────────────────────────────────────────────
//   MOCK CHAOTIC BACKGROUND NOISE – expanded
// ────────────────────────────────────────────────
const fakeActivity = () => {
  const r = Math.random();

  if      (r < 0.18) {
    const cid = Math.floor(Math.random() * 99999);
    const roll = Math.random();
    if      (roll < 0.3)  chaosLog('TOR', `Bootstrap 60-80%`);
    else if (roll < 0.6)  chaosLog('TOR', `CIRC ${cid} EXT ${randomNode()}`);
    else if (roll < 0.85) chaosLog('TOR', `CIRC ${cid} BUILT ${randomPath()}`);
    else                  chaosLog('TOR', `CIRC ${cid} fail`);
  }
  else if (r < 0.24) chaosLog('ONION', `HSv3 desc ${fakeBlindedKey()}`);
  else if (r < 0.30) chaosLog('I2P',   `Tunnel ${fakeTunnelId()} active`);
  else if (r < 0.38) chaosLog('NET',   `pkt ${Math.floor(Math.random()*9999)} rx/tx`);
  else if (r < 0.44) chaosLog('FW',    `DROP src 185.220.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`);
  else if (r < 0.50) chaosLog('SCAN',  `SYN scan port ${Math.floor(Math.random()*9000)+1000}`);
  else if (r < 0.56) chaosLog('AUTH',  `brute attempt root / admin`);
  else if (r < 0.62) chaosLog('MAL',   `match: meterpreter / cobalt-strike`);
  else if (r < 0.68) chaosLog('VPN',   `tunnel up tun0`);
  else if (r < 0.74) chaosLog('DNS',   `leak? ${Math.random().toString(36).slice(2,10)}.onion`);
  else if (r < 0.80) chaosLog('PROXY', `hop → ${randomNode()}`);
  else if (r < 0.86) chaosLog('BOOT',  `scan ${Math.random() > 0.9 ? 'TAMPER' : 'clean'}`);
  else if (r < 0.92) chaosLog('QUANT', `kyber-1024 exchange complete`);
  else               chaosLog('GLITCH', `seq ${Math.floor(Math.random()*99999)}`);
};

const startChaos = () => {
  setInterval(() => {
    if (Math.random() < 0.75) fakeActivity();
  }, 1600 + Math.random() * 3200);
};

// ────────────────────────────────────────────────
//                   SERVER SETUP
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Security headers (pro touch)
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
  });
  next();
});

app.get('/', (req, res) => {
  chaosLog('ACCESS', `Probe ${req.ip.split('.').slice(0,3).join('.')}.* → root`);

  const up = Math.floor(process.uptime());

  res.type('text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ol’bluuWeb • DEEP LAYER-9</title>
  <style>
    :root {
      --bg: #05070f;
      --text: #66ccff;
      --accent: #3399ff;
      --danger: #ff3366;
      --success: #77ff99;
      --glow-cyan: rgba(102,204,255,0.4);
      --glow-red: rgba(255,51,102,0.4);
      --font-mono: 'Courier New', Courier, monospace;
      --transition: all 0.3s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      min-height: 100dvh;
      overflow-x: hidden;
      line-height: 1.6;
    }

    header.banner {
      height: clamp(280px, 50dvh, 500px);
      background: linear-gradient(rgba(5,7,15,0.75), rgba(5,7,15,0.45)),
                  url('https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/w_1920,h_600,c_fill,q_auto,f_auto/your-deep-blue-glitch-banner.jpg');
      background-size: cover;
      background-position: center;
      position: relative;
      border-bottom: 3px dashed var(--danger);
      box-shadow: 0 0 40px var(--glow-red);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .banner h1 {
      font-size: clamp(2.2rem, 8vw, 5rem);
      letter-spacing: clamp(6px, 1.5vw, 14px);
      text-shadow: 0 0 25px var(--text), 0 0 50px var(--danger);
      animation: pulseGlitch 8s infinite alternate;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2.5rem);
    }

    pre, .welcome, .form-container {
      white-space: pre-wrap;
      word-break: break-all;
    }

    .welcome {
      font-size: clamp(1rem, 3vw, 1.2rem);
      opacity: 0;
      animation: fadeGlitchIn 6s forwards;
    }

    .form-container {
      display: none;
      margin-top: clamp(2rem, 6vw, 3.5rem);
      border: 1px dashed var(--danger);
      padding: clamp(1.5rem, 5vw, 2.5rem);
      background: rgba(10, 20, 40, 0.45);
      box-shadow: 0 0 35px var(--glow-cyan), inset 0 0 20px var(--glow-red);
      border-radius: 6px;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    input, button {
      font-family: inherit;
      background: #0a1122;
      color: var(--text);
      border: 1px solid var(--accent);
      padding: clamp(0.9rem, 3vw, 1.2rem) 1.3rem;
      width: 100%;
      max-width: 480px;
      font-size: clamp(1rem, 3.5vw, 1.1rem);
      transition: var(--transition);
      border-radius: 4px;
    }

    input:focus {
      outline: none;
      border-color: var(--danger);
      box-shadow: 0 0 22px var(--glow-red);
    }

    button {
      cursor: pointer;
      font-weight: bold;
      border-color: var(--danger);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    button:hover,
    button:focus {
      background: var(--danger);
      color: var(--bg);
      box-shadow: 0 0 30px var(--glow-red);
    }

    .result {
      margin-top: 1.5rem;
      font-weight: bold;
      min-height: 2.5em;
      text-align: center;
      text-shadow: 0 0 10px currentColor;
      font-size: clamp(1rem, 3.5vw, 1.15rem);
    }

    .granted { color: var(--success); animation: pulseGreen 2.5s infinite; }
    .denied   { color: var(--danger);   animation: pulseRed 1.5s infinite; }

    @keyframes fadeGlitchIn {
      0%   { opacity: 0; transform: translateY(40px) skew(2deg); }
      100% { opacity: 1; transform: translateY(0) skew(0); }
    }

    @keyframes pulseGreen {
      0%, 100% { opacity: 1; text-shadow: 0 0 15px var(--success); }
      50%      { opacity: 0.82; text-shadow: 0 0 35px var(--success); }
    }

    @keyframes pulseRed {
      0%, 100% { opacity: 1; text-shadow: 0 0 15px var(--danger); }
      50%      { opacity: 0.7; text-shadow: 0 0 40px var(--danger); }
    }

    @keyframes pulseGlitch {
      0%   { text-shadow: 0 0 20px var(--text), 0 0 40px var(--danger); }
      100% { text-shadow: 4px 4px 30px var(--danger), -4px -4px 30px var(--text); }
    }

    @keyframes heavyGlitch {
      0%   { clip: rect(0, 9999px, 0, 0); transform: translate(0); }
      5%   { clip: rect(30px, 9999px, 100px, 0); transform: translate(-5px, 3px); }
      10%  { clip: rect(60px, 9999px, 140px, 0); transform: translate(4px, -4px); }
      100% { clip: rect(0, 9999px, 0, 0); transform: translate(0); }
    }

    .scanline, .noise {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .scanline {
      background: linear-gradient(transparent 48%, rgba(102,204,255,0.06) 50%, transparent 52%);
      background-size: 100% 5px;
      animation: scan 14s linear infinite;
      opacity: 0.25;
    }

    .noise {
      background: url('https://res.cloudinary.com/dkfsr0g6x/image/upload/v1772393541/IMG_0544_jogpla.jpg');
      opacity: 0.08;
      animation: heavyGlitch 8s steps(5) infinite;
    }

    @keyframes scan {
      0% { transform: translateY(-120%); }
      100% { transform: translateY(120%); }
    }

    @media (min-width: 768px) {
      .container { padding: 4rem 3rem; }
      .form-container { max-width: 620px; margin: 3rem auto 0; }
      .welcome { font-size: 1.25rem; }
    }

    @media (min-width: 1024px) {
      header.banner { height: 55dvh; }
      .banner h1 { font-size: clamp(4rem, 9vw, 7rem); }
    }
  </style>
</head>
<body>
  <div class="noise"></div>
  <div class="scanline"></div>

  <header class="banner">
    <h1>Ol’bluuWeb • LAYER-9</h1>
  </header>

  <div class="container">
    <pre id="welcome" class="welcome">
  ╔════════════════════════════════════════════════════════╗
  ║          Ol’bluuWeb  •  DEEP LAYER-9 ACCESS            ║
  ╚════════════════════════════════════════════════════════╝

You were never meant to find this stratum.

Beyond surface onions, past commodified shadows —
this is the bluu underlayer: decaying mirrors, obsolete ciphers,
ghost handshakes that never timed out.

Data here doesn't forget. It waits. It watches.

No telemetry. No exit logs. No second chances.

EXTERNAL NODE ............ ${req.hostname}
LAYER DEPTH .............. 9 / ABYSSAL
CIPHER SUITE ............. bluu-v9 (entropic shadow veil)
UPLINK INTEGRITY ......... FRAGMENTING
TRACE RESISTANCE ......... nominal → degrading
PARANOIA INDEX ........... 12/10 — breathe quietly
    </pre>

    <div id="loginForm" class="form-container">
      <pre>
┌──────────────────────────────────────────────────┐
│   LAYER-9 DEEP GATE — FRAGMENT AUTH REQUIRED     │
│   SUBMIT YOUR SHATTERED KEY / SHARD              │
└──────────────────────────────────────────────────┘

CAUTION: Probes may awaken dormant echo-traps.
      </pre>

      <form id="login">
        <input type="text"    id="username" placeholder="SHADOW HANDLE / FRAGMENT ID" required autocomplete="off" />
        <input type="password" id="password" placeholder="DEEP KEY / ABYSSAL SHARD"   required autocomplete="off" />
        <button type="submit">BREACH LAYER</button>
      </form>

      <div id="result" class="result"></div>
    </div>
  </div>

  <script>
    setTimeout(() => {
      document.getElementById('welcome').style.opacity = '0.4';
      document.getElementById('loginForm').style.display = 'block';
    }, 5800);

    document.getElementById('login').addEventListener('submit', e => {
      e.preventDefault();
      const user = document.getElementById('username').value.trim().toLowerCase();
      const pass = document.getElementById('password').value.trim().toLowerCase();
      const result = document.getElementById('result');

      const valid = pass.includes('bluu') || pass.includes('deep') || pass.includes('abyss') ||
                    pass === 'shadow1337' || (user.includes('steady') && pass.includes('9'));

      if (user && pass && valid) {
        result.innerHTML = '<span class="granted">BREACH CONFIRMED — LAYER-9 PENETRATED. WELCOME TO THE ABYSS, SPECTRE.</span>';
        setTimeout(() => {
          result.innerHTML += '<br><br>[echo] shadow archive decrypting... fragments reassembling...';
        }, 2200);
      } else {
        result.innerHTML = '<span class="denied">REJECTED — ECHO-TRAP DEPLOYED. YOUR FRAGMENT IS NOW MARKED.</span>';
        console.log('%c[Ol’bluuWeb L9] Intrusion probe rejected', 'color:#ff3366');
      }
    });
  </script>
</body>
</html>
  `);
});

app.get('/status', (req, res) => {
  chaosLog('ACCESS', `Probe ${req.ip.split('.').slice(0,3).join('.')}.* → /status`);
  res.json({
    grid: 'active',
    tor: Math.floor(Math.random()*12)+2,
    i2p: Math.floor(Math.random()*8)+1,
    quant: Math.floor(Math.random()*5)+1,
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
  chaosLog('QUANT', `Post-quantum layer init`);

  startChaos();
});

process.on('SIGTERM', () => {
  chaosLog('SYS', 'SIGTERM → shutdown');
  setTimeout(() => process.exit(0), 800);
});