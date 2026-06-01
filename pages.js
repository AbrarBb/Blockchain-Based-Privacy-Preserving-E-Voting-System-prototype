window.PAGES = {};
function H(tag, cls, inner) { return '<' + tag + (cls ? ' class="' + cls + '"' : '') + '>' + (inner || '') + '</' + tag + '>'; }
function card(cls, inner) { return '<div class="card ' + (cls || '') + '">' + (inner || '') + '</div>'; }
function svgIcon(path) { return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"></path></svg>'; }
function breadcrumb(items) {
  return '<div class="breadcrumb">' + items.map((t, i) => i === items.length - 1 ? `<span>${t}</span>` : `<a href="#">${t}</a> ${svgIcon('M9 18l6-6-6-6')}`).join('') + '</div>';
}

// ===== METAMASK POPUP SIMULATION =====
window.showMetaMaskPopup = function (txDetails, onConfirm, onCancel) {
  const overlay = document.createElement('div');
  overlay.className = 'metamask-overlay';
  overlay.id = 'metamask-popup-overlay';

  const walletAddr = S.currentUser ? S.currentUser.wallet : '0x0000...0000';
  const truncAddr = walletAddr.length > 12 ? walletAddr.slice(0, 6) + '...' + walletAddr.slice(-4) : walletAddr;
  const contractAddr = '0x8f3E...1a9B';
  const networkFee = (Math.random() * 0.01 + 0.005).toFixed(4);

  overlay.innerHTML = `
    <div class="metamask-popup" id="metamask-popup">
      <div class="mm-header">
        <div class="mm-fox">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 4L19.5 12L21 6L30 4Z" fill="#E17726"/>
            <path d="M2 4L12.5 12L11 6L2 4Z" fill="#E17726"/>
            <path d="M26.5 22L23 27L29.5 29L31 22.5L26.5 22Z" fill="#E17726"/>
            <path d="M5.5 22L9 27L2.5 29L1 22.5L5.5 22Z" fill="#E17726"/>
            <path d="M9.5 14L8 17L14.5 17.5L14.3 10L9.5 14Z" fill="#E17726"/>
            <path d="M22.5 14L24 17L17.5 17.5L17.7 10L22.5 14Z" fill="#E17726"/>
            <path d="M10 27L14 25L10.5 22.5L10 27Z" fill="#E17726"/>
            <path d="M22 27L18 25L21.5 22.5L22 27Z" fill="#E17726"/>
            <path d="M18 25L16 29L14 25L16 24.5L18 25Z" fill="#D7C1B3"/>
            <path d="M10.5 22.5L14 25L16 24.5L18 25L21.5 22.5L16 19.5L10.5 22.5Z" fill="#233447"/>
            <path d="M26.5 22L21.5 22.5L16 19.5L22.5 14L26.5 22Z" fill="#CD6116"/>
            <path d="M5.5 22L10.5 22.5L16 19.5L9.5 14L5.5 22Z" fill="#CD6116"/>
            <path d="M9.5 14L16 19.5L22.5 14L17.7 10L14.3 10L9.5 14Z" fill="#E28743"/>
          </svg>
        </div>
        <span class="mm-title">MetaMask</span>
        <div class="mm-network">
          <span class="mm-network-dot"></span>
          Sepolia Testnet
        </div>
      </div>

      <div class="mm-account">
        <div class="mm-account-name">${S.currentUser ? S.currentUser.name : 'Account 1'}</div>
        <div class="mm-account-addr">${truncAddr}</div>
      </div>

      <div class="mm-tx-title">Transaction request</div>

      <div class="mm-details">
        <div class="mm-detail-row">
          <span class="mm-detail-label">Request from <span class="mm-info-icon">ⓘ</span></span>
          <span class="mm-detail-value"><span class="mm-http-badge" style="background:#10b981">HTTPS</span> secure-voting.gov</span>
        </div>
        <div class="mm-detail-row">
          <span class="mm-detail-label">Interacting with <span class="mm-info-icon">ⓘ</span></span>
          <span class="mm-detail-value"><span class="mm-contract-icon">📄</span> ${contractAddr}</span>
        </div>
        <div class="mm-detail-row">
          <span class="mm-detail-label">Method</span>
          <span class="mm-detail-value mm-method">${txDetails.method || 'castVote(uint256)'}</span>
        </div>
        <div class="mm-detail-row mm-fee-row">
          <span class="mm-detail-label">Network fee <span class="mm-info-icon">ⓘ</span></span>
          <span class="mm-detail-value mm-fee">
            <span class="mm-eth-icon">◆</span> ${networkFee} ETH
          </span>
        </div>
        <div class="mm-detail-row">
          <span class="mm-detail-label">Speed</span>
          <span class="mm-detail-value mm-speed">⚡ Fast</span>
        </div>
      </div>

      <div class="mm-actions">
        <button class="mm-btn mm-btn-cancel" id="mm-cancel-btn">Cancel</button>
        <button class="mm-btn mm-btn-confirm" id="mm-confirm-btn">Confirm</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add('mm-visible');
  });

  document.getElementById('mm-confirm-btn').addEventListener('click', function () {
    overlay.classList.remove('mm-visible');
    setTimeout(() => {
      overlay.remove();
      if (onConfirm) onConfirm();
    }, 300);
  });

  document.getElementById('mm-cancel-btn').addEventListener('click', function () {
    overlay.classList.remove('mm-visible');
    setTimeout(() => {
      overlay.remove();
      if (onCancel) onCancel();
    }, 300);
  });
};

// ===== DOUBLE VOTE PREVENTION =====
window.showDoubleVoteWarning = function () {
  showModal(`
    <div class="text-center">
      <div class="double-vote-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      <h2 style="color:var(--red); margin-bottom:12px">Vote Already Cast</h2>
      <p style="margin-bottom:8px">Your wallet <strong class="mono">${S.currentUser.wallet}</strong> has already submitted a cryptographic ballot for this election.</p>
      <p style="margin-bottom:24px; color:var(--text-muted); font-size:0.9rem">The nullifier associated with your identity has been recorded on-chain. Duplicate votes are rejected by the smart contract to preserve election integrity.</p>
      <div class="card" style="background:var(--red-bg); border-color:var(--red); padding:16px; margin-bottom:24px; text-align:left">
        <div style="font-weight:700; color:var(--red); margin-bottom:8px">⚠ Smart Contract Rejection</div>
        <code style="font-size:0.85rem; color:var(--text-muted)">Error: NULLIFIER_ALREADY_USED<br>Revert reason: "Voter has already cast a ballot"</code>
      </div>
      <button class="btn btn-outline" onclick="hideModal()" style="width:100%">Understood</button>
    </div>
  `);
};

// ===== MERKLE TREE HELPERS =====
function sha256Mock(input) {
  // Simulated hash
  let hash = '0x';
  let seed = 0;
  for (let i = 0; i < input.length; i++) seed += input.charCodeAt(i) * (i + 1);
  for (let i = 0; i < 64; i++) {
    seed = (seed * 16807 + 12345) % 2147483647;
    hash += '0123456789abcdef'[seed % 16];
  }
  return hash;
}

function buildMerkleTree(leaves) {
  if (leaves.length === 0) return { levels: [[]], root: '0x0' };

  let levels = [leaves.map(l => sha256Mock(l))];

  while (levels[levels.length - 1].length > 1) {
    const prev = levels[levels.length - 1];
    const next = [];
    for (let i = 0; i < prev.length; i += 2) {
      if (i + 1 < prev.length) {
        next.push(sha256Mock(prev[i] + prev[i + 1]));
      } else {
        next.push(prev[i]); // odd node promoted
      }
    }
    levels.push(next);
  }

  return { levels, root: levels[levels.length - 1][0] };
}

// ===== AVATAR GENERATOR =====
function candidateAvatar(name, size, colors) {
  const initial = name.charAt(0).toUpperCase();
  const colorPairs = [
    ['#6366F1', '#818CF8'], // Indigo
    ['#0EA5E9', '#38BDF8'], // Sky
    ['#8B5CF6', '#A78BFA'], // Violet
    ['#EC4899', '#F472B6'], // Pink
    ['#10B981', '#34D399'], // Emerald
    ['#F59E0B', '#FBBF24'], // Amber
  ];
  const pair = colors || colorPairs[name.length % colorPairs.length];

  return `<div class="candidate-avatar" style="width:${size || 120}px;height:${size || 120}px;background:linear-gradient(135deg,${pair[0]},${pair[1]});border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:${(size || 120) * 0.4}px;font-weight:800;color:#fff;text-transform:uppercase;box-shadow:0 8px 24px ${pair[0]}44;letter-spacing:-1px">
    ${initial}
  </div>`;
}

// ===== LANDING =====
PAGES.landing = function () {
  var features = [
    [svgIcon('M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'), 'Blockchain Secured', 'Votes stored on an immutable distributed ledger.'],
    [svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'), 'Zero-Knowledge Proofs', 'Prove eligibility without revealing your identity.'],
    [svgIcon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75'), 'Role-Based Access', 'Granular permissions for Officials, Auditors, and Admins.']
  ];
  return '<div class="page"><section class="hero"><div class="container">' +
    H('div', 'hero-badge', H('span', 'badge badge-primary', svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') + ' Next-Gen E-Voting Infrastructure')) +
    H('h1', '', 'Secure Public E-Voting System') +
    H('p', 'hero-sub', 'End-to-end verifiable elections powered by Ethereum Smart Contracts and Zero-Knowledge Proofs. Explore the system as a Voter, Official, Admin, or Auditor.') +
    H('div', 'hero-actions', '<button class="btn btn-lg btn-primary" onclick="navigate(\'login\')">Access System Portal</button><button class="btn btn-lg btn-outline" onclick="navigate(\'security\')">Learn How It Works</button>') +
    '</div></section>' +
    '<section class="section"><div class="container">' +
    H('div', 'features-grid', features.map(function (f) { return card('feature-card', H('div', 'feature-icon', f[0]) + H('h3', '', f[1]) + H('p', '', f[2])); }).join('')) +
    '</div></section></div>';
};

// ===== LOGIN (REALISTIC PORTAL) =====
PAGES.login = function () {
  if (S.currentUser) return '<div class="page section text-center">Already logged in.</div>';

  return '<div class="page wallet-page"><div class="login-portal">' +
    H('div', 'portal-header',
      H('div', 'portal-icon', svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')) +
      H('h2', '', 'Electoral Commission Portal') +
      H('p', '', 'Authenticate to access the voting infrastructure.')
    ) +
    '<div class="form-group">' +
    '<label class="form-label">National ID Number</label>' +
    '<input type="text" id="login-nid" class="form-input" placeholder="Enter your 12-digit National ID">' +
    '</div>' +
    '<button class="btn btn-primary" style="width:100%" onclick="handlePortalLogin()">Authenticate via Web3 / ID</button>' +
    H('div', 'wallet-divider', 'or') +
    '<button class="btn btn-outline" style="width:100%" onclick="navigate(\'register\')">Register as New Voter</button>' +
    '<p class="form-helper">Demo Hint: Type "admin", "official", or "auditor" as the ID. Any other text logs you in as a normal Voter.</p>' +
    '</div></div>';
};

window.handlePortalLogin = function () {
  const val = document.getElementById('login-nid').value.toLowerCase().trim();
  let roleId = 'u1'; // default to voter
  if (val === 'official') roleId = 'u2';
  if (val === 'admin') roleId = 'u3';
  if (val === 'auditor') roleId = 'u4';

  const m = document.getElementById('login-nid').value || '0x' + Math.random().toString(16).slice(2, 10);
  if (val !== 'official' && val !== 'admin' && val !== 'auditor') {
    // If it's a random voter, mock their name
    S.users[0].name = "Voter " + m.substring(0, 6);
    S.users[0].wallet = m;
  }

  // Show MetaMask popup for wallet connection
  showMetaMaskPopup(
    { method: 'eth_requestAccounts()' },
    function () {
      // On confirm - proceed to login
      login(roleId);
    },
    function () {
      // On cancel - stay on login page
    }
  );
};

// ===== VOTER DASHBOARD =====
PAGES.voter_dashboard = function () {
  var activeHtml = S.elections.filter(e => e.phase === 'Voting').map(e => {
    // Check if user already voted
    const hasVoted = S.voterHistory && S.voterHistory[S.currentUser.id] && S.voterHistory[S.currentUser.id][e.id];
    return card('mb-4', `
      <div class="flex justify-between items-center mb-2">
        <h3>${e.title}</h3>
        <span class="badge badge-green">Voting Open</span>
      </div>
      <p>Select your candidate using a zero-knowledge proof to maintain your anonymity. The cryptographic ballot is processed on-chain.</p>
      ${hasVoted
        ? `<div class="voted-badge mt-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"></path></svg> Ballot Already Submitted <span class="mono" style="font-size:0.8rem; margin-left:8px">TX: ${S.voterHistory[S.currentUser.id][e.id].txHash.slice(0, 16)}...</span></div>`
        : `<button class="btn btn-primary mt-2" onclick="navigate('voter_vote?id=${e.id}')">Cast Cryptographic Ballot</button>`
      }
    `)
  }).join('') || '<p>No active elections currently scheduled.</p>';

  var upcomingHtml = S.elections.filter(e => e.phase !== 'Voting' && e.phase !== 'Completed').map(e =>
    card('mb-4', `
      <div class="flex justify-between items-center mb-2">
        <h4>${e.title}</h4>
        <span class="badge badge-primary">${e.phase}</span>
      </div>
    `)
  ).join('');

  return '<div class="dashboard-layout page">' +
    renderSidebar('voter') +
    '<div class="dashboard-content">' +
    breadcrumb(['Home', 'Voter Dashboard']) +
    H('h2', 'mb-4', 'Electoral Services Dashboard') +
    card('mb-4', `<div class="flex justify-between items-center"><div><h3>Voter Registration Profile</h3><p class="mono mt-2" style="color:var(--text-muted)">Public Key: ${S.currentUser.wallet}<br>Electoral District: 12-B</p></div><span class="badge badge-green">Verified & Eligible</span></div>`) +
    H('h3', 'mb-2 mt-4', 'Active Electoral Events') + activeHtml +
    H('h3', 'mb-2 mt-4', 'Upcoming Elections') + upcomingHtml +
    '</div></div>';
};

// ===== VOTER VOTE (WIZARD FLOW) =====
PAGES.voter_vote = function () {
  var elId = parseInt(location.hash.split('?id=')[1] || 1);
  var e = S.elections.find(x => x.id === elId);
  if (!e) return '<div class="page section text-center">Election not found.</div>';

  // CHECK DOUBLE VOTE
  if (S.voterHistory && S.voterHistory[S.currentUser.id] && S.voterHistory[S.currentUser.id][e.id]) {
    setTimeout(() => showDoubleVoteWarning(), 300);
    return '<div class="dashboard-layout page">' +
      renderSidebar('voter') +
      '<div class="dashboard-content">' +
      breadcrumb(['Home', 'Voter Dashboard', 'Cast Ballot']) +
      '<div class="text-center" style="padding:80px 0">' +
      '<div style="color:var(--red);margin-bottom:16px">' + svgIcon('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z') + '</div>' +
      '<h2 style="margin-bottom:12px">Ballot Already Submitted</h2>' +
      '<p>You have already voted in this election. Each voter can only submit one ballot.</p>' +
      '<button class="btn btn-outline mt-4" onclick="navigate(\'voter_dashboard\')">Back to Dashboard</button>' +
      '</div>' +
      '</div></div>';
  }

  var cards = e.candidates.map(c => card('candidate-card',
    H('div', 'candidate-avatar-wrap', candidateAvatar(c.name, 100)) +
    H('div', 'candidate-content',
      H('div', 'candidate-name', c.name) + H('div', 'candidate-party badge badge-primary', c.party) +
      H('p', 'candidate-bio', c.bio) +
      `<button class="btn btn-primary vote-btn" onclick="reviewVote(${e.id}, ${c.id})">Select Candidate</button>`)
  )).join('');

  return '<div class="dashboard-layout page" id="wizard-container">' +
    renderSidebar('voter') +
    '<div class="dashboard-content">' +
    breadcrumb(['Home', 'Voter Dashboard', 'Cast Ballot']) +
    H('div', 'progress-bar', `<div class="progress-step active"></div><div class="progress-step"></div><div class="progress-step"></div>`) +
    H('h2', 'mb-2', 'Step 1: Select Candidate') +
    H('p', 'mb-4', 'Choose your preferred candidate for the <strong>' + e.title + '</strong>. Your choice will be encrypted locally.') +
    H('div', 'candidates-grid', cards) +
    '</div></div>';
};

window.reviewVote = function (electionId, candidateId) {
  var e = S.elections.find(x => x.id === electionId);
  var c = e.candidates.find(x => x.id === candidateId);

  const html = `
    <div class="dashboard-content">
      ${breadcrumb(['Home', 'Voter Dashboard', 'Review Ballot'])}
      <div class="progress-bar"><div class="progress-step done"></div><div class="progress-step active"></div><div class="progress-step"></div></div>
      <h2 class="mb-2">Step 2: Review Official Ballot</h2>
      <p class="mb-4">Please verify your selection. Once the cryptographic proof is generated, this action cannot be undone.</p>
      
      <div class="card mb-4" style="border: 2px solid var(--secondary); background: var(--primary-light)">
        <h3 class="mb-2 text-center" style="color:var(--primary)">Official Selection</h3>
        <div class="flex items-center gap-2 justify-center">
          ${candidateAvatar(c.name, 64)}
          <div style="margin-left:16px">
            <div style="font-size:1.5rem; font-weight:800; color:var(--text)">${c.name}</div>
            <div style="color:var(--primary); font-weight:600">${c.party}</div>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2 justify-center mt-4">
        <button class="btn btn-outline" onclick="navigate('voter_vote?id=${electionId}')">Change Selection</button>
        <button class="btn btn-primary" onclick="generateZKP(${electionId}, ${candidateId})">Generate Proof & Submit</button>
      </div>
    </div>
  `;
  document.getElementById('wizard-container').innerHTML = renderSidebar('voter') + html;
};

window.generateZKP = function (electionId, candidateId) {
  var e = S.elections.find(x => x.id === electionId);
  var c = e.candidates.find(x => x.id === candidateId);

  const html = `
    <div class="dashboard-content">
      ${breadcrumb(['Home', 'Voter Dashboard', 'Processing...'])}
      <div class="progress-bar"><div class="progress-step done"></div><div class="progress-step done"></div><div class="progress-step active"></div></div>
      <h2 class="mb-2 text-center">Step 3: Cryptographic Processing</h2>
      <p class="mb-4 text-center">Your browser is generating a Zero-Knowledge Proof (Groth16) to verify your eligibility without revealing your identity.</p>
      
      <div class="card text-center mb-4">
        <div style="color:var(--primary); margin-bottom:16px">${svgIcon('M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83')}</div>
        <h3 id="zkp-status">Generating Witness...</h3>
        <p class="mono mt-2" id="zkp-log" style="color:var(--text-muted)">Compiling circuit constraints</p>
      </div>
    </div>
  `;
  document.getElementById('wizard-container').innerHTML = renderSidebar('voter') + html;

  setTimeout(() => {
    document.getElementById('zkp-status').innerText = 'Computing Proof...';
    document.getElementById('zkp-log').innerText = 'Evaluating pairing functions: e(g1, g2) = e(a, b)';
  }, 1500);

  setTimeout(() => {
    document.getElementById('zkp-status').innerText = 'Awaiting Wallet Confirmation...';
    document.getElementById('zkp-log').innerText = 'Requesting MetaMask transaction signature';
  }, 3000);

  setTimeout(() => {
    // Show MetaMask popup for transaction confirmation
    showMetaMaskPopup(
      { method: 'castVote(uint256)' },
      function () {
        // On confirm - process vote
        document.getElementById('zkp-status').innerText = 'Submitting Transaction...';
        document.getElementById('zkp-log').innerText = 'Broadcasting payload to ElectionManager.sol';

        setTimeout(() => {
          c.votes++;
          const nullifier = '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
          const txHash = '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
          const blockNum = 18443000 + Math.floor(Math.random() * 1000);
          e.votes.push({ nullifier: nullifier, time: Date.now(), txHash: txHash, voter: S.currentUser.wallet, block: blockNum });
          S.logs.push({ time: Date.now(), user: S.currentUser.wallet, action: `Cast Vote via ZKP in Election #${electionId}` });

          // Record in voter history to prevent double voting
          if (!S.voterHistory) S.voterHistory = {};
          if (!S.voterHistory[S.currentUser.id]) S.voterHistory[S.currentUser.id] = {};
          S.voterHistory[S.currentUser.id][electionId] = { txHash, nullifier, time: Date.now(), block: blockNum };

          navigate(`voter_receipt?tx=${txHash}&el=${electionId}`);
        }, 1500);
      },
      function () {
        // On cancel - go back to vote selection
        document.getElementById('zkp-status').innerText = 'Transaction Rejected';
        document.getElementById('zkp-log').innerText = 'User denied transaction in MetaMask';
        document.getElementById('zkp-status').style.color = 'var(--red)';
        setTimeout(() => navigate('voter_vote?id=' + electionId), 2000);
      }
    );
  }, 3500);
};

