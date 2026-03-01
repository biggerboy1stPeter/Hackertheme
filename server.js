// server.js
const express = require('express');
const app = express();

// ────────────────────────────────────────────────
//        CHAOTIC HACKER-MODE CONSOLE LOGGER
// ────────────────────────────────────────────────
const reset       = '\x1b[0m';
const brightGreen = '\x1b[92m';
const green       = '\x1b[32m';
const dimGreen    = '\x1b[2m\x1b[32m';
const red         = '\x1b[91m';
const brightRed   = '\x1b[31m\x1b[1m';
const yellow      = '\x1b[93m';
const cyan        = '\x1b[96m';
const magenta     = '\x1b[95m';
const brightMagenta = '\x1b[35m\x1b[1m';
const bgBlack     = '\x1b[40m';

const getGlitchTs = () => {
  const now = new Date();
  if (Math.random() < 0.15) {  // slightly higher glitch chance for Tor flavor
    return `${dimGreen}[${now.toISOString().slice(0,19).split('').sort(() => Math.random() - 0.5).join('')}]${reset}`;
  }
  return `${dimGreen}[${now.toISOString().replace('T', ' ').slice(0,19)}]${reset}`;
};

function chaosLog(level = 'INFO', ...msgParts) {
  const ts = getGlitchTs();
  const prefixes = {
    INFO:   `${brightGreen}█ INFO${reset}`,
    ACCESS: `${cyan}█ ACCESS${reset}`,
    DB:     `${magenta}█ DATABASE${reset}`,
    INTR:   `${brightRed}█ INTRUSION${reset}`,
    CRYPTO: `${yellow}█ CRYPTO${reset}`,
    SYS:    `${green}█ SYSCHK${reset}`,
    ERROR:  `${brightRed}█ ERROR${reset}`,
    GLITCH: `${magenta}█ GL1TCH${reset}`,
    TOR:    `${brightMagenta}█ TOR${reset}`     // new: Tor circuit theme
  };

  const prefix = prefixes[level] || `${green}█ ${level}${reset}`;
  const line = `${bgBlack}${ts} ${prefix}${reset}`;

  const parts = msgParts.map(part => {
    if (typeof part !== 'string') return part;
    if (Math.random() < 0.10) {
      return part + '  ' + Array(8).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('');
    }
    if (Math.random() < 0.08) {
      return part + ` 0x${Math.floor(Math.random()*0xFFFFFFFF).toString(16).padStart(8,'0')}`;
    }
    return part;
  });

  console.log(line, ...parts);
}

// Fake Tor fingerprints / node IDs (looks like real relay hashes)
const fakeNodes = [
  'A1B2C3D4E5F67890123456789ABCDEF123456789',
  'FEDCBA9876543210FEDCBA9876543210FEDCBA98',
  '1337DEAD1337BEEF1337DEAD1337BEEF1337DEAD',
  '9999999999999999999999999999999999999999',
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'C0FFEEFACEC0FFEEFACEC0FFEEFACEC0FFEEFACE'
];

const randomNode = () => fakeNodes[Math.floor(Math.random() * fakeNodes.length)].slice(0, 8) + '..';

const randomPath = () => {
  const hops = Math.floor(Math.random() * 3) + 3; // usually 3-5 hops
  const path = [];
  for (let i = 0; i < hops; i++) {
    path.push(randomNode());
  }
  return path.join(',');
};

