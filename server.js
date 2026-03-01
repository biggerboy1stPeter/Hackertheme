const express = require('express');
const app = express();

// ────────────────────────────────────────────────
//     CHAOTIC HACKER-MODE CONSOLE LOGGER (Matrix vibe)
// ────────────────────────────────────────────────
const reset         = '\x1b[0m';
const brightGreen   = '\x1b[92m';     // bright lime – best visibility in logs
const green         = '\x1b[32m';
const dimGreen      = '\x1b[2m\x1b[32m';
const brightRed     = '\x1b[91m';
const yellow        = '\x1b[93m';
const brightMagenta = '\x1b[95m';
const brightCyan    = '\x1b[96m';
const bgBlack       = '\x1b[40m';     // may or may not render on Render

// Glitchy timestamp (occasional corruption for flavor)
const getGlitchTs = () => {
  const now = new Date();
  if (Math.random() < 0.14) {
    const corrupted = now.toISOString().slice(0, 19).split('').sort(() => Math.random() - 0.5).join('');
    return `${dimGreen}[GL1TCH:${corrupted}]${reset}`;
  }
  return `${dimGreen}[${now.toISOString().replace('T', ' ').slice(0, 19)}]${reset}`;
};

function chaosLog(level = 'INFO', ...msgParts) {
  const ts = getGlitchTs();
  const prefixes = {
    INFO:   `${brightGreen}█ INFO ${reset}`,
    ACCESS: `${brightCyan}█ ACCESS${reset}`,
    DB:     `${brightMagenta}█ DB    ${reset}`,
    INTR:   `${brightRed}█ INTR  ${reset}`,
    CRYPTO: `${yellow}█ CRYPTO${reset}`,
    SYS:    `${green}█ SYS   ${reset}`,
    ERROR:  `${brightRed}█ ERR   ${reset}`,
    GLITCH: `${brightMagenta}█ GL1TCH${reset}`,
    TOR:    `${brightMagenta}█ TOR   ${reset}`,
    ONION:  `${yellow}█ ONION ${reset}`,
    I2P:    `${brightCyan}█ I2P   ${reset}`
  };

  const prefix = prefixes[level] || `${brightGreen}█ ${level.padEnd(6)}${reset}`;
  const line = `${dimGreen}┃${reset} ${ts} ${prefix}${reset}`;

  // Occasional subtle scanline / noise effect
  const noise = Math.random() < 0.09 ? `${dimGreen}───[NOISE]─── ${reset}` : '';

  const parts = msgParts.map(p =>
    typeof p !== 'string' ? p :
    Math.random() < 0.10 ? p + ` 0x${Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0')}` :
    p
  );

  console.log(`${line} ${noise}${parts.join(' ')}`);
}

// ────────────────────────────────────────────────
//     STARTUP BANNER (mimics browser look in logs)
// ────────────────────────────────────────────────
function printStartupBanner() {
  const uptime = process.uptime() | 0;
  const circuits = Math.floor(Math.random() * 8) + 5;

  console.log(`${brightGreen}╔════════════════════════════════════════════╗${reset}`);
  console.log(`${brightGreen}║          ${brightGreen}STEADYBOMBER${reset}                   ${brightGreen}║${reset}`);
  console.log(`${brightGreen}║      SHADOW NODE v13.37 ACTIVE            ${brightGreen}║${reset}`);
  console.log(`${brightGreen}║   TOR + I2P LAYERS ENGAGED                ${brightGreen}║${reset}`);
  console.log(`${brightGreen}║   TRACE LEVEL: ULTRA-PARANOID             ${brightGreen}║${reset}`);
  console.log(`${brightGreen}╚════════════════════════════════════════════╝${reset}`);
  console.log('');
  console.log(`${dimGreen}External node${reset}: ${brightGreen}prohacker.com${reset}`);
  console.log(`${dimGreen}Uptime${reset}        : ${brightGreen}${uptime}s${reset}`);
  console.log(`${dimGreen}Circuits / Tunnels${reset}: ~${brightGreen}${circuits}${reset}`);
  console.log(`${dimGreen}Endpoints${reset}      : *** (Tor / I2P / Onion)${reset}`);
  console.log('');
  console.log(`${brightGreen}┌────────────────────────────────────────────┐${reset}`);
  console.log(`${brightGreen}│ BOOT SEQUENCE COMPLETE ─ GRID LINKED       │${reset}`);
  console.log(`${brightGreen}└────────────────────────────────────────────┘${reset}`);
  console.log('');
}

// Fake Tor / Onion / I2P helpers
const fakeNodes = [
  'A1B2C3D4E5F67890123456789ABCDEF123456789',
  'FEDCBA9876543210FEDCBA9876543210FEDCBA98',
  '1337DEAD1337BEEF1337DEAD1337BEEF1337DEAD',
  'E5F67890ABCDEF123456789A1B2C3D4E5F678901',
  'C0FFEEFACEC0FFEEFACEC0FFEEFACEC0FFEEFACE'
];