// ===== VOTER RECEIPT =====
PAGES.voter_receipt = function () {
  const params = new URLSearchParams(location.hash.split('?')[1]);
  const txHash = params.get('tx');
  const elId = params.get('el');
  var e = S.elections.find(x => x.id === parseInt(elId));

  return '<div class="dashboard-layout page">' +
    renderSidebar('voter') +
    '<div class="dashboard-content">' +
    breadcrumb(['Home', 'Voter Dashboard', 'Cryptographic Receipt']) +
    '<div class="receipt-card">' +
    '<div class="receipt-header">' +
    '<div class="receipt-logo">' + svgIcon('M9 12l2 2 4-4 m6 2a9 9 0 11-18 0 9 9 0 0118 0z') + '</div>' +
    '<h2>Official Ballot Receipt</h2>' +
    '<p>Your vote has been securely recorded on the blockchain.</p>' +
    '</div>' +
    '<div class="qr-placeholder"><img src="https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=' + encodeURIComponent(txHash) + '" alt="Transaction QR" style="width:100%; height:100%; display:block; border-radius:2px;" /></div>' +
    '<div class="receipt-meta">' +
    '<div class="meta-item"><span class="meta-label">Election</span><span class="meta-val">' + (e ? e.title : 'Unknown') + '</span></div>' +
    '<div class="meta-item"><span class="meta-label">Timestamp</span><span class="meta-val">' + new Date().toLocaleString() + '</span></div>' +
    '<div class="meta-item"><span class="meta-label">Transaction Hash</span><span class="meta-val">' + txHash.slice(0, 20) + '...' + txHash.slice(-6) + '</span></div>' +
    '<div class="meta-item"><span class="meta-label">Block Height</span><span class="meta-val">18,443,' + Math.floor(Math.random() * 1000) + '</span></div>' +
    '</div>' +
    '<button class="btn btn-outline" onclick="window.print()">Download PDF Receipt</button>' +
    '</div>' +
    '</div></div>';
};

