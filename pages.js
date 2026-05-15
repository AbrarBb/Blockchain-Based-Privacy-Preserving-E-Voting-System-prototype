window.PAGES={};
// Helper
function H(tag,cls,inner){return'<'+tag+(cls?' class="'+cls+'"':'')+'>'+(inner||'')+'</'+tag+'>';}
function card(cls,inner){return'<div class="card '+(cls||'')+'">'+(inner||'')+'</div>';}
function svgIcon(path){return'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="'+path+'"></path></svg>';}

// ===== LANDING =====
PAGES.landing=function(){
var stats=H('div','hero-stats',
[['304,659','Gas/Vote'],['544 B','Storage/Vote'],['233ms','Proof Gen'],['1,000+','Voters Tested']]
.map(function(s){return card('stat-card',H('div','stat-val',s[0])+H('div','stat-label',s[1]));}).join(''));
var features=[
[svgIcon('M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'),'Blockchain Secured','Votes stored on an immutable distributed ledger that prevents tampering.'],
[svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),'Zero-Knowledge Proofs','Prove your eligibility without revealing your identity or vote choice.'],
[svgIcon('M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22'),'Privacy Preserved','End-to-end encryption ensures complete voter anonymity.'],
[svgIcon('M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3'),'Publicly Verifiable','Anyone can verify election integrity without compromising privacy.']
];
var steps=[
['1','Connect Wallet','Link your Ethereum wallet to authenticate securely.'],
['2','Register Identity','Verify eligibility through our privacy-preserving credential system.'],
['3','Cast Your Vote','Select your candidate — a ZK proof is generated automatically.'],
['4','Blockchain Confirmed','Your encrypted vote is permanently recorded on-chain.']
];
return'<div class="page"><section class="hero"><div class="container">'+
H('div','hero-badge',H('span','badge badge-primary',svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z')+' Powered by Blockchain & Zero-Knowledge Proofs'))+
H('h1','','Secure Public E-Voting System')+
H('p','hero-sub','Cast your vote with complete privacy. Our system uses Zero-Knowledge Proofs and blockchain technology to ensure your vote is anonymous, verifiable, and tamper-proof.')+
H('div','hero-actions','<button class="btn btn-lg btn-primary" onclick="navigate(\'wallet\')">Start Voting</button><button class="btn btn-lg btn-outline" onclick="navigate(\'security\')">Learn How It Works</button>')+
stats+'</div></section>'+
'<section class="section"><div class="container">'+H('div','section-header',H('h2','','Core Features')+H('p','','Built with cutting-edge cryptographic technology for secure democratic participation.'))+
H('div','features-grid',features.map(function(f){return card('feature-card',H('div','feature-icon',f[0])+H('h3','',f[1])+H('p','',f[2]));}).join(''))+'</div></section>'+
'<section class="section"><div class="container">'+H('div','section-header',H('h2','','How It Works')+H('p','','Four simple steps to cast your secure, anonymous vote.'))+
H('div','steps-row',steps.map(function(s){return card('step-card',H('div','step-num',s[0])+H('h3','',s[1])+H('p','',s[2]));}).join(''))+'</div></section></div>';
};

// ===== WALLET =====
PAGES.wallet=function(){
return'<div class="page wallet-page">'+card('wallet-card',
H('div','wallet-icon',svgIcon('M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 0 0 0 4h4v-4Z'))+
H('h2','','Connect Your Wallet')+
H('p','','Link your Ethereum wallet to authenticate and participate in the election.')+
'<button class="btn btn-lg btn-primary" style="width:100%" onclick="connectWallet()" id="connect-btn">Connect Wallet</button>'+
H('div','wallet-divider','or')+
'<button class="btn btn-lg btn-outline" style="width:100%" onclick="navigate(\'register\')">Login with Voter ID</button>'+
H('p','mt-2','<small style="color:var(--text-light)">Your wallet address is used only for authentication. No personal data is stored.</small>')
)+'</div>';
};
window.connectWallet=function(){
var btn=document.getElementById('connect-btn');
btn.innerHTML='Connecting...';btn.disabled=true;
setTimeout(function(){
S.wallet=true;S.addr='0x'+Array.from({length:40},function(){return'0123456789abcdef'[Math.floor(Math.random()*16)]}).join('');
navigate('register');
},1500);
};

// ===== REGISTER =====
PAGES.register=function(){
var step=S.regStep;
var dots=[1,2,3].map(function(n){return H('div','step-dot'+(n<step?' done':n===step?' active':''),n<step?svgIcon('M20 6L9 17l-5-5'):n);}).join('');
var bars=[1,2,3].map(function(n){return H('div','progress-step'+(n<step?' done':n===step?' active':''));}).join('');
var titles=['Personal Information','Contact Details','Review & Submit'];
var content='';
if(step===1)content=
H('div','form-group',H('label','form-label','Full Name')+'<input class="form-input" id="r-name" placeholder="Enter your full name">')+
H('div','form-group',H('label','form-label','National ID')+'<input class="form-input" id="r-nid" placeholder="Enter national ID number">')+
H('div','form-group',H('label','form-label','Date of Birth')+'<input class="form-input" type="date" id="r-dob">')+
'<button class="btn btn-primary" style="width:100%" onclick="regNext()">Continue</button>';
else if(step===2)content=
H('div','form-group',H('label','form-label','Phone Number')+'<input class="form-input" id="r-phone" placeholder="+1 (555) 000-0000">')+
H('div','form-group',H('label','form-label','Email Address')+'<input class="form-input" type="email" id="r-email" placeholder="you@example.com">')+
H('div','flex gap-2','<button class="btn btn-outline" onclick="regBack()">Back</button><button class="btn btn-primary" style="flex:1" onclick="regNext()">Continue</button>');
else content=
H('div','card-sm mb-2','<table style="width:100%;font-size:0.95rem"><tr><td style="color:var(--text-muted);padding:8px">Wallet</td><td style="padding:8px" class="mono">'+(S.addr?S.addr.slice(0,20)+'...':'Not connected')+'</td></tr><tr><td style="color:var(--text-muted);padding:8px">Status</td><td style="padding:8px"><span class="badge badge-green">Eligible</span></td></tr></table>')+
H('div','flex gap-2','<button class="btn btn-outline" onclick="regBack()">Back</button><button class="btn btn-primary" style="flex:1" onclick="regSubmit()">Submit Registration</button>');

return'<div class="page reg-page">'+H('h2','mb-2','Voter Registration')+
H('p','mb-4','Step '+step+' of 3: '+titles[step-1])+
H('div','step-indicators',dots)+H('div','progress-bar mb-4',bars)+
card('',content)+'</div>';
};
window.regNext=function(){if(S.regStep<3){S.regStep++;route();}};
window.regBack=function(){if(S.regStep>1){S.regStep--;route();}};
function route(){var h=location.hash.slice(2)||'landing';var app=document.getElementById('app');var fn=PAGES[h];app.innerHTML=fn?fn():'';if(PAGES['init_'+h])PAGES['init_'+h]();}
window.regSubmit=function(){
S.registered=true;
showModal(H('div','text-center',H('div','confirm-check',svgIcon('M20 6L9 17l-5-5'))+H('h2','','Registration Successful')+H('p','','Your voter credentials have been generated.')+
'<button class="btn btn-primary mt-4" onclick="hideModal();navigate(\'vote\')">Proceed to Vote</button>'));
};

// ===== VOTE =====
PAGES.vote=function(){
if(!S.wallet&&!S.registered){return'<div class="page"><div class="container section text-center">'+H('h2','','Please Connect Wallet First')+H('p','mt-2','You need to authenticate before voting.')+
'<button class="btn btn-primary mt-4" onclick="navigate(\'wallet\')">Connect Wallet</button></div></div>';}
var cards=S.candidates.map(function(c){
return card('candidate-card',
H('div','candidate-img-wrap','<img src="'+c.img+'" alt="'+c.name+'">')+
H('div','candidate-content',
H('div','candidate-name',c.name)+H('div','candidate-party badge badge-primary',c.party)+
H('p','candidate-bio',c.bio)+
'<button class="btn btn-primary vote-btn" onclick="confirmVote('+c.id+')">Vote for '+c.name.split(' ')[0]+'</button>'));
}).join('');
return'<div class="page"><div class="container section">'+
H('div','section-header',H('span','badge badge-primary','2026 National Election')+H('h2','mt-2','Cast Your Vote')+H('p','','Select your preferred candidate. Your vote is protected by Zero-Knowledge Proofs.'))+
H('div','','<div class="countdown" id="countdown"></div>')+
H('div','candidates-grid',cards)+'</div></div>';
};
PAGES.init_vote=function(){
var end=Date.now()+86400000*2;
function tick(){
var r=Math.max(0,end-Date.now());var h=Math.floor(r/3600000);var m=Math.floor(r%3600000/60000);var s=Math.floor(r%60000/1000);
var el=document.getElementById('countdown');if(el)el.innerHTML=
[[''+h,'Hours'],[''+m,'Minutes'],[''+s,'Seconds']].map(function(t){
return H('div','countdown-item',H('span','countdown-val',t[0].padStart(2,'0'))+H('span','countdown-label',t[1]));}).join('');
}
tick();setInterval(tick,1000);
};
window.confirmVote=function(id){
var c=S.candidates.find(function(x){return x.id===id;});
showModal(H('h3','mb-2','Confirm Your Vote')+
H('p','','You are voting for <strong>'+c.name+'</strong> ('+c.party+')')+
H('p','mt-2','<small style="color:var(--text-muted)">Your vote is anonymous and protected by Zero-Knowledge Proofs. This action cannot be undone.</small>')+
H('div','flex gap-2 mt-4','<button class="btn btn-outline" onclick="hideModal()">Cancel</button><button class="btn btn-primary" style="flex:1" onclick="submitVote('+id+')">Confirm Vote</button>'));
};
window.submitVote=function(id){
hideModal();
var c=S.candidates.find(function(x){return x.id===id;});
S.selCandidate=c;S.voted=true;c.votes++;
showModal(H('div','text-center',H('div','','<div style="margin-bottom:16px;color:var(--primary)">'+svgIcon('M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83')+'</div>')+H('h3','','Generating ZK Proof...')+H('p','mono','Processing cryptographic proof...')));
setTimeout(function(){
hideModal();
showModal(H('div','text-center',H('div','','<div style="margin-bottom:16px;color:var(--green)">'+svgIcon('M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3')+'</div>')+H('h3','','Proof Verified')+H('p','','Submitting to blockchain...')));
setTimeout(function(){hideModal();navigate('confirmation');},1200);
},2000);
};

// ===== CONFIRMATION =====
PAGES.confirmation=function(){
var tx='0x'+Array.from({length:64},function(){return'0123456789abcdef'[Math.floor(Math.random()*16)]}).join('');
var block=Math.floor(Math.random()*1000000+18000000);
var nul='0x'+Array.from({length:64},function(){return'0123456789abcdef'[Math.floor(Math.random()*16)]}).join('');
return'<div class="page confirm-page">'+card('confirm-card',
H('div','confirm-check',svgIcon('M20 6L9 17l-5-5'))+
H('h2','','Vote Submitted Successfully')+
H('p','','Your vote has been encrypted and recorded on the blockchain.')+
H('div','confirm-details',
H('span','','Transaction Hash:')+'<br>'+tx+'<br><br>'+
H('span','','Block Number:')+' '+block+'<br>'+
H('span','','Nullifier:')+'<br>'+nul.slice(0,20)+'...'+'<br>'+
H('span','','Timestamp:')+' '+new Date().toISOString()+'<br>'+
H('span','','ZK Proof:')+' <span style="color:var(--green);font-weight:600">Verified (Groth16)</span><br>'+
H('span','','Gas Used:')+' 304,659')+
H('div','flex gap-2 mt-4 justify-center','<button class="btn btn-outline" onclick="navigate(\'explorer\')">View Explorer</button><button class="btn btn-primary" onclick="navigate(\'results\')">View Results</button>')
)+'</div>';
};

// ===== RESULTS =====
PAGES.results=function(){
var total=S.candidates.reduce(function(a,c){return a+c.votes;},0);
var sorted=S.candidates.slice().sort(function(a,b){return b.votes-a.votes;});
var w=sorted[0];
var bars=sorted.map(function(c){var pct=(c.votes/total*100).toFixed(1);
return H('div','bar-row',H('div','bar-label',c.name)+
H('div','bar-track','<div class="bar-fill" style="width:'+pct+'%">'+c.votes+'</div>')+
H('div','bar-pct',pct+'%'));}).join('');
var benchHtml=H('h3','mb-2','Benchmark Data (Research)')+
'<table class="data-table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>'+
[['Gas per Vote','304,659'],['Storage per Vote','544 bytes'],['Witness Generation','35.4 ms'],['Proof Generation','233.0 ms'],['Proof Verification','213.7 ms'],['Scalability','Linear (tested 10–1000 voters)']].map(function(r){return'<tr><td>'+r[0]+'</td><td class="mono">'+r[1]+'</td></tr>';}).join('')+'</tbody></table>';
return'<div class="page"><div class="container section">'+
card('winner-card',H('div','winner-badge',svgIcon('M5 3v4M19 3v4M5 11h14M5 15h14M9 3v18M15 3v18')+' Projected Winner')+H('div','winner-name',w.name)+H('div','winner-votes',w.votes+' votes ('+( w.votes/total*100).toFixed(1)+'%) — '+w.party))+
H('div','results-grid grid-2',
card('',H('h3','mb-2','Vote Distribution')+H('div','bar-chart',bars))+
card('',benchHtml))+
H('div','mt-4 text-center',H('span','badge badge-green','Results Verified on Blockchain')+' '+H('span','badge badge-primary','Privacy Preserved'))+
'</div></div>';
};

// ===== EXPLORER =====
PAGES.explorer=function(){
var txs=[];
for(var i=0;i<8;i++){
var hash='0x'+Array.from({length:40},function(){return'0123456789abcdef'[Math.floor(Math.random()*16)]}).join('');
txs.push({hash:hash,block:18000000+Math.floor(Math.random()*100000),gas:304659+Math.floor(Math.random()*200-100),time:Math.floor(Math.random()*60)});
}
var rows=txs.map(function(t){return card('tx-card','<div>'+
H('div','tx-hash',t.hash.slice(0,24)+'...')+H('div','tx-meta','Block #'+t.block)+
'</div><div>'+H('div','tx-meta','Gas: '+t.gas.toLocaleString())+H('div','tx-meta',t.time+' min ago')+
'</div><div>'+H('span','tx-status verified','Verified')+'</div>');}).join('');
return'<div class="page"><div class="container section">'+
H('div','section-header',H('span','badge badge-primary','Blockchain Explorer')+H('h2','mt-2','On-Chain Activity')+H('p','','Real-time view of encrypted vote transactions on the blockchain.'))+
H('div','admin-grid mb-4',
card('admin-metric',H('div','metric-val',txs.length)+H('div','metric-label','Transactions'))+
card('admin-metric',H('div','metric-val','18,042,156')+H('div','metric-label','Latest Block'))+
card('admin-metric',H('div','metric-val','304,659')+H('div','metric-label','Avg Gas')))+
H('div','tx-list',rows)+'</div></div>';
};

// ===== ZKP =====
PAGES.zkp=function(){
var nodes=[
[svgIcon('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'),'Input Signals','isRegistered, isCitizen,\nisAgeAbove18, vote'],
['→','',''],
[svgIcon('M13 2L3 14h9l-1 8 10-12h-9l1-8z'),'Circom Circuit','vote × (vote − 1) = 0\nConstraint validation'],
['→','',''],
[svgIcon('M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'),'Witness Generation','~35.4ms average\nPrivate computation'],
['→','',''],
[svgIcon('M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3m-1 5h8'),'Proof Generation','Groth16 protocol\n~233ms average'],
['→','',''],
[svgIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'),'Verification','On-chain check\n~213.7ms average'],
['→','',''],
[svgIcon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'),'Smart Contract','Vote accepted\nNullifier stored']
];
var flow=nodes.map(function(n){
if(n[0]==='→')return H('div','zkp-arrow',svgIcon('M5 12h14M12 5l7 7-7 7'));
return card('zkp-node',H('div','node-icon',n[0])+H('h4','',n[1])+H('p','mono',n[2].replace(/\n/g,'<br>')));
}).join('');
var circuit='<pre class="mono" style="font-size:0.875rem;line-height:1.8;padding:20px;background:var(--bg);border-radius:var(--radius);overflow-x:auto;border:1px solid var(--border)">'
+'pragma circom 2.1.6;\n\ntemplate VoteCircuit() {\n    signal input isRegistered;\n    signal input isCitizen;\n    signal input isAgeAbove18;\n    signal input vote;\n    signal output valid;\n\n    signal tmp;\n    tmp &lt;== isRegistered * isCitizen;\n    valid &lt;== tmp * isAgeAbove18;\n\n    signal voteCheck;\n    voteCheck &lt;== vote * (vote - 1);\n    voteCheck === 0;  // vote must be 0 or 1\n}\n\ncomponent main = VoteCircuit();</pre>';
return'<div class="page"><div class="container section">'+
H('div','section-header',H('span','badge badge-primary','Zero-Knowledge Proof Pipeline')+H('h2','mt-2','ZKP Visualization')+H('p','','How your vote is cryptographically proven without revealing any private information.'))+
H('div','zkp-flow',flow)+
H('div','grid-2 mt-4',card('',H('h3','mb-2','Circom Circuit Code')+circuit)+
card('',H('h3','mb-2','Performance Metrics')+
'<table class="data-table"><thead><tr><th>Operation</th><th>Mean</th><th>Min</th><th>Max</th></tr></thead><tbody>'+
'<tr><td>Witness Gen</td><td class="mono">35.4ms</td><td class="mono">32.8ms</td><td class="mono">37.3ms</td></tr>'+
'<tr><td>Proof Gen</td><td class="mono">233.0ms</td><td class="mono">225.5ms</td><td class="mono">256.4ms</td></tr>'+
'<tr><td>Verification</td><td class="mono">213.7ms</td><td class="mono">207.3ms</td><td class="mono">228.4ms</td></tr></tbody></table>'+
H('p','mt-2','<small>Measured over 10 runs using snarkjs Groth16 on local hardware.</small>')))+
'</div></div>';
};

// ===== ADMIN =====
PAGES.admin=function(){
var total=S.candidates.reduce(function(a,c){return a+c.votes;},0);
var metrics=[
[svgIcon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'),''+S.candidates.length,'Candidates'],
[svgIcon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'),''+total,'Total Votes'],
[svgIcon('M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'),''+S.bench.gasPerVote.toLocaleString(),'Avg Gas/Vote'],
[svgIcon('M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3'),'Active','Election Status']
];
var rows=S.candidates.map(function(c){return'<tr><td><div style="display:flex;align-items:center;gap:12px"><img src="'+c.img+'" style="width:32px;height:32px;border-radius:50%;object-fit:cover"><span>'+c.name+'</span></div></td><td>'+c.party+'</td><td class="mono">'+c.votes+'</td><td>'+(c.votes/total*100).toFixed(1)+'%</td></tr>';}).join('');
return'<div class="page"><div class="container section">'+
H('div','section-header',H('span','badge badge-primary','Admin Dashboard')+H('h2','mt-2','Election Management'))+
H('div','admin-grid',metrics.map(function(m){return card('admin-metric',H('div','metric-icon',m[0])+H('div','metric-val',m[1])+H('div','metric-label',m[2]));}).join(''))+
H('div','flex gap-2 mb-4','<button class="btn btn-green" onclick="alert(\'Election started\')">Start Election</button><button class="btn btn-danger" onclick="alert(\'Election ended\')">End Election</button><button class="btn btn-outline" onclick="alert(\'Candidate modal — demo only\')">Add Candidate</button>')+
card('',H('h3','mb-2','Candidate Overview')+
'<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Candidate</th><th>Party</th><th>Votes</th><th>%</th></tr></thead><tbody>'+rows+'</tbody></table></div>')+
H('div','mt-4',card('',H('h3','mb-2','Gas Scalability (Benchmark)')+
'<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Voters</th><th>Total Gas</th><th>Avg Gas/Vote</th><th>Avg Latency</th></tr></thead><tbody>'+
S.bench.voters.map(function(v,i){return'<tr><td>'+v+'</td><td class="mono">'+S.bench.totalGas[i].toLocaleString()+'</td><td class="mono">304,659</td><td class="mono">'+S.bench.avgLatency[i].toFixed(2)+' ms</td></tr>';}).join('')+
'</tbody></table></div>'))+
'</div></div>';
};

// ===== SECURITY =====
PAGES.security=function(){
var infos=[
[svgIcon('M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'),'Blockchain Immutability','Once your vote is recorded on the Ethereum blockchain, it cannot be altered or deleted. Each block is cryptographically linked to the previous one, creating an unbreakable chain of records.'],
[svgIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'),'Zero-Knowledge Proofs','ZKP allows you to prove you are an eligible voter and your vote is valid — without revealing WHO you are or WHAT you voted for. The Groth16 protocol generates a compact proof that can be verified on-chain in milliseconds.'],
[svgIcon('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'),'Nullifier System','A unique cryptographic nullifier is generated for each voter. This prevents double-voting while maintaining anonymity. The smart contract checks nullifier uniqueness — if it was already used, the vote is rejected.'],
[svgIcon('M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'),'Homomorphic Tallying','Votes are encrypted so that they can be counted without decrypting individual ballots. This means nobody — not even the election authority — can see individual vote choices during or after counting.'],
[svgIcon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'),'Smart Contract Logic','All election rules are encoded in a Solidity smart contract deployed on Ethereum. The contract automatically verifies proofs, checks nullifiers, stores encrypted ballots, and manages the election lifecycle.'],
[svgIcon('M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'),'Public Verifiability','Anyone can verify the election results by checking the blockchain. All encrypted votes, proofs, and nullifiers are publicly visible, but individual vote choices remain hidden thanks to ZKP and encryption.']
];
var faqs=[
['Can anyone see who I voted for?','No. Your vote is encrypted and submitted with a Zero-Knowledge Proof. The proof verifies your eligibility and vote validity without revealing your identity or choice. Even the election authority cannot link a vote to a voter.'],
['What prevents someone from voting twice?','Each voter receives a unique cryptographic nullifier. The smart contract maintains a registry of used nullifiers. If a nullifier has already been recorded, the transaction is rejected automatically.'],
['What is the gas cost of voting?','Our benchmarks show an average of 304,659 gas per vote (~$0.50–$2.00 depending on network conditions). The gas cost remains nearly constant regardless of the number of voters, demonstrating linear scalability.'],
['How is the vote stored on blockchain?','Votes are stored as encrypted bytes alongside nullifiers and timestamps. Each ballot occupies approximately 544 bytes of on-chain storage. The encryption ensures vote secrecy while the blockchain ensures permanence.']
];
return'<div class="page"><div class="container section">'+
H('div','section-header',H('span','badge badge-primary','Security & Research')+H('h2','mt-2','How Your Vote Is Protected')+H('p','','Understanding the cryptographic technologies that ensure secure, private, and verifiable elections.'))+
H('div','info-grid',infos.map(function(f){return card('info-card',H('div','info-icon',f[0])+H('h3','',f[1])+H('p','',f[2]));}).join(''))+
H('div','section mt-4',H('div','section-header',H('h2','','Frequently Asked Questions'))+
card('',faqs.map(function(f,i){return H('div','faq-item',H('div','faq-q','<span>'+f[0]+'</span><span class="faq-arrow">'+svgIcon('M19 9l-7 7-7-7')+'</span>')+H('div','faq-a',f[1]));}).join('')))+
'</div></div>';
};
PAGES.init_security=function(){
document.querySelectorAll('.faq-q').forEach(function(q){
q.addEventListener('click',function(){q.parentElement.classList.toggle('open');});
});
};