const randomNode = () => fakeNodes[Math.floor(Math.random() * fakeNodes.length)].slice(0, 8) + '..';

const randomPath = () => {
  const hops = Math.floor(Math.random() * 3) + 3;
  return Array(hops).fill(0).map(randomNode).join(' → ');
};

const fakeBlindedKey = () => 'blinded-' + Math.random().toString(36).slice(2, 14);

const fakeTunnelId = () => `tunnel-${Math.floor(Math.random() * 99999999)}`;
const fakeParticipant = () => `peer-${Math.random().toString(36).slice(2, 10)}..`;

// ────────────────────────────────────────────────
//         MOCK CHAOTIC BACKGROUND NOISE
// ────────────────────────────────────────────────
const fakeActivity = () => {
  const rand = Math.random();

  if (rand < 0.28) {
    const circuitId = Math.floor(Math.random() * 999999);
    const roll = Math.random();
    if (roll < 0.15) chaosLog('TOR', `Bootstrapped 60% (conn_done): Connected to a relay`);
    else if (roll < 0.30) chaosLog('TOR', `Bootstrapped 80% (conn_or): Handshake finished with first hop`);
    else if (roll < 0.50) chaosLog('TOR', `CIRCUIT ${circuitId} EXTENDED hop=${randomNode()}`);
    else if (roll < 0.70) chaosLog('TOR', `CIRCUIT ${circuitId} BUILT path=${randomPath()}`);
    else if (roll < 0.85) chaosLog('TOR', `CIRCUIT ${circuitId} FAILED reason=${['TIMEOUT','DESTROYED','INTERNAL','OR_CONN_CLOSED'][Math.floor(Math.random()*4)]}`);
    else chaosLog('TOR', `CIRCUIT ${circuitId} CLOSED`);
  }
  else if (rand < 0.38) {
    chaosLog('TOR', `Guard node changed → new guard ${randomNode()}`);
  }
  else if (rand < 0.45) {
    chaosLog('TOR', `STREAM ATTACHED circuit=${Math.floor(Math.random()*999999)} port=local:${Math.floor(Math.random()*50000)+10000}`);
  }
  else if (rand < 0.60) {
    const blinded = fakeBlindedKey();
    const roll = Math.random();
    if (roll < 0.25) chaosLog('ONION', `Generating new HSv3 descriptor → blinded pubkey ${blinded}`);
    else if (roll < 0.50) chaosLog('ONION', `Uploading HS descriptor to HSDir replica 1/2 → ${blinded} success`);
    else if (roll < 0.70) chaosLog('ONION', `Descriptor upload failed → HSDir unreachable blinded=${blinded.slice(0,12)}.. reason=timeout`);
    else if (roll < 0.85) chaosLog('ONION', `Publishing intro points → ${Math.floor(Math.random()*3)+2} points announced`);
    else chaosLog('ONION', `Rendezvous attempt → circuit established for client request`);
  }
  else if (rand < 0.80) {
    const tunnel = fakeTunnelId();
    const roll = Math.random();
    if (roll < 0.30) chaosLog('I2P', `Building new outbound tunnel ${tunnel} → garlic routing active`);
    else if (roll < 0.55) chaosLog('I2P', `Inbound tunnel ${tunnel} established → ${Math.floor(Math.random()*4)+2} participants [${fakeParticipant()}, ...]`);
    else if (roll < 0.70) chaosLog('I2P', `Garlic message bundled → 3 cloves (leaseSet + delivery status + data)`);
    else if (roll < 0.85) chaosLog('I2P', `Tunnel ${tunnel} rotated → new exploratory tunnel created`);
    else chaosLog('I2P', `LeaseSet published → destination reachable via garlic encryption`);
  }
  else if (rand < 0.88) {
    chaosLog('INTR', `Blocked probe from 185.220.101.${Math.floor(Math.random()*255)} (possible Tor exit)`);
  }
  else if (rand < 0.94) {
    chaosLog('DB', `Replica sync → latency ${Math.floor(Math.random()*20)+3}ms`);
  }
  else {
    chaosLog('GLITCH', `Fragment corruption seq=${Math.floor(Math.random()*999999)}`);
  }
};

const startChaos = () => {
  setInterval(() => {
    if (Math.random() < 0.82) fakeActivity();
  }, 700 + Math.random() * 2200);
};