// ===== ELECTION OFFICIAL DASHBOARD =====
window.stopVoting = function (elId) {
  const e = S.elections.find(x => x.id === elId);
  if (!e) return;
  showMetaMaskPopup(
    { method: 'endVoting(uint256)' },
    function () {
      e.phase = 'Completed';
      S.logs.push({ time: Date.now(), user: S.currentUser.wallet, action: `Ended Voting Phase for Election #${elId} (${e.title})` });
      route();
    }
  );
};

window.startVoting = function (elId) {
  const e = S.elections.find(x => x.id === elId);
  if (!e) return;
  showMetaMaskPopup(
    { method: 'startVoting(uint256)' },
    function () {
      e.phase = 'Voting';
      e.startTime = Date.now();
      e.endTime = Date.now() + 86400000;
      S.logs.push({ time: Date.now(), user: S.currentUser.wallet, action: `Started Voting Phase for Election #${elId} (${e.title})` });
      route();
    }
  );
};

window.showAddCandidateModal = function (elId) {
  showModal(`
    <div style="padding:8px">
      <h3 class="mb-4">➕ Add New Candidate</h3>
      <div class="form-group mb-2">
        <label class="form-label">Full Name</label>
        <input type="text" id="new-cand-name" class="form-input" placeholder="e.g. Sarah Connor">
      </div>
      <div class="form-group mb-2">
        <label class="form-label">Political Party</label>
        <input type="text" id="new-cand-party" class="form-input" placeholder="e.g. Liberty Union">
      </div>
      <div class="form-group mb-4">
        <label class="form-label">Candidate Biography</label>
        <textarea id="new-cand-bio" class="form-input" rows="3" placeholder="Policy statement or experience details..."></textarea>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline" onclick="hideModal()" style="flex:1">Cancel</button>
        <button class="btn btn-primary" onclick="submitCandidate(${elId})" style="flex:1">Add Candidate</button>
      </div>
    </div>
  `);
};

