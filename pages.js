window.PAGES={};
function H(tag,cls,inner){return'<'+tag+(cls?' class="'+cls+'"':'')+'>'+(inner||'')+'</'+tag+'>';}
function card(cls,inner){return'<div class="card '+(cls||'')+'">'+(inner||'')+'</div>';}
function svgIcon(path){return'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="'+path+'"></path></svg>';}

// ===== LANDING =====
PAGES.landing=function(){
  var features=[
    [svgIcon('M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'),'Blockchain Secured','Votes stored on an immutable distributed ledger.'],
    [svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),'Zero-Knowledge Proofs','Prove eligibility without revealing your identity.'],
    [svgIcon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75'),'Role-Based Access','Granular permissions for Officials, Auditors, and Admins.']
  ];
  return'<div class="page"><section class="hero"><div class="container">'+
  H('div','hero-badge',H('span','badge badge-primary',svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')+' Next-Gen E-Voting Infrastructure'))+
  H('h1','','Secure Public E-Voting System')+
  H('p','hero-sub','End-to-end verifiable elections powered by Ethereum Smart Contracts and Zero-Knowledge Proofs. Explore the system as a Voter, Official, Admin, or Auditor.')+
  H('div','hero-actions','<button class="btn btn-lg btn-primary" onclick="navigate(\'login\')">Access System Demo</button><button class="btn btn-lg btn-outline" onclick="navigate(\'security\')">Learn How It Works</button>')+
  '</div></section>'+
  '<section class="section"><div class="container">'+
  H('div','features-grid',features.map(function(f){return card('feature-card',H('div','feature-icon',f[0])+H('h3','',f[1])+H('p','',f[2]));}).join(''))+
  '</div></section></div>';
};

// ===== LOGIN (ROLE SELECTOR DEMO) =====
PAGES.login=function(){
  if(S.currentUser) return '<div class="page section text-center">Already logged in.</div>';
  
  var rolesHtml = S.users.map(u => 
    card('mb-2', `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>${u.name}</strong><br>
          <span class="badge badge-primary mt-2" style="text-transform:uppercase">${u.role}</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="login('${u.id}')">Login as ${u.role}</button>
      </div>
    `)
  ).join('');

  return'<div class="page wallet-page">'+card('wallet-card',
    H('div','wallet-icon',svgIcon('M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4Z'))+
    H('h2','','System Authentication')+
    H('p','mb-4','For this demo, please select a pre-configured role to experience the system from different perspectives.')+
    rolesHtml+
    H('div','wallet-divider','or')+
    '<button class="btn btn-outline" style="width:100%" onclick="navigate(\'register\')">Register New Voter</button>'
  )+'</div>';
};

// ===== VOTER DASHBOARD =====
PAGES.voter_dashboard=function(){
  var activeHtml = S.elections.filter(e => e.phase === 'Voting').map(e => 
    card('mb-4', `
      <div class="flex justify-between items-center mb-2">
        <h3>${e.title}</h3>
        <span class="badge badge-green">Voting Open</span>
      </div>
      <p>Select your candidate using a zero-knowledge proof to maintain your anonymity.</p>
      <button class="btn btn-primary mt-2" onclick="navigate('voter_vote?id=${e.id}')">Cast Ballot</button>
    `)
  ).join('') || '<p>No active elections.</p>';

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
      H('h2','mb-4','Voter Dashboard') +
      card('mb-4', `<div class="flex justify-between items-center"><div><h3>Voter ID Status</h3><p class="mono mt-2" style="color:var(--text-muted)">Wallet: ${S.currentUser.wallet}</p></div><span class="badge badge-green">Verified Eligible</span></div>`) +
      H('h3','mb-2 mt-4','Active Elections') + activeHtml +
      H('h3','mb-2 mt-4','Upcoming Elections') + upcomingHtml +
    '</div></div>';
};

// ===== VOTER VOTE (ACTUAL VOTING FLOW) =====
PAGES.voter_vote=function(){
  var elId = parseInt(location.hash.split('?id=')[1] || 1);
  var e = S.elections.find(x => x.id === elId);
  if(!e) return '<div class="page section text-center">Election not found.</div>';

  var cards = e.candidates.map(c => card('candidate-card',
    H('div','candidate-img-wrap',`<img src="${c.img}" alt="${c.name}">`)+
    H('div','candidate-content',
      H('div','candidate-name',c.name)+H('div','candidate-party badge badge-primary',c.party)+
      H('p','candidate-bio',c.bio)+
      `<button class="btn btn-primary vote-btn" onclick="confirmVote(${e.id}, ${c.id})">Vote for ${c.name.split(' ')[0]}</button>`)
  )).join('');

  return '<div class="dashboard-layout page">' +
    renderSidebar('voter') +
    '<div class="dashboard-content">' +
      H('h2','mb-2','Cast Your Vote: ' + e.title) +
      H('p','mb-4','Your vote is protected by Zero-Knowledge Proofs. Select your preferred candidate.') +
      H('div','candidates-grid',cards) +
    '</div></div>';
};

window.confirmVote = function(electionId, candidateId) {
  var e = S.elections.find(x => x.id === electionId);
  var c = e.candidates.find(x => x.id === candidateId);
  showModal(H('h3','mb-2','Confirm Your Vote')+
    H('p','',`You are voting for <strong>${c.name}</strong> (${c.party})`)+
    H('p','mt-2','<small style="color:var(--text-muted)">Your vote is anonymous and protected by Zero-Knowledge Proofs.</small>')+
    H('div','flex gap-2 mt-4',`<button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-primary" style="flex:1" onclick="submitVote(${electionId}, ${candidateId})">Confirm Vote</button>`));
};

window.submitVote = function(electionId, candidateId) {
  hideModal();
  var e = S.elections.find(x => x.id === electionId);
  var c = e.candidates.find(x => x.id === candidateId);
  
  showModal(H('div','text-center',H('div','','<div style="margin-bottom:16px;color:var(--primary)">'+svgIcon('M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83')+'</div>')+H('h3','','Generating ZK Proof...')+H('p','mono','Processing cryptographic proof...')));
  
  setTimeout(() => {
    hideModal();
    showModal(H('div','text-center',H('div','','<div style="margin-bottom:16px;color:var(--green)">'+svgIcon('M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3')+'</div>')+H('h3','','Proof Verified')+H('p','','Submitting to smart contract...')));
    
    setTimeout(() => {
      c.votes++;
      const nullifier = '0x' + Math.random().toString(16).slice(2, 10) + '...';
      e.votes.push({ nullifier: nullifier, time: Date.now() });
      S.logs.push({ time: Date.now(), user: S.currentUser.wallet, action: `Cast Vote in Election #${electionId} (Nullifier: ${nullifier})` });
      hideModal();
      navigate('voter_dashboard');
      setTimeout(() => alert('Vote successfully recorded on-chain!'), 200);
    }, 1200);
  }, 2000);
};

// ===== ELECTION OFFICIAL DASHBOARD =====
PAGES.official_dashboard=function(){
  var activeElections = S.elections.length;
  var totalVotes = S.elections.reduce((sum, e) => sum + e.votes.length, 0);

  var eCards = S.elections.map(e => card('mb-2', `
    <div class="flex justify-between items-center">
      <div><strong>${e.title}</strong><br><span class="text-muted text-sm">Phase: ${e.phase} | Candidates: ${e.candidates.length}</span></div>
      <button class="btn btn-outline btn-sm" onclick="alert('Manage Election Modal')">Manage</button>
    </div>
  `)).join('');

  return '<div class="dashboard-layout page">' +
    renderSidebar('official') +
    '<div class="dashboard-content">' +
      H('h2','mb-4','Election Management') +
      H('div','admin-grid mb-4',
        card('admin-metric',H('div','metric-val',activeElections)+H('div','metric-label','Elections'))+
        card('admin-metric',H('div','metric-val',totalVotes+11462)+H('div','metric-label','Total Votes Processed'))
      ) +
      H('div','flex justify-between items-center mb-4', H('h3','','All Elections') + '<button class="btn btn-primary" onclick="alert(\'Create Election form\')">+ New Election</button>') +
      eCards +
    '</div></div>';
};

// ===== SUPER ADMIN DASHBOARD =====
PAGES.admin_dashboard=function(){
  var uRows = S.users.map(u => `<tr><td>${u.name}</td><td><span class="badge badge-primary">${u.role}</span></td><td class="mono">${u.wallet}</td><td><span class="badge badge-green">${u.status}</span></td></tr>`).join('');
  
  return '<div class="dashboard-layout page">' +
    renderSidebar('admin') +
    '<div class="dashboard-content">' +
      H('h2','mb-4','System Administration') +
      card('mb-4', `
        <h3 class="mb-2">System Users & Roles</h3>
        <table class="data-table"><thead><tr><th>Name</th><th>Role</th><th>Wallet</th><th>Status</th></tr></thead><tbody>${uRows}</tbody></table>
      `) +
      '<button class="btn btn-primary">Add Official / Auditor</button>' +
    '</div></div>';
};

// ===== AUDITOR DASHBOARD (Logs & Explorer) =====
PAGES.auditor_dashboard=function(){
  var logRows = S.logs.slice().reverse().map(l => `
    <tr>
      <td class="mono text-muted">${new Date(l.time).toLocaleString()}</td>
      <td class="mono" style="color:var(--secondary)">${l.user}</td>
      <td>${l.action}</td>
    </tr>
  `).join('');

  return '<div class="dashboard-layout page">' +
    renderSidebar('auditor') +
    '<div class="dashboard-content">' +
      H('h2','mb-4','Audit & Transparency Logs') +
      H('p','mb-4','Immutable record of all system events. Read-only access.') +
      card('', `
        <h3 class="mb-2">System Event Timeline</h3>
        <table class="data-table"><thead><tr><th>Timestamp</th><th>Actor (Wallet)</th><th>Action</th></tr></thead><tbody>${logRows}</tbody></table>
      `) +
    '</div></div>';
};

// ===== SECURITY PAGE =====
PAGES.security=function(){
  return'<div class="page"><div class="container section">'+
  H('div','section-header',H('span','badge badge-primary','Security Architecture')+H('h2','mt-2','How Your Vote Is Protected')+H('p','','Understanding the cryptographic technologies that ensure secure, private, and verifiable elections.'))+
  H('div','info-grid mb-4',
    card('info-card',H('div','info-icon',svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'))+H('h3','','Zero-Knowledge Proofs')+H('p','','The Groth16 protocol generates a compact proof that verifies your eligibility and vote validity without revealing your identity or choice.'))+
    card('info-card',H('div','info-icon',svgIcon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'))+H('h3','','Smart Contract Logic')+H('p','','All election rules are encoded in Solidity smart contracts. The contract automatically verifies proofs, checks nullifiers, and stores encrypted ballots.'))+
    card('info-card',H('div','info-icon',svgIcon('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'))+H('h3','','Nullifier System')+H('p','','A unique cryptographic nullifier prevents double-voting while maintaining anonymity. If a nullifier is reused, the transaction is rejected.'))
  )+
  '</div></div>';
};

// ===== EXPLORER =====
PAGES.explorer=function(){
  var txs=[];
  for(var i=0;i<8;i++){
    txs.push({
      hash: '0x'+Array.from({length:40},()=>'0123456789abcdef'[Math.floor(Math.random()*16)]).join(''),
      block: 18000000+Math.floor(Math.random()*100000),
      gas: 304659+Math.floor(Math.random()*200-100),
      time: Math.floor(Math.random()*60)
    });
  }
  var rows=txs.map(t => card('tx-card',`
    <div><div class="tx-hash">${t.hash.slice(0,24)}...</div><div class="tx-meta">Block #${t.block}</div></div>
    <div><div class="tx-meta">Gas: ${t.gas.toLocaleString()}</div><div class="tx-meta">${t.time} min ago</div></div>
    <div><span class="tx-status verified">Verified</span></div>
  `)).join('');
  
  return'<div class="page"><div class="container section">'+
  H('div','section-header',H('span','badge badge-primary','Blockchain Explorer')+H('h2','mt-2','On-Chain Activity')+H('p','','Publicly verifiable view of encrypted vote transactions.'))+
  H('div','tx-list',rows)+'</div></div>';
};

// ===== SIDEBAR HELPER =====
function renderSidebar(role) {
  var links = [];
  if(role === 'voter') {
    links = [
      {id:'voter_dashboard', name:'Dashboard', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'},
      {id:'explorer', name:'Verify Vote', icon:'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'}
    ];
  } else if(role === 'official') {
    links = [
      {id:'official_dashboard', name:'Elections', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'},
      {id:'auditor_dashboard', name:'Audit Logs', icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'}
    ];
  } else if(role === 'admin') {
    links = [
      {id:'admin_dashboard', name:'System Admin', icon:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'}
    ];
  } else if(role === 'auditor') {
    links = [
      {id:'auditor_dashboard', name:'Audit Logs', icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'},
      {id:'explorer', name:'Blockchain Explorer', icon:'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'}
    ];
  }

  var html = '<div class="dashboard-sidebar"><div class="sidebar-menu">';
  links.forEach(l => {
    html += `<a href="#/${l.id}" class="${S.page === l.id ? 'active' : ''}">${svgIcon(l.icon)} ${l.name}</a>`;
  });
  html += '</div></div>';
  return html;
}
