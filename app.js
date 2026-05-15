(function(){
'use strict';
const S={page:'landing',wallet:false,addr:'',registered:false,voted:false,selCandidate:null,regStep:1,
candidates:[
{id:1,name:'Sarah Mitchell',party:'Progressive Alliance',img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',bio:'Former public policy director with 15 years of government service experience.',votes:4827},
{id:2,name:'James Rodriguez',party:'Democratic Union',img:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',bio:'Civil rights advocate and regional infrastructure development leader.',votes:3651},
{id:3,name:'Amara Osei',party:'Innovation Coalition',img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',bio:'Technology researcher specializing in digital governance and public health.',votes:2984}
],
bench:{gasPerVote:304659,storagePerVote:544,witnessMs:35.4,proofMs:233.0,verifyMs:213.7,
voters:[10,50,100,500,1000],totalGas:[3063686,15232978,30465860,152329732,304659644],
avgLatency:[3.70,3.25,3.54,3.69,4.06]}};
window.S=S;

// Router
function route(){
const h=location.hash.slice(2)||'landing';
S.page=h;
const app=document.getElementById('app');
app.style.opacity='0';
setTimeout(()=>{
const fn=window.PAGES[h];
app.innerHTML=fn?fn():(window.PAGES.landing||function(){return''})();
app.style.opacity='1';
updateNav();
if(window.PAGES['init_'+h])window.PAGES['init_'+h]();
window.scrollTo({top:0,behavior:'smooth'});
},200);
}
window.navigate=function(p){location.hash='/'+p};
function updateNav(){
document.querySelectorAll('.nav-links a').forEach(a=>{
a.classList.toggle('active',a.dataset.page===S.page);
});
const wb=document.getElementById('nav-wallet-btn');
if(S.wallet){wb.innerHTML='<span class="wallet-dot connected"></span>'+S.addr.slice(0,6)+'...';wb.onclick=null;}
}
window.handleNavWallet=function(){if(!S.wallet)navigate('wallet')};

// Particles
function initParticles(){
const c=document.getElementById('particles-canvas');if(!c)return;
const ctx=c.getContext('2d');let w,h,pts=[];
function resize(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
for(let i=0;i<60;i++)pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*2+1});
function draw(){
ctx.clearRect(0,0,w,h);
pts.forEach(p=>{
p.x+=p.vx;p.y+=p.vy;
if(p.x<0||p.x>w)p.vx*=-1;
if(p.y<0||p.y>h)p.vy*=-1;
ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle='rgba(37,99,235,0.2)';ctx.fill();
});
for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
if(d<150){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
ctx.strokeStyle='rgba(37,99,235,'+(1-d/150)*0.1+')';ctx.stroke();}
}
requestAnimationFrame(draw);
}
draw();
}

// Toggle
document.getElementById('nav-toggle').addEventListener('click',function(){
document.getElementById('nav-links').classList.toggle('open');
});

// Modal helpers
window.showModal=function(html){
const m=document.getElementById('modal-overlay');
m.innerHTML='<div class="modal-card">'+html+'</div>';
m.classList.remove('hidden');
};
window.hideModal=function(){document.getElementById('modal-overlay').classList.add('hidden')};

// Init
window.addEventListener('hashchange',route);
window.addEventListener('DOMContentLoaded',function(){initParticles();route();});
})();