window.submitCandidate = function (elId) {
  const name = document.getElementById('new-cand-name').value.trim();
  const party = document.getElementById('new-cand-party').value.trim();
  const bio = document.getElementById('new-cand-bio').value.trim();

  if (!name || !party || !bio) {
    alert("Please fill all fields.");
    return;
  }

  const e = S.elections.find(x => x.id === elId);
  if (!e) return;

  showMetaMaskPopup(
    { method: 'registerCandidate(uint256,string,string)' },
    function () {
      const nextId = e.candidates.length > 0 ? Math.max(...e.candidates.map(c => c.id)) + 1 : 1;
      e.candidates.push({ id: nextId, name, party, bio, votes: 0 });
      S.logs.push({ time: Date.now(), user: S.currentUser.wallet, action: `Registered candidate ${name} (${party}) for Election #${elId}` });
      hideModal();
      route();
    }
  );
};

PAGES.official_dashboard = function () {
  var activeElections = S.elections.length;
  var totalVotes = S.elections.reduce((sum, e) => sum + e.candidates.reduce((s, c) => s + c.votes, 0), 0);
  var registeredVoters = 1450000;
  var turnoutPct = ((totalVotes / registeredVoters) * 100).toFixed(4);

  var eCards = S.elections.map(e => {
    var votes = e.candidates.reduce((s, c) => s + c.votes, 0);
    var pct = e.phase === 'Voting' ? ((votes / registeredVoters) * 100).toFixed(2) : (e.phase === 'Completed' ? ((votes / registeredVoters) * 100).toFixed(2) : 0);

    // Stepper HTML
    const phases = ['Registration', 'Voting', 'Completed'];
    const activeIdx = phases.indexOf(e.phase);
    const stepperHtml = `
      <div class="election-stepper mt-4 mb-4">
        ${phases.map((ph, idx) => {
      let stateClass = '';
      if (idx < activeIdx) stateClass = 'completed';
      else if (idx === activeIdx) stateClass = 'active';
      return `
            <div class="step-node ${stateClass}">
              <div class="step-dot">${idx + 1}</div>
              <div class="step-lbl">${ph}</div>
            </div>
          `;
    }).join('<div class="step-connector"></div>')}
      </div>
    `;

    // Action buttons based on active phase
    let actionsHtml = '';
    if (e.phase === 'Registration') {
      actionsHtml = `
        <div style="display:flex; gap:12px; margin-top:16px">
          <button class="btn btn-outline btn-sm" onclick="showAddCandidateModal(${e.id})">➕ Add Candidate</button>
          <button class="btn btn-primary btn-sm" onclick="startVoting(${e.id})">⚡ Start Voting Phase</button>
        </div>
      `;
    } else if (e.phase === 'Voting') {
      actionsHtml = `
        <div style="display:flex; gap:12px; margin-top:16px">
          <button class="btn btn-red btn-sm" onclick="stopVoting(${e.id})">🛑 Stop Election & Lock Ballots</button>
        </div>
      `;
    } else {
      actionsHtml = `
        <div style="display:flex; gap:12px; margin-top:16px">
          <span class="badge badge-green" style="padding:6px 16px; border-radius:99px; font-weight:700">✓ Ballots Finalized & Sealed</span>
        </div>
      `;
    }

    // Candidate breakdown bar charts
    let candidatesListHtml = '';
    if (e.candidates.length > 0) {
      candidatesListHtml = `
        <div class="candidate-standings-section mt-4">
          <h4 class="mb-2 text-sm text-muted">Candidates Tally Breakdown</h4>
          <div style="display:flex; flex-direction:column; gap:10px">
            ${e.candidates.map(c => {
        const cPct = votes > 0 ? ((c.votes / votes) * 100).toFixed(1) : 0;
        return `
                <div class="mini-candidate-row">
                  ${candidateAvatar(c.name, 28)}
                  <div style="flex:1; min-width:0">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; margin-bottom:4px">
                      <span class="truncate">${c.name} (${c.party})</span>
                      <span>${cPct}% (${c.votes.toLocaleString()})</span>
                    </div>
                    <div class="mini-bar-track"><div class="mini-bar-fill" style="width:${cPct}%"></div></div>
                  </div>
                </div>
              `;
      }).join('')}
          </div>
        </div>
      `;
    } else {
      candidatesListHtml = `<p class="text-muted text-sm mt-4">No candidates registered for this event yet.</p>`;
    }

    return card('mb-4', `
      <div class="flex justify-between items-start mb-2">
        <div>
          <strong style="font-size:1.15rem">${e.title}</strong><br>
          <span class="text-muted text-sm">Contract ID: #${e.id} | Candidates Registered: ${e.candidates.length}</span>
        </div>
        <span class="badge ${e.phase === 'Voting' ? 'badge-green' : (e.phase === 'Registration' ? 'badge-primary' : 'badge-red')}" style="padding:4px 10px; font-size:0.75rem">${e.phase}</span>
      </div>
      ${stepperHtml}
      ${candidatesListHtml}
      ${actionsHtml}
    `);
  }).join('');

  return '<div class="dashboard-layout page">' +
    renderSidebar('official') +
    '<div class="dashboard-content">' +
    breadcrumb(['Home', 'Official Console']) +
    H('h2', 'mb-4', 'Electoral Commission Console') +
    H('div', 'admin-grid mb-4',
      card('admin-metric', H('div', 'metric-val', activeElections) + H('div', 'metric-label', 'Electoral Contracts')) +
      card('admin-metric', H('div', 'metric-val', totalVotes.toLocaleString()) + H('div', 'metric-label', 'Ledger Receipts')) +
      card('admin-metric', H('div', 'metric-val', turnoutPct + '%') + H('div', 'metric-trend', '+3.12% vs last hour') + H('div', 'metric-label', 'Global Turnout Rate'))
    ) +
    H('div', 'flex justify-between items-center mb-4', H('h3', '', 'System Governance Events') + '<button class="btn btn-primary" onclick="alert(\'Create Election Feature: Use standard deployment triggers\')">+ Deploy New Election</button>') +
    eCards +
    '</div></div>';
};

// ===== SUPER ADMIN DASHBOARD =====
PAGES.admin_dashboard = function () {
  var uRows = S.users.map(u => `<tr><td>${u.name}</td><td><span class="badge badge-primary">${u.role}</span></td><td class="mono">${u.wallet}</td><td><span class="badge badge-green">${u.status}</span></td></tr>`).join('');

  return '<div class="dashboard-layout page">' +
    renderSidebar('admin') +
    '<div class="dashboard-content">' +
    breadcrumb(['Home', 'System Administration']) +
    H('h2', 'mb-4', 'System Node Administration') +
    card('mb-4', `
        <h3 class="mb-2">Network Health</h3>
        <div class="grid-2 mb-4">
          <div class="metric-bar-container">
            <div class="metric-bar-header"><span>Smart Contract Memory Usage</span><span>42%</span></div>
            <div class="metric-bar-track"><div class="metric-bar-fill" style="width:42%"></div></div>
          </div>
          <div class="metric-bar-container">
            <div class="metric-bar-header"><span>RPC Node Latency</span><span>24ms</span></div>
            <div class="metric-bar-track"><div class="metric-bar-fill" style="width:10%; background:var(--green)"></div></div>
          </div>
        </div>
      `) +
    card('mb-4', `
        <h3 class="mb-2">System Users & Roles</h3>
        <table class="data-table"><thead><tr><th>Name</th><th>Role</th><th>Public Key</th><th>Status</th></tr></thead><tbody>${uRows}</tbody></table>
      `) +
    '</div></div>';
};