// ────────────────────────────────────────────────
//                   SERVER SETUP
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Pro security headers
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
  chaosLog('ACCESS', `Probe from ${req.ip.split('.').slice(0,3).join('.')}.*** → root layer`);

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
      --transition: all 0.25s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
      .scanline, .noise { animation: none; opacity: 0.03; }
    }

    * { margin:0; padding:0; box-sizing:border-box; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-mono);
      min-height: 100dvh;
      overflow-x: hidden;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    header.banner {
      height: clamp(200px, 45dvh, 420px);
      background: linear-gradient(rgba(5,7,15,0.8), rgba(5,7,15,0.5)),
                  url('https://res.cloudinary.com/dkfsr0g6x/image/upload/v1772393541/IMG_0544_jogpla.jpg') center/cover no-repeat;
      background-color: #0a0e1f; /* strong fallback */
      position: relative;
      border-bottom: 2px dashed var(--danger);
      box-shadow: 0 0 30px var(--glow-red);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .banner h1 {
      font-size: clamp(1.8rem, 9vw, 4.5rem);
      letter-spacing: clamp(4px, 1.2vw, 12px);
      filter: drop-shadow(0 0 20px var(--text)) drop-shadow(0 0 40px var(--danger));
      animation: pulseGlitch 10s infinite alternate;
      will-change: filter;
      padding: 0 1rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: clamp(1rem, 4vw, 2.5rem) clamp(0.8rem, 3vw, 2rem);
    }

    pre, .welcome, .form-container pre {
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
      line-height: 1.5;
    }

    .welcome {
      font-size: clamp(0.95rem, 2.8vw, 1.1rem);
      opacity: 0;
      animation: fadeGlitchIn 5.5s forwards;
      will-change: opacity, transform;
    }

    .form-container {
      display: none;
      margin-top: clamp(1.5rem, 5vw, 3rem);
      border: 1px dashed var(--danger);
      padding: clamp(1.2rem, 4vw, 2rem);
      background: rgba(10, 20, 40, 0.5);
      box-shadow: 0 0 30px var(--glow-cyan), inset 0 0 15px var(--glow-red);
      border-radius: 6px;
    }

    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.8rem, 3vw, 1.2rem);
    }

    input, button {
      font-family: inherit;
      background: #0a1122;
      color: var(--text);
      border: 1px solid var(--accent);
      padding: clamp(0.8rem, 3.5vw, 1.1rem) 1.2rem;
      width: 100%;
      max-width: 460px;
      font-size: clamp(0.95rem, 3.2vw, 1.05rem);
      transition: var(--transition);
      border-radius: 4px;
      touch-action: manipulation; /* faster tap response */
    }

    input:focus {
      outline: none;
      border-color: var(--danger);
      box-shadow: 0 0 18px var(--glow-red);
    }

    button {
      cursor: pointer;
      font-weight: bold;
      border-color: var(--danger);
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    button:hover, button:focus {
      background: var(--danger);
      color: var(--bg);
      box-shadow: 0 0 25px var(--glow-red);
    }

    .result {
      margin-top: 1.2rem;
      font-weight: bold;
      min-height: 2.2em;
      text-align: center;
      text-shadow: 0 0 8px currentColor;
      font-size: clamp(0.95rem, 3.2vw, 1.1rem);
    }

    .granted { color: var(--success); animation: pulseGreen 3s infinite; will-change: opacity, filter; }
    .denied   { color: var(--danger);   animation: pulseRed 2s infinite; will-change: opacity, filter; }

    @keyframes fadeGlitchIn { 0% { opacity:0; transform:translateY(30px) skew(1.5deg); } 100% { opacity:1; transform:translateY(0) skew(0); } }
    @keyframes pulseGreen { 0%,100% { opacity:1; filter:drop-shadow(0 0 12px var(--success)); } 50% { opacity:0.85; filter:drop-shadow(0 0 30px var(--success)); } }
    @keyframes pulseRed   { 0%,100% { opacity:1; filter:drop-shadow(0 0 12px var(--danger)); } 50% { opacity:0.75; filter:drop-shadow(0 0 35px var(--danger)); } }
    @keyframes pulseGlitch { 0% { filter:drop-shadow(0 0 18px var(--text)) drop-shadow(0 0 35px var(--danger)); } 100% { filter:drop-shadow(3px 3px 25px var(--danger)) drop-shadow(-3px -3px 25px var(--text)); } }

    @keyframes heavyGlitch {
      0%   { clip:rect(0,9999px,0,0); transform:translate(0); }
      10%  { clip:rect(20px,9999px,80px,0); transform:translate(-4px,2px); }
      20%  { clip:rect(50px,9999px,120px,0); transform:translate(3px,-3px); }
      100% { clip:rect(0,9999px,0,0); transform:translate(0); }
    }

    .scanline, .noise {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      will-change: transform, opacity;
    }

    .scanline {
      background: linear-gradient(transparent 48%, rgba(102,204,255,0.05) 50%, transparent 52%);
      background-size: 100% 4px;
      animation: scan 16s linear infinite;
      opacity: 0.22;
      transform: translateZ(0);
    }

    .noise {
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" /><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>');
      opacity: 0.07;
      animation: heavyGlitch 10s steps(4) infinite;
    }

    @keyframes scan { 0% { transform:translateY(-120%); } 100% { transform:translateY(120%); } }

    @media (min-width: 640px) {
      .container { padding: 3rem 2.5rem; }
      .form-container { max-width: 580px; margin: 2.5rem auto 0; }
      .welcome { font-size: 1.15rem; }
    }

    @media (min-width: 1024px) {
      header.banner { height: 50dvh; }
      .banner h1 { font-size: clamp(4rem, 8vw, 6.5rem); }
    }

    @media (max-width: 480px) {
      .noise { animation: none; opacity: 0.04; }
      .scanline { animation-duration: 22s; opacity: 0.18; }
      .banner h1 { font-size: clamp(1.6rem, 10vw, 3.5rem); letter-spacing: 3px; }
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
    
You were never meant to find this stratum.

Beyond surface onions, past commodified shadows 
this is the bluuWeb underlayer: 
ghost handshakes ...
Rip BluuBirdie ...

LAYER DEPTH .............. 9 / ABYSSAL
CIPHER SUITE ............. bluu-v9 (entropic shadow veil)
UPLINK INTEGRITY ......... FRAGMENTING
TRACE RESISTANCE ......... nominal → degrading
PARANOIA INDEX ........... 12/10 — breathe quietly
    </pre>

    <div id="loginForm" class="form-container">
      
      <form id="login">
        <input type="text"    id="username" placeholder="SHADOW HANDLE" required autocomplete="off" />
        <input type="password" id="password" placeholder="Bluu DEEP KEY"   required autocomplete="off" />
        <button type="submit">BREACH LAYER</button>
      </form>

      <div id="result" class="result"></div>
    </div>
  </div>

  <script>
    setTimeout(() => {
      document.getElementById('welcome').style.opacity = '0.4';
      document.getElementById('loginForm').style.display = 'block';
    }, 5200); // slightly faster reveal on mobile

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
        }, 1800);
      } else {
        result.innerHTML = '<span class="denied">REJECTED — ECHO-TRAP DEPLOYED. YOUR FRAGMENT IS NOW MARKED.</span>';
        console.log('%c[Ol’bluuWeb L9] Intrusion probe rejected from client', 'color:#ff3366');
      }
    });
  </script>