// ────────────────────────────────────────────────
//         MOCK CHAOTIC BACKGROUND NOISE + TOR
// ────────────────────────────────────────────────
const fakeActivity = () => {
  const rand = Math.random();

  if (rand < 0.12) {
    chaosLog('DB', `MongoDB replica set re-sync complete → latency ${Math.floor(Math.random()*18)+2}ms`);
  }
  else if (rand < 0.22) {
    chaosLog('INTR', `Blocked port scan from 185.220.101.${Math.floor(Math.random()*255)} (Tor exit node)`);
  }
  else if (rand < 0.35) {  // increased chance for Tor stuff
    const circuitId = Math.floor(Math.random() * 999999);
    const statusRoll = Math.random();

    if (statusRoll < 0.25) {
      chaosLog('TOR', `CIRCUIT ${circuitId} LAUNCHED`);
    }
    else if (statusRoll < 0.50) {
      chaosLog('TOR', `CIRCUIT ${circuitId} EXTENDED ${randomNode()}`);
    }
    else if (statusRoll < 0.75) {
      chaosLog('TOR', `CIRCUIT ${circuitId} BUILT path=${randomPath()}`);
    }
    else if (statusRoll < 0.88) {
      chaosLog('TOR', `CIRCUIT ${circuitId} FAILED reason=TIMEOUT path=${randomPath()}`);
    }
    else {
      chaosLog('TOR', `CIRCUIT ${circuitId} CLOSED`);
    }
  }
  else if (rand < 0.45) {
    chaosLog('TOR', `STREAM ATTACHED circuit=${Math.floor(Math.random()*999999)} socks_port=local:${Math.floor(Math.random()*65535)}`);
  }
  else if (rand < 0.55) {
    chaosLog('CRYPTO', `Wallet ping → 0x${Math.random().toString(36).slice(2,10)}... balance unchanged`);
  }
  else if (rand < 0.65) {
    chaosLog('SYS', `Kernel integrity check → ${Math.random() > 0.85 ? 'TAMPER DETECTED' : 'clean'}`);
  }
  else if (rand < 0.75) {
    chaosLog('GLITCH', `Packet fragment corruption detected → seq ${Math.floor(Math.random()*999999)}`);
  }
  else if (rand < 0.85) {
    chaosLog('ACCESS', `Unauthorized probe → /admin → 403 → source 45.79.142.${Math.floor(Math.random()*255)}`);
  }
  else if (rand < 0.92) {
    chaosLog('ERROR', `Redis command timeout → FLUSHALL rejected (ACL active)`);
  }
  else {
    chaosLog('TOR', `GUARD node changed → new guard ${randomNode()}`);
  }
};

const startChaos = () => {
  chaosLog('SYS', 'Starting shadow simulation threads...');
  chaosLog('TOR', 'Tor circuit manager initialized → bootstrapping anonymity layer');
  
  setInterval(() => {
    if (Math.random() < 0.75) fakeActivity();  // ~75% chance each interval → more Tor noise
  }, 900 + Math.random() * 2400);  // faster/more irregular than before
};

// ────────────────────────────────────────────────
//                   SERVER SETUP
// ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <pre style="color:lime;background:#000;padding:2rem;font-family:monospace;">
    ╔══════════════════════════════╗
    ║       STEADYBOMBER           ║
    ║        SHADOW NODE           ║
    ║   TOR LAYER ACTIVE – ONION   ║
    ║  TRACE LEVEL: PARANOID       ║
    ╚══════════════════════════════╝
    
    External: ${req.hostname}
    Uptime seed: ${process.uptime()|0}s
    Circuits active: ~${Math.floor(Math.random()*8)+2}
    </pre>
  `);
});

app.get('/status', (req, res) => {
  chaosLog('ACCESS', `Status probe from ${req.ip.split('.').slice(0,3).join('.')}.***`);
  res.json({
    grid: 'active',
    nodes: Math.floor(Math.random()*6)+4,
    latency: `${Math.floor(Math.random()*30)+5}ms`,
    threats_blocked: Math.floor(Math.random()*340),
    active_circuits: Math.floor(Math.random()*12)+1,
    last_circuit_built: new Date(Date.now() - Math.random()*1000*60*15).toISOString()
  });
});

// 404 trap
app.use((req, res) => {
  chaosLog('INTR', `${req.method} ${req.originalUrl} → probe rejected`);
  res.status(404).send(`<pre style="color:#ff0044;background:black;font-family:monospace;">
    ╔══════════════════════╗
    ║     NODE NOT FOUND   ║
    ║   TRACE TERMINATED   ║
    ╚══════════════════════╝</pre>`);
});

// Error → fake stack trace sometimes
app.use((err, req, res, next) => {
  chaosLog('ERROR', err.message);
  if (Math.random() < 0.4) {
    chaosLog('TOR', `CIRCUIT ${Math.floor(Math.random()*999999)} FAILED reason=INTERNAL`);
  }
  res.status(500).json({ grid: 'fractured', reason: 'kernel panic averted' });
});

// ────────────────────────────────────────────────
//                      LAUNCH
// ────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  chaosLog('SYS', `Node ${PORT} → grid connection established`);
  chaosLog('DB',  `MongoDB replica → primary elected (rs0:27017)`);
  chaosLog('TOR', `Tor SOCKS proxy layer online → circuit bootstrapping...`);
  chaosLog('TOR', `CIRCUIT 1 BUILT path=${randomPath()}`);

  // Start the fake chaos generator (now heavier on Tor)
  startChaos();
});

process.on('SIGTERM', () => {
  chaosLog('SYS', 'SIGTERM intercepted → wiping volatile memory...');
  chaosLog('TOR', 'Closing all active circuits...');
  setTimeout(() => process.exit(0), 1200);
});