// ===== AUDITOR DASHBOARD (Logs & Explorer) =====
window.handleLogSearch = function (val) {
  const query = val.toLowerCase().trim();
  const rows = document.querySelectorAll('#audit-log-tbody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
};

window.runIntegrityScan = function () {
  const panel = document.getElementById('integrity-results');
  if (!panel) return;

  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="integrity-scanner-active" style="padding:20px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-lg)">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px">
        <span class="live-pulse" style="background:var(--secondary); box-shadow:0 0 8px var(--secondary); margin-right:0"></span>
        <strong>Cryptographic Ledger & Witness Integrity Verification in progress...</strong>
      </div>
      <div id="integrity-steps" class="mono" style="display:flex; flex-direction:column; gap:12px; font-size:0.85rem"></div>
    </div>
  `;

  const steps = [
    { text: "Reading blockchain headers and checking block sequence consistency...", delay: 600 },
    { text: "Scanning state database for duplicate voter nullifiers...", delay: 1300 },
    { text: "Validating Merkle Tree leaf hashes against historical voter receipts...", delay: 2000 },
    { text: "Checking ZK-Snarks (Groth16 pairing equation pairings e(g1, g2)) on-chain...", delay: 2800 },
    { text: "SUCCESS: Ledger integrity verified! Rebuilt Merkle Root matches stored on-chain root precisely ✓", delay: 3600, success: true }
  ];

  const stepContainer = document.getElementById('integrity-steps');

  steps.forEach(step => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.gap = '10px';
      el.className = 'live-feed-item';
      if (step.success) {
        el.innerHTML = `<span style="color:var(--green); font-weight:bold; font-size:1.1rem">✓</span> <span style="color:var(--green); font-weight:700">${step.text}</span>`;
      } else {
        el.innerHTML = `<span style="color:var(--secondary); font-weight:bold">●</span> <span style="color:var(--text-muted)">${step.text}</span>`;
      }
      stepContainer.appendChild(el);

      if (step.success) {
        // Log auditing action in official records
        S.logs.push({ time: Date.now(), user: S.currentUser.wallet, action: "Executed Cryptographic Database Integrity Audit (Status: Pass)" });
      }
    }, step.delay);
  });
};

PAGES.auditor_dashboard = function () {
  var logRows = S.logs.slice().reverse().map(l => `
    <tr>
      <td class="mono text-muted" style="font-size:0.8rem">${new Date(l.time).toLocaleString()}</td>
      <td class="mono text-sm" style="color:var(--secondary)">${l.user}</td>
      <td style="font-size:0.85rem; font-weight:500">${l.action}</td>
    </tr>
  `).join('');

  let nullifierRows = [];
  S.elections.forEach(e => {
    e.votes.forEach(v => {
      nullifierRows.push(`
        <tr>
          <td class="mono text-sm" style="color:var(--green)">${v.nullifier.slice(0, 10)}...${v.nullifier.slice(-4)}</td>
          <td class="mono text-sm" style="color:var(--secondary)">${v.txHash.slice(0, 10)}...${v.txHash.slice(-4)}</td>
          <td class="mono text-sm">#${v.block}</td>
          <td><span class="badge badge-green" style="font-size:0.7rem; padding:4px 10px; white-space:nowrap">Verified On-Chain</span></td>
        </tr>
      `);
    });
  });
  if (nullifierRows.length === 0) {
    nullifierRows.push(`<tr><td colspan="4" class="text-center text-muted" style="padding:16px; font-size:0.85rem">No voter receipts loaded on-chain.</td></tr>`);
  }

  // Beautiful SVG Chart showing voting activity over past 6 hours
  const activityChart = `
    <div class="activity-chart-container" style="padding:16px 8px">
      <svg viewBox="0 0 500 150" class="activity-svg" style="width:100%; height:130px; overflow:visible">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--secondary)" stop-opacity="0.3"></stop>
            <stop offset="100%" stop-color="var(--secondary)" stop-opacity="0.0"></stop>
          </linearGradient>
        </defs>
        <!-- Gridlines -->
        <line x1="50" y1="20" x2="480" y2="20" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3,3" />
        <line x1="50" y1="60" x2="480" y2="60" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3,3" />
        <line x1="50" y1="100" x2="480" y2="100" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="3,3" />
        <line x1="50" y1="130" x2="480" y2="130" stroke="var(--border)" stroke-width="1" />
        
        <!-- Y-Axis Labels -->
        <text x="35" y="24" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="end">120 TXs</text>
        <text x="35" y="64" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="end">60 TXs</text>
        <text x="35" y="104" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="end">20 TXs</text>
        <text x="35" y="134" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="end">0</text>
        
        <!-- Area / Path -->
        <path d="M50,130 L50,120 L120,110 L190,60 L260,95 L330,45 L400,25 L470,120 L470,130 Z" fill="url(#chart-grad)" />
        <path d="M50,120 L120,110 L190,60 L260,95 L330,45 L400,25 L470,120" fill="none" stroke="var(--secondary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Data Dots -->
        <circle cx="50" cy="120" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="120" cy="110" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="190" cy="60" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="260" cy="95" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="330" cy="45" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="400" cy="25" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        <circle cx="470" cy="120" r="4" fill="var(--bg-surface)" stroke="var(--secondary)" stroke-width="2" />
        
        <!-- X-Axis Labels -->
        <text x="50" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">-6h</text>
        <text x="120" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">-5h</text>
        <text x="190" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">-4h</text>
        <text x="260" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">-3h</text>
        <text x="330" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">-2h</text>
        <text x="400" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">-1h</text>
        <text x="470" y="145" fill="var(--text-muted)" font-size="8" font-weight="600" text-anchor="middle">Live</text>
      </svg>
    </div>
  `;

  return '<div class="dashboard-layout page">' +
    renderSidebar('auditor') +
    '<div class="dashboard-content">' +
    breadcrumb(['Home', 'Audit Console']) +
    H('h2', 'mb-4', 'Electoral Integrity & Audit Console') +
    H('p', 'mb-4', 'Immutable, read-only record of election logs, nullifier proofs, and real-time ledger health status.') +

    // Anomaly Detection Grid
    H('div', 'stats-grid mb-4',
      card('stat-box', H('div', 'val', '0') + H('div', 'lbl', 'Failed ZKP Constraints')) +
      card('stat-box', H('div', 'val', '0') + H('div', 'lbl', 'Duplicate Nullifiers')) +
      card('stat-box', H('div', 'val', '0') + H('div', 'lbl', 'Sequence Gaps')) +
      card('stat-box', H('div', 'val', '100.00%') + H('div', 'lbl', 'Cryptographic Trust Index'))
    ) +

    // Live Integrity Scanner Button & Dynamic Panel
    card('mb-4', `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px">
          <div>
            <h3 class="mb-1"> Cryptographic Database Integrity Audit</h3>
            <p class="text-sm text-muted">Verify the blockchain database consistency, state nullifiers, and active pairing constraints.</p>
          </div>
          <button class="btn btn-primary" onclick="runIntegrityScan()">Run Integrity Verification</button>
        </div>
        <div id="integrity-results" class="mt-4" style="display:none"></div>
      `) +

    // Activity Chart & Nullifier Registry
    H('div', 'grid-2 mb-4',
      card('', H('h3', 'mb-2', ' Ledger Transaction Volume') + activityChart) +
      card('', H('h3', 'mb-2', ' On-Chain Nullifier Registry') + `
          <div style="overflow-y:auto; max-height:165px">
            <table class="data-table" style="font-size:0.8rem">
              <thead><tr><th>Nullifier Hash</th><th>Tx Hash</th><th>Block</th><th>Status</th></tr></thead>
              <tbody>${nullifierRows}</tbody>
            </table>
          </div>
        `)
    ) +

    // Logs with Search Filter
    card('', `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:16px">
          <h3> Immutable Event Audit Trail</h3>
          <input type="text" id="log-search-input" class="form-input" style="max-width:280px" placeholder="Search logs..." oninput="handleLogSearch(this.value)">
        </div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>Timestamp</th><th>Actor (Public Key)</th><th>Action</th></tr></thead>
            <tbody id="audit-log-tbody">${logRows}</tbody>
          </table>
        </div>
      `) +
    '</div></div>';
};

// ===== SECURITY PAGE =====
PAGES.security = function () {
  return '<div class="page"><div class="container section">' +
    H('div', 'section-header', H('span', 'badge badge-primary', 'Security Architecture') + H('h2', 'mt-2', 'How Your Vote Is Protected') + H('p', '', 'Understanding the cryptographic technologies that ensure secure, private, and verifiable elections.')) +
    H('div', 'info-grid mb-4',
      card('info-card', H('div', 'info-icon', svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')) + H('h3', '', 'Zero-Knowledge Proofs') + H('p', '', 'The Groth16 protocol generates a compact proof that verifies your eligibility and vote validity without revealing your identity or choice.')) +
      card('info-card', H('div', 'info-icon', svgIcon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z')) + H('h3', '', 'Smart Contract Logic') + H('p', '', 'All election rules are encoded in Solidity smart contracts. The contract automatically verifies proofs, checks nullifiers, and stores encrypted ballots.')) +
      card('info-card', H('div', 'info-icon', svgIcon('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z')) + H('h3', '', 'Nullifier System') + H('p', '', 'A unique cryptographic nullifier prevents double-voting while maintaining anonymity. If a nullifier is reused, the transaction is rejected.'))
    ) +
    '</div></div>';
};

// ===== KYC REGISTRATION WIZARD =====
PAGES.register = function () {
  return `<div class="page wallet-page" id="kyc-container">
    <div class="login-portal">
      <div class="portal-header">
        <div class="portal-icon">${svgIcon('M10 21h4v-2h-4v2zm2-17a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17h8v-1.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z')}</div>
        <h2>Voter Registration</h2>
        <p>Complete KYC Identity Verification</p>
      </div>
      <div class="form-group">
        <label class="form-label">Upload National ID</label>
        <div style="border:2px dashed var(--border); padding:32px; text-align:center; border-radius:var(--radius); cursor:pointer" onclick="startKYC()">
          <span style="color:var(--secondary); font-weight:600">Click to Upload Document</span>
        </div>
      </div>
    </div>
  </div>`;
};

window.startKYC = function () {
  const html = `
    <div class="login-portal text-center">
      <h2 class="mb-4">Biometric Scan</h2>
      <p class="mb-4 text-muted">Please look directly into your camera.</p>
      <div class="scanner-box"></div>
      <p class="mono text-muted" id="kyc-log">Initializing camera feed...</p>
    </div>
  `;
  document.getElementById('kyc-container').innerHTML = html;

  setTimeout(() => document.getElementById('kyc-log').innerText = 'Detecting facial geometry...', 1000);
  setTimeout(() => document.getElementById('kyc-log').innerText = 'Cross-referencing National Database...', 2500);
  setTimeout(() => {
    document.getElementById('kyc-container').innerHTML = `
      <div class="login-portal text-center">
        <div class="confirm-check" style="width:64px;height:64px;margin-bottom:16px">${svgIcon('M5 13l4 4L19 7')}</div>
        <h2>Identity Verified</h2>
        <p class="mb-4">Your cryptographic voting wallet has been provisioned.</p>
        <button class="btn btn-primary" style="width:100%" onclick="login('u1')">Access Voter Dashboard</button>
      </div>
    `;
  }, 4000);
};

// ===== EXPLORER (NETWORK DASHBOARD + TX SEARCH) =====
PAGES.explorer = function () {
  // Combine real votes with some mock transactions
  var txs = [];

  // Add real recorded votes
  S.elections.forEach(e => {
    e.votes.forEach(v => {
      txs.push({
        hash: v.txHash,
        block: v.block || (18443000 + Math.floor(Math.random() * 1000)),
        gas: 304659 + Math.floor(Math.random() * 200 - 100),
        time: new Date(v.time).toLocaleString(),
        type: 'Vote Cast',
        isReal: true
      });
    });
  });

  // Add mock transactions to fill
  for (var i = txs.length; i < 6; i++) {
    txs.push({
      hash: '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
      block: 18443000 + Math.floor(Math.random() * 1000),
      gas: 304659 + Math.floor(Math.random() * 200 - 100),
      time: 'Just now',
      type: 'ZKP Verify',
      isReal: false
    });
  }

  var rows = txs.map((t, i) => `<div class="tx-card ${i === 0 ? 'live-feed-item' : ''}" style="padding:16px">
    <div><div class="tx-hash">${t.hash.slice(0, 24)}...</div><div class="tx-meta">Block #${t.block}</div></div>
    <div><div class="tx-meta">Gas: ${t.gas.toLocaleString()}</div><div class="tx-meta">${t.time}</div></div>
    <div><span class="tx-status verified">${t.type || 'Verified ZKP'}</span></div>
  </div>`).join('');

  return '<div class="page"><div class="container section">' +
    H('div', 'section-header', H('span', 'badge badge-primary', 'Global Infrastructure') + H('h2', 'mt-2', 'Network Health & Explorer') + H('p', '', 'Live monitoring of the distributed ledger infrastructure.')) +

    // Transaction Search Bar
    '<div class="tx-search-container mb-4">' +
    '<div class="card" style="padding:24px">' +
    '<h3 class="mb-2">🔍 Search Transaction / Verify Vote</h3>' +
    '<p style="margin-bottom:16px">Enter a transaction hash to verify if a vote has been recorded on the blockchain.</p>' +
    '<div class="tx-search-bar">' +
    '<input type="text" id="tx-search-input" class="form-input" placeholder="Enter transaction hash (0x...)" style="flex:1">' +
    '<button class="btn btn-primary" onclick="searchTransaction()">Search</button>' +
    '</div>' +
    '<div id="tx-search-result"></div>' +
    '</div>' +
    '</div>' +

    H('div', 'stats-grid',
      H('div', 'stat-box', H('div', 'val', '4,281') + H('div', 'lbl', 'Active Nodes')) +
      H('div', 'stat-box', H('div', 'val', '12 Gwei') + H('div', 'lbl', 'Current Gas Fee')) +
      H('div', 'stat-box', H('div', 'val', '1.2s') + H('div', 'lbl', 'Block Time')) +
      H('div', 'stat-box', H('div', 'val', '0') + H('div', 'lbl', 'Mempool TXs'))
    ) +
    H('div', 'grid-2 mb-4',
      card('', H('h3', 'mb-4', 'Global Node Distribution') +
        '<div class="node-map">' +
        // SVG World Map with continents and nodes
        '<svg class="world-map-svg" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">' +
        // Simplified continent outlines
        '<g class="continents" fill="none" stroke="var(--border)" stroke-width="1.5" opacity="0.6">' +
        // North America
        '<path d="M80,80 L120,60 L180,55 L220,70 L240,90 L230,120 L210,140 L190,160 L160,180 L130,190 L110,170 L90,150 L70,130 L60,110 Z" />' +
        // South America
        '<path d="M170,200 L200,190 L220,210 L230,240 L225,270 L210,300 L190,330 L170,340 L160,320 L155,290 L160,260 L155,230 Z" />' +
        // Europe
        '<path d="M350,60 L380,55 L410,60 L430,70 L440,90 L430,110 L410,120 L390,115 L370,105 L355,90 L345,75 Z" />' +
        // Africa
        '<path d="M370,130 L400,125 L430,140 L440,170 L435,210 L420,250 L400,280 L380,290 L360,270 L350,240 L355,200 L360,170 Z" />' +
        // Asia
        '<path d="M450,50 L500,40 L560,45 L620,55 L670,70 L700,90 L710,120 L690,150 L650,160 L600,155 L550,140 L500,130 L470,120 L450,100 L445,75 Z" />' +
        // Australia
        '<path d="M620,240 L660,230 L700,240 L720,260 L710,285 L680,295 L650,290 L630,275 L620,255 Z" />' +
        '</g>' +

        // Connection lines between nodes (animated)
        '<g class="node-connections" stroke="var(--secondary)" stroke-width="0.8" opacity="0.2" stroke-dasharray="4,4">' +
        '<line x1="140" y1="105" x2="380" y2="80"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="2s" repeatCount="indefinite"/></line>' +
        '<line x1="380" y1="80" x2="520" y2="75"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.8s" repeatCount="indefinite"/></line>' +
        '<line x1="520" y1="75" x2="660" y2="100"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="2.2s" repeatCount="indefinite"/></line>' +
        '<line x1="380" y1="80" x2="390" y2="180"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite"/></line>' +
        '<line x1="660" y1="100" x2="660" y2="255"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="2s" repeatCount="indefinite"/></line>' +
        '<line x1="140" y1="105" x2="180" y2="250"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.7s" repeatCount="indefinite"/></line>' +
        '<line x1="520" y1="75" x2="390" y2="80"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.6s" repeatCount="indefinite"/></line>' +
        '<line x1="250" y1="100" x2="380" y2="80"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="2.1s" repeatCount="indefinite"/></line>' +
        '<line x1="660" y1="100" x2="580" y2="130"><animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.9s" repeatCount="indefinite"/></line>' +
        '</g>' +

        // Node dots at real geographic positions
        // North America
        '<circle class="map-node mn-pulse" cx="140" cy="105" r="5" data-region="New York"><animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="100" cy="110" r="4" data-region="Chicago"><animate attributeName="r" values="4;6;4" dur="2.3s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="80" cy="95" r="4" data-region="San Francisco"><animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="250" cy="100" r="3" data-region="Miami"><animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/></circle>' +

        // Europe
        '<circle class="map-node mn-pulse" cx="380" cy="80" r="6" data-region="London"><animate attributeName="r" values="6;8;6" dur="2.1s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="400" cy="75" r="4" data-region="Frankfurt"><animate attributeName="r" values="4;6;4" dur="1.9s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="420" cy="85" r="3" data-region="Zurich"><animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite"/></circle>' +

        // Asia
        '<circle class="map-node mn-pulse" cx="520" cy="75" r="5" data-region="Mumbai"><animate attributeName="r" values="5;7;5" dur="2.2s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="580" cy="130" r="4" data-region="Singapore"><animate attributeName="r" values="4;6;4" dur="1.7s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="660" cy="100" r="5" data-region="Tokyo"><animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="620" cy="85" r="3" data-region="Seoul"><animate attributeName="r" values="3;5;3" dur="2.6s" repeatCount="indefinite"/></circle>' +

        // Africa
        '<circle class="map-node mn-pulse" cx="390" cy="180" r="3" data-region="Lagos"><animate attributeName="r" values="3;5;3" dur="2.3s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="410" cy="250" r="3" data-region="Cape Town"><animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite"/></circle>' +

        // South America
        '<circle class="map-node mn-pulse" cx="180" cy="250" r="4" data-region="São Paulo"><animate attributeName="r" values="4;6;4" dur="2.1s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="200" cy="220" r="3" data-region="Bogotá"><animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite"/></circle>' +

        // Australia
        '<circle class="map-node mn-pulse" cx="660" cy="255" r="4" data-region="Sydney"><animate attributeName="r" values="4;6;4" dur="1.9s" repeatCount="indefinite"/></circle>' +
        '<circle class="map-node mn-pulse" cx="640" cy="270" r="3" data-region="Melbourne"><animate attributeName="r" values="3;5;3" dur="2.2s" repeatCount="indefinite"/></circle>' +

        // Region labels
        '<g class="map-labels" fill="var(--text-muted)" font-size="9" font-family="Inter,system-ui,sans-serif" font-weight="600">' +
        '<text x="105" y="135">N. America</text>' +
        '<text x="155" y="300">S. America</text>' +
        '<text x="370" y="55">Europe</text>' +
        '<text x="355" y="300">Africa</text>' +
        '<text x="560" y="50">Asia-Pacific</text>' +
        '<text x="635" y="305">Oceania</text>' +
        '</g>' +
        '</svg>' +

        // Region legend
        '<div class="node-map-legend">' +
        '<div class="legend-item"><span class="legend-dot"></span><span>N. America</span><strong>1,248</strong></div>' +
        '<div class="legend-item"><span class="legend-dot"></span><span>Europe</span><strong>1,412</strong></div>' +
        '<div class="legend-item"><span class="legend-dot"></span><span>Asia-Pacific</span><strong>986</strong></div>' +
        '<div class="legend-item"><span class="legend-dot"></span><span>S. America</span><strong>312</strong></div>' +
        '<div class="legend-item"><span class="legend-dot"></span><span>Africa</span><strong>178</strong></div>' +
        '<div class="legend-item"><span class="legend-dot"></span><span>Oceania</span><strong>145</strong></div>' +
        '</div>' +

        // Live status bar
        '<div class="node-map-status">' +
        '<div class="nms-item"><span class="live-pulse" style="margin-right:4px"></span> 4,281 Active</div>' +
        '<div class="nms-item">Avg Latency: <strong style="color:var(--green)">24ms</strong></div>' +
        '<div class="nms-item">Consensus: <strong style="color:var(--green)">99.97%</strong></div>' +
        '</div>' +
        '</div>'
      ) +
      card('', H('h3', 'mb-4', '<span class="live-pulse"></span> Live Cryptographic Proofs') + '<div class="tx-list">' + rows + '</div>')
    ) +
    '</div></div>';
};

// ===== TX SEARCH FUNCTION =====
window.searchTransaction = function () {
  const input = document.getElementById('tx-search-input').value.trim();
  const resultDiv = document.getElementById('tx-search-result');

  if (!input) {
    resultDiv.innerHTML = '<div class="tx-search-error mt-2">Please enter a transaction hash to search.</div>';
    return;
  }

  // Search all elections for matching tx
  let foundVote = null;
  let foundElection = null;

  S.elections.forEach(e => {
    e.votes.forEach(v => {
      if (v.txHash === input || v.txHash.startsWith(input) || input.startsWith(v.txHash.slice(0, 10))) {
        foundVote = v;
        foundElection = e;
      }
    });
  });

  if (foundVote) {
    resultDiv.innerHTML = `
      <div class="tx-search-found mt-2">
        <div class="tx-found-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4 m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <strong>Vote Found & Verified ✓</strong>
        </div>
        <div class="tx-found-details">
          <div class="tx-found-row"><span>Transaction Hash</span><span class="mono">${foundVote.txHash.slice(0, 24)}...${foundVote.txHash.slice(-8)}</span></div>
          <div class="tx-found-row"><span>Election</span><span>${foundElection.title}</span></div>
          <div class="tx-found-row"><span>Block</span><span class="mono">#${foundVote.block || 'N/A'}</span></div>
          <div class="tx-found-row"><span>Timestamp</span><span>${new Date(foundVote.time).toLocaleString()}</span></div>
          <div class="tx-found-row"><span>Nullifier</span><span class="mono">${foundVote.nullifier.slice(0, 20)}...</span></div>
          <div class="tx-found-row"><span>Status</span><span class="badge badge-green">Confirmed</span></div>
        </div>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="tx-search-notfound mt-2">
        <div class="tx-found-header" style="color:var(--red)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <strong>Transaction Not Found</strong>
        </div>
        <p style="margin:12px 0 0; color:var(--text-muted)">No vote record matching this hash was found on the blockchain. The transaction may be invalid or not yet mined.</p>
      </div>
    `;
  }
};

// ===== MERKLE TREE PAGE =====
PAGES.merkle = function () {
  const e = S.elections[0];
  const voteLeaves = e.votes.length > 0
    ? e.votes.map(v => v.nullifier)
    : ['vote_alice_0x1a2b', 'vote_bob_0x3c4d', 'vote_carol_0x5e6f', 'vote_dave_0x7g8h'];

  const tree = buildMerkleTree(voteLeaves);

  // Build visual tree
  let treeHtml = '<div class="merkle-tree-visual">';

  // Render from root down
  for (let i = tree.levels.length - 1; i >= 0; i--) {
    const level = tree.levels[i];
    const levelLabel = i === tree.levels.length - 1 ? 'Root' : i === 0 ? 'Leaves (Vote Nullifiers)' : `Level ${i}`;

    treeHtml += `<div class="merkle-level">`;
    treeHtml += `<div class="merkle-level-label">${levelLabel}</div>`;
    treeHtml += `<div class="merkle-nodes">`;

    level.forEach((hash, j) => {
      const isRoot = i === tree.levels.length - 1;
      const isLeaf = i === 0;
      treeHtml += `
        <div class="merkle-node ${isRoot ? 'merkle-root' : ''} ${isLeaf ? 'merkle-leaf' : ''}">
          <div class="merkle-hash" title="${hash}">${hash.slice(0, 10)}...${hash.slice(-6)}</div>
        </div>
      `;
    });

    treeHtml += '</div></div>';

    // Add connectors between levels (except after last level)
    if (i > 0) {
      treeHtml += '<div class="merkle-connectors">';
      const parentCount = tree.levels[i].length;
      for (let p = 0; p < parentCount; p++) {
        treeHtml += '<div class="merkle-connector-pair">';
        treeHtml += '<div class="merkle-line"></div>';
        treeHtml += '</div>';
      }
      treeHtml += '</div>';
    }
  }

  treeHtml += '</div>';

  return '<div class="page"><div class="container section">' +
    H('div', 'section-header',
      H('span', 'badge badge-primary', 'Cryptographic Verification') +
      H('h2', 'mt-2', 'Merkle Tree Visualization') +
      H('p', '', 'The Merkle tree structure ensures every vote is cryptographically linked. Any tampering with a single vote changes the root hash, making fraud immediately detectable.')
    ) +

    // Merkle Root Display
    '<div class="merkle-root-display mb-4">' +
    '<div class="card" style="border:2px solid var(--primary); background:var(--primary-light); text-align:center; padding:32px">' +
    '<h3 style="color:var(--primary); margin-bottom:8px">Current Merkle Root</h3>' +
    '<div class="mono" style="font-size:1.1rem; word-break:break-all; color:var(--text); margin-bottom:12px">' + tree.root + '</div>' +
    '<div style="display:flex; gap:16px; justify-content:center; flex-wrap:wrap">' +
    '<span class="badge badge-green">Verified On-Chain</span>' +
    '<span class="badge badge-primary">' + voteLeaves.length + ' Votes in Tree</span>' +
    '<span class="badge" style="background:var(--bg);border-color:var(--border)">' + tree.levels.length + ' Levels Deep</span>' +
    '</div>' +
    '</div>' +
    '</div>' +

    // Tree Visualization
    card('mb-4', '<h3 class="mb-4">Tree Structure</h3>' + treeHtml) +

    // How it works
    '<div class="info-grid mb-4">' +
    card('info-card',
      H('div', 'info-icon', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>') +
      H('h3', '', 'Leaf Nodes') +
      H('p', '', 'Each vote\'s cryptographic nullifier becomes a leaf in the Merkle tree. These are hashed using SHA-256.')
    ) +
    card('info-card',
      H('div', 'info-icon', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>') +
      H('h3', '', 'Hash Propagation') +
      H('p', '', 'Pairs of hashes are combined and re-hashed up the tree. Each parent is the hash of its children.')
    ) +
    card('info-card',
      H('div', 'info-icon', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>') +
      H('h3', '', 'Root Integrity') +
      H('p', '', 'The single root hash is stored on-chain. If any vote is altered, the root changes — detecting tampering instantly.')
    ) +
    '</div>' +

    // Proof Verification Demo
    card('mb-4', `
      <h3 class="mb-2">Merkle Proof Verification Demo</h3>
      <p class="mb-4">Select a leaf node to see the Merkle proof (authentication path) required to verify its inclusion in the tree.</p>
      <div class="merkle-proof-demo">
        <select id="merkle-proof-select" class="form-input" onchange="showMerkleProof()" style="margin-bottom:16px">
          <option value="">Select a vote to verify...</option>
          ${voteLeaves.map((l, i) => `<option value="${i}">Vote #${i + 1} — ${sha256Mock(l).slice(0, 18)}...</option>`).join('')}
        </select>
        <div id="merkle-proof-output"></div>
      </div>
    `) +

    '</div></div>';
};

window.showMerkleProof = function () {
  const sel = document.getElementById('merkle-proof-select').value;
  const out = document.getElementById('merkle-proof-output');
  if (sel === '') { out.innerHTML = ''; return; }

  const e = S.elections[0];
  const voteLeaves = e.votes.length > 0
    ? e.votes.map(v => v.nullifier)
    : ['vote_alice_0x1a2b', 'vote_bob_0x3c4d', 'vote_carol_0x5e6f', 'vote_dave_0x7g8h'];

  const tree = buildMerkleTree(voteLeaves);
  const leafIdx = parseInt(sel);
  const leafHash = tree.levels[0][leafIdx];

  // Compute proof path
  let proofPath = [];
  let idx = leafIdx;
  for (let lvl = 0; lvl < tree.levels.length - 1; lvl++) {
    const level = tree.levels[lvl];
    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    if (siblingIdx < level.length) {
      proofPath.push({
        hash: level[siblingIdx],
        position: idx % 2 === 0 ? 'right' : 'left',
        level: lvl
      });
    }
    idx = Math.floor(idx / 2);
  }

  out.innerHTML = `
    <div class="merkle-proof-result">
      <div class="proof-item proof-leaf">
        <span class="proof-label">Leaf Hash</span>
        <span class="mono proof-hash">${leafHash.slice(0, 24)}...${leafHash.slice(-8)}</span>
      </div>
      <div class="proof-arrow">↓ Hash Path</div>
      ${proofPath.map((p, i) => `
        <div class="proof-item proof-sibling">
          <span class="proof-label">Sibling (${p.position})</span>
          <span class="mono proof-hash">${p.hash.slice(0, 24)}...${p.hash.slice(-8)}</span>
        </div>
        <div class="proof-arrow">↓ Combine & Hash</div>
      `).join('')}
      <div class="proof-item proof-root">
        <span class="proof-label">Merkle Root ✓</span>
        <span class="mono proof-hash">${tree.root.slice(0, 24)}...${tree.root.slice(-8)}</span>
      </div>
      <div class="proof-verdict">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4 m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        Proof Valid — Vote #${leafIdx + 1} is included in the Merkle tree
      </div>
    </div>
  `;
};

// ===== LIVE RESULTS DASHBOARD =====
PAGES.results = function () {
  var e = S.elections[0];
  if (!e) return '<div class="page section text-center">No active elections.</div>';

  var maxVotes = Math.max(...e.candidates.map(c => c.votes), 1);
  var totalVotes = e.candidates.reduce((sum, c) => sum + c.votes, 0);

  var bars = [...e.candidates].sort((a, b) => b.votes - a.votes).map(c => {
    var pct = ((c.votes / totalVotes) * 100).toFixed(1);
    var width = (c.votes / maxVotes) * 100;
    return `
      <div class="bar-row mb-4">
        <div class="bar-label" style="width:180px">
          <div style="display:flex;align-items:center;gap:12px">
            ${candidateAvatar(c.name, 36)}
            <div>
              <div style="font-weight:700">${c.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted)">${c.party}</div>
            </div>
          </div>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${width}%; transition:width 1s ease"></div>
        </div>
        <div class="bar-pct" style="width:100px; text-align:right">
          <div style="font-weight:800; font-size:1.1rem">${pct}%</div>
          <div style="font-size:0.75rem; color:var(--text-muted)">${c.votes.toLocaleString()}</div>
        </div>
      </div>
    `;
  }).join('');

  return '<div class="page"><div class="container section">' +
    H('div', 'section-header',
      H('span', 'badge badge-green', '<span class="live-pulse"></span> Live Tally') +
      H('h2', 'mt-2', 'Election Night Results') +
      H('p', '', 'Real-time cryptographic tally of all decrypted votes for the ' + e.title)
    ) +
    H('div', 'stats-grid mb-4',
      H('div', 'stat-box', H('div', 'val', totalVotes.toLocaleString()) + H('div', 'lbl', 'Total Votes Counted')) +
      H('div', 'stat-box', H('div', 'val', '99.99%') + H('div', 'lbl', 'Cryptographic Integrity')) +
      H('div', 'stat-box', H('div', 'val', e.candidates.length) + H('div', 'lbl', 'Candidates'))
    ) +
    card('', H('h3', 'mb-4', 'Candidate Standings') + '<div class="bar-chart">' + bars + '</div>') +
    '</div></div>';
};

// ===== SIDEBAR HELPER =====
function renderSidebar(role) {
  var links = [];
  if (role === 'voter') {
    links = [
      { id: 'voter_dashboard', name: 'Electoral Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { id: 'explorer', name: 'Verify Ballot Receipt', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { id: 'merkle', name: 'Merkle Tree', icon: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83' }
    ];
  } else if (role === 'official') {
    links = [
      { id: 'official_dashboard', name: 'Electoral Console', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { id: 'auditor_dashboard', name: 'System Audit Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
    ];
  } else if (role === 'admin') {
    links = [
      { id: 'admin_dashboard', name: 'Node Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
    ];
  } else if (role === 'auditor') {
    links = [
      { id: 'auditor_dashboard', name: 'Audit Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 'explorer', name: 'Blockchain Explorer', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { id: 'merkle', name: 'Merkle Tree', icon: 'M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83' }
    ];
  }

  var html = '<div class="dashboard-sidebar"><div class="sidebar-menu">';
  links.forEach(l => {
    html += `<a href="#/${l.id}" class="${S.page.startsWith(l.id) ? 'active' : ''}">${svgIcon(l.icon)} ${l.name}</a>`;
  });
  html += '</div></div>';
  return html;
}
