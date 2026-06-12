// LOADER
const statuses = ['Booting system...','Loading modules...','Compiling assets...','Rendering UI...','Ready.'];
let si = 0;
const ldStatus = document.getElementById('ldStatus');
const ldInt = setInterval(() => {
  si++;
  if(si < statuses.length) ldStatus.textContent = statuses[si];
  else clearInterval(ldInt);
}, 480);
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
    initReveal();
    initSkillBars();
    initCounters();
  }, 2600);
});

// CANVAS PARTICLES
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
addEventListener('resize', resize);

class Pt {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random()*W; this.y = Math.random()*H;
    this.vx = (Math.random()-.5)*.35; this.vy = (Math.random()-.5)*.35;
    this.r = Math.random()*1.5+.4; this.o = Math.random()*.5+.1;
    this.c = ['168,85,247','34,211,238','236,72,153'][Math.floor(Math.random()*3)];
  }
  update() { this.x += this.vx; this.y += this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset(); }
  draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(${this.c},${this.o})`; ctx.fill(); }
}
for(let i=0;i<120;i++) pts.push(new Pt());

function connect() {
  for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
    const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
    if(d<90) { ctx.beginPath(); ctx.strokeStyle=`rgba(168,85,247,${.06*(1-d/90)})`; ctx.lineWidth=.5; ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
  }
}
function drawBg() { ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.update();p.draw();}); connect(); requestAnimationFrame(drawBg); }
drawBg();

// FIRE PARTICLES
const fireWrap = document.getElementById('fireWrap');
function spawnFire() {
  const p = document.createElement('div');
  p.className = 'fire-particle';
  const size = Math.random()*4+2;
  const colors = ['#a855f7','#ec4899','#22d3ee','#f59e0b'];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const x = Math.random()*100;
  const dur = Math.random()*4+3;
  Object.assign(p.style, {
    width: size+'px', height: size+'px', background: color,
    left: x+'%', bottom: '-10px',
    animationDuration: dur+'s', boxShadow: `0 0 ${size*2}px ${color}`
  });
  fireWrap.appendChild(p);
  setTimeout(() => p.remove(), dur*1000);
}
setInterval(spawnFire, 200);

// CURSOR
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX+'px'; cur.style.top = e.clientY+'px';
  ring.style.left = e.clientX+'px'; ring.style.top = e.clientY+'px';
});
document.querySelectorAll('a,button,.proj-card,.exp-card,.cert-flip,.ach-card,.tp,.soc-btn,.clink').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.transform='translate(-50%,-50%) scale(2.5)'; cur.style.background='var(--p2)'; ring.style.borderColor='rgba(34,211,238,.6)'; });
  el.addEventListener('mouseleave', () => { cur.style.transform='translate(-50%,-50%) scale(1)'; cur.style.background='var(--p1)'; ring.style.borderColor='rgba(168,85,247,.5)'; });
});

// MOUSE ORB
const mouseOrb = document.createElement('div');
mouseOrb.style.cssText='position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.04),transparent 70%);pointer-events:none;z-index:0;transition:left 1s,top 1s;transform:translate(-50%,-50%)';
document.body.appendChild(mouseOrb);
document.addEventListener('mousemove', e => { mouseOrb.style.left=e.clientX+'px'; mouseOrb.style.top=e.clientY+'px'; });

// NAV
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('stuck', scrollY > 60));

// TYPED
const roles = ['Backend Engineer 🚀','Full-Stack Developer 💻','Go · Django · Spring ⚡','SIH\'25 Finalist 🏆'];
let ri=0, ci=0, del=false;
const tEl = document.getElementById('typed');
function typeIt() {
  const c = roles[ri];
  if(!del) { tEl.textContent=c.slice(0,++ci); if(ci===c.length){del=true;setTimeout(typeIt,1600);return;} }
  else { tEl.textContent=c.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
  setTimeout(typeIt, del?35:75);
}
typeIt();

// REVEAL
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// SKILL BARS
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) { e.target.querySelectorAll('.sf').forEach(b => b.style.width = b.dataset.w+'%'); obs.unobserve(e.target); }
    });
  }, {threshold:.2});
  document.querySelectorAll('.skill-bars').forEach(el => obs.observe(el));
}

// COUNTERS
function initCounters() {
  document.querySelectorAll('.stat-val').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if(current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.round(current);
    }, 40);
  });
}

// CONTACT FORM
document.getElementById('cForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('fBtn');
  btn.textContent = '✓ Sent!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; e.target.reset(); }, 3000);
});

// BURGER
document.getElementById('burger').addEventListener('click', () => {
  const menu = document.getElementById('navMenu');
  if(menu.style.display === 'flex') { menu.style.display = 'none'; }
  else { Object.assign(menu.style, { display:'flex', flexDirection:'column', position:'absolute', top:'60px', left:'0', width:'100%', background:'rgba(4,4,15,.98)', padding:'2rem', gap:'1.5rem', borderBottom:'1px solid rgba(255,255,255,.07)' }); }
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth'});
    const menu = document.getElementById('navMenu');
    if(menu) menu.style.display = '';
  });
});

// 3D TILT on cards
document.querySelectorAll('.proj-card,.exp-card,.ach-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(700px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
