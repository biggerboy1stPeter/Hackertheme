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
const brightCyan  = '\x1b[36m\x1b[1m';
const magenta     = '\x1b[95m';
const brightMagenta = '\x1b[35m\x1b[1m';
const bgBlack     = '\x1b[40m';

const getGlitchTs = () => {
  const now = new Date();
  if (Math.random() < 0.18) {
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
    TOR:    `${brightMagenta}█ TOR${reset}`,
    ONION:  `${yellow}█ ONION${reset}`,       // new: HSv3 onion service
    I2P:    `${brightCyan}█ I2P${reset}`       // new: I2P garlic/tunnel
  };

  const prefix = prefixes[level] || `${green}█ ${level}${reset}`;
  const line = `${bgBlack}${ts} ${prefix}${reset}`;

  const parts = msgParts.map(part => {
    if (typeof part !== 'string') return part;
    if (Math.random() < 0.12) return part + '  ' + Array(8).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join('');
    if (Math.random() < 0.09) return part + ` 0x${Math.floor(Math.random()*0xFFFFFFFF).toString(16).padStart(8,'0')}`;
    return part;
  });

  console.log(line, ...parts);
}

// Fake Tor nodes / fingerprints
const fakeNodes = [
  'A1B2C3D4E5F67890123456789ABCDEF123456789',
  'FEDCBA9876543210FEDCBA9876543210FEDCBA98',
  '1337DEAD1337BEEF1337DEAD1337BEEF1337DEAD',
  'E5F67890ABCDEF123456789A1B2C3D4E5F678901',
  'C0FFEEFACEC0FFEEFACEC0FFEEFACEC0FFEEFACE'
];

const randomNode = () => fakeNodes[Math.floor(Math.random() * fakeNodes.length)].slice(0, 8) + '..';

const randomPath = () => {
  const hops = Math.floor(Math.random() * 3) + 3; // 3–5 hops
  return Array(hops).fill(0).map(randomNode).join(' → ');
};

const fakeBlindedKey = () => 'blinded-' + Math.random().toString(36).slice(2, 14);

// Fake I2P tunnel / participant IDs
const fakeTunnelId = () => `tunnel-${Math.floor(Math.random() * 99999999)}`;
const fakeParticipant = () => `peer-${Math.random().toString(36).slice(2, 10)}..`;

// ────────────────────────────────────────────────
//         MOCK CHAOTIC BACKGROUND NOISE
// ────────────────────────────────────────────────
const fakeActivity = () => {
  const rand = Math.random();

  // Tor circuit realism
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

  // Onion service (HSv3) simulation
  else if (rand < 0.60) {
    const blinded = fakeBlindedKey();
    const roll = Math.random();
    if (roll < 0.25) chaosLog('ONION', `Generating new HSv3 descriptor → blinded pubkey ${blinded}`);
    else if (roll < 0.50) chaosLog('ONION', `Uploading HS descriptor to HSDir replica 1/2 → ${blinded} success`);
    else if (roll < 0.70) chaosLog('ONION', `Descriptor upload failed → HSDir unreachable blinded=${blinded.slice(0,12)}.. reason=timeout`);
    else if (roll < 0.85) chaosLog('ONION', `Publishing intro points → ${Math.floor(Math.random()*3)+2} points announced`);
    else chaosLog('ONION', `Rendezvous attempt → circuit established for client request`);
  }

  // I2P garlic / tunnel simulation
  else if (rand < 0.80) {
    const tunnel = fakeTunnelId();
    const roll = Math.random();
    if (roll < 0.30) chaosLog('I2P', `Building new outbound tunnel ${tunnel} → garlic routing active`);
    else if (roll < 0.55) chaosLog('I2P', `Inbound tunnel ${tunnel} established → ${Math.floor(Math.random()*4)+2} participants [${fakeParticipant()}, ...]`);
    else if (roll < 0.70) chaosLog('I2P', `Garlic message bundled → 3 cloves (leaseSet + delivery status + data)`);
    else if (roll < 0.85) chaosLog('I2P', `Tunnel ${tunnel} rotated → new exploratory tunnel created`);
    else chaosLog('I2P', `LeaseSet published → destination reachable via garlic encryption`);
  }

  // Other legacy noise (reduced probability to make room)
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
  chaosLog('SYS', 'Shadow threads spawned → anonymity layers active');
  chaosLog('TOR', 'Bootstrapped 100% (done): Tor circuit layer online');

  setInterval(() => {
    if (Math.random() < 0.82) fakeActivity();  // high activity density
  }, 700 + Math.random() * 2200);
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
    ║     SHADOW NODE v13.37       ║
    ║   TOR + I2P LAYERS ACTIVE    ║
    ║  TRACE LEVEL: ULTRA-PARANOID ║
    ╚══════════════════════════════╝
    
    External: ${req.hostname}
    Uptime: ${process.uptime()|0}s
    Active circuits/tunnels: ~${Math.floor(Math.random()*10)+3}
    Onion/I2P endpoints: simulated
    </pre>
  `);
});

app.get('/status', (req, res) => {
  chaosLog('ACCESS', `Probe detected from ${req.ip.split('.').slice(0,3).join('.')}.***`);
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
  res.status(404).send(`<pre style="color:#ff0044;background:black;font-family:monospace;">
    ╔══════════════════════╗
    ║     ACCESS DENIED    ║
    ║   TRACE TERMINATED   ║
    ╚══════════════════════╝</pre>`);
});

// Error handler
app.use((err, req, res, next) => {
  chaosLog('ERROR', err.message);
  if (Math.random() < 0.5) chaosLog('TOR', `Circuit ${Math.floor(Math.random()*999999)} DESTROYED reason=INTERNAL`);
  res.status(500).json({ status: 'fractured', reason: 'panic contained' });
});

// ────────────────────────────────────────────────
//                      LAUNCH
// ────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  chaosLog('SYS', `Node ${PORT} online → grid linked`);
  chaosLog('TOR', `Tor SOCKS5 proxy layer up → bootstrapping circuits`);
  chaosLog('ONION', `HSv3 service initialized → descriptor publishing started`);
  chaosLog('I2P', `Garlic router active → tunnel manager online`);
  chaosLog('TOR', `CIRCUIT 1 BUILT path=${randomPath()}`);

  startChaos();
});

process.on('SIGTERM', () => {
  chaosLog('SYS', 'SIGTERM caught → shredding memory...');
  chaosLog('TOR', 'Closing circuits...');
  chaosLog('I2P', 'Tearing down tunnels...');
  setTimeout(() => process.exit(0), 1400);
});