</body>
</html>
`);
});

app.get('/status', (req, res) => {
  chaosLog('ACCESS', `Probe detected from ${req.ip.split('.').slice(0,3).join('.')}.*** → /status`);
  res.json({
    grid: 'active',
    tor_circuits: Math.floor(Math.random()*12)+2,
    i2p_tunnels: Math.floor(Math.random()*8)+1,
    latency_ms: Math.floor(Math.random()*40)+8,
    threats_blocked: Math.floor(Math.random()*500),
    last_descriptor_upload: new Date(Date.now() - Math.random()*1000*60*30).toISOString()
  });
});

// 404 trap
app.use((req, res) => {
  chaosLog('INTR', `${req.method} ${req.originalUrl} → rejected`);
  res.status(404).send(`<pre style="color:#ff0044;background:#000;font-family:monospace;padding:2rem;">
    ╔════════════════════════════╗
    ║       ACCESS DENIED        ║
    ║     TRACE TERMINATED       ║
    ╚════════════════════════════╝
  </pre>`);
});

// Error handler
app.use((err, req, res, next) => {
  chaosLog('ERROR', err.message || 'Unknown kernel fault');
  if (Math.random() < 0.5) chaosLog('TOR', `Circuit ${Math.floor(Math.random()*999999)} DESTROYED reason=INTERNAL`);
  res.status(500).json({ status: 'fractured', reason: 'panic contained' });
});

// ────────────────────────────────────────────────
//                      LAUNCH
// ────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  printStartupBanner();

  chaosLog('SYS', `Node ${PORT} online → grid linked`);
  chaosLog('TOR', `Tor SOCKS5 proxy layer up → bootstrapping circuits`);
  chaosLog('ONION', `HSv3 service initialized → descriptor publishing started`);
  chaosLog('I2P', `Garlic router active → tunnel manager online`);
  chaosLog('TOR', `CIRCUIT 1 BUILT path=${randomPath()}`);

  startChaos();
});

process.on('SIGTERM', () => {
  chaosLog('SYS', 'SIGTERM caught → shredding memory...');
  chaosLog('TOR', 'Closing all active circuits...');
  chaosLog('I2P', 'Tearing down garlic tunnels...');
  setTimeout(() => process.exit(0), 1400);
});