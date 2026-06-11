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
  }, 2600);
});

// CANVAS PARTICLES
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Pt {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .35;
    this.vy = (Math.random() - .5) * .35;
    this.r = Math.random() * 1.5 + .4;
    this.o = Math.random() * .5 + .1;
    this.c = ['168,85,247','34,211,238','236,72,153'][Math.floor(Math.random()*3)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(${this.c},${this.o})`;
    ctx.fill();
  }
}

for(let i=0;i<130;i++) pts.push(new Pt());

function connect() {
  for(let i=0;i<pts.length;i++) {
    for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<90) {
        ctx.beginPath();
        ctx.strokeStyle=`rgba(168,85,247,${.06*(1-d/90)})`;
        ctx.lineWidth=.5;
        ctx.moveTo(pts[i].x,pts[i].y);
        ctx.lineTo(pts[j].x,pts[j].y);
        ctx.stroke();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{p.update();p.draw();});
  connect();
  requestAnimationFrame(draw);
}
draw();

// CURSOR
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX+'px'; cur.style.top = e.clientY+'px';
  ring.style.left = e.clientX+'px'; ring.style.top = e.clientY+'px';
});
document.querySelectorAll('a,button,.cert-card,.proj-card,.exp-card,.skill-block').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform='translate(-50%,-50%) scale(2.5)';
    cur.style.background='var(--p2)';
    ring.style.borderColor='rgba(34,211,238,.6)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform='translate(-50%,-50%) scale(1)';
    cur.style.background='var(--p1)';
    ring.style.borderColor='rgba(168,85,247,.5)';
  });
});

// MOUSE ORB
const mouseOrb = document.createElement('div');
mouseOrb.style.cssText='position:fixed;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.04),transparent 70%);pointer-events:none;z-index:0;transition:left 1s ease,top 1s ease;transform:translate(-50%,-50%)';
document.body.appendChild(mouseOrb);
document.addEventListener('mousemove', e => {
  mouseOrb.style.left=e.clientX+'px';
  mouseOrb.style.top=e.clientY+'px';
});

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('stuck', window.scrollY > 60); });

// TYPED
const roles = ['Backend Engineer 🚀','Full-Stack Developer 💻','Go · Django · Spring ⚡','SIH\'25 Finalist 🏆','Open Source Enthusiast 🐧'];
let ri=0,ci=0,del=false;
const tEl = document.getElementById('typed');
function typeIt() {
  const cur2 = roles[ri];
  if(!del) { tEl.textContent=cur2.slice(0,++ci); if(ci===cur2.length){del=true;setTimeout(typeIt,1600);return;} }
  else { tEl.textContent=cur2.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
  setTimeout(typeIt, del?35:75);
}
typeIt();

// REVEAL
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, {threshold:.1});
  document.querySelectorAll('.reveal,.skill-block,.cert-card,.lead-item,.ach-card,.exp-card').forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });
}

// SKILL BARS
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.querySelectorAll('.sbar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.2});
  document.querySelectorAll('.skill-bars').forEach(el => obs.observe(el));
}

// CONTACT FORM
document.getElementById('cForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('fBtn');
  btn.textContent = '✓ Sent!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// BURGER
document.getElementById('burger').addEventListener('click', () => {
  const menu = document.querySelector('.nav-menu');
  if(menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    Object.assign(menu.style, {
      display:'flex', flexDirection:'column', position:'absolute',
      top:'70px', left:'0', width:'100%', background:'rgba(4,4,15,.98)',
      padding:'2rem', gap:'1.5rem', borderBottom:'1px solid rgba(255,255,255,.07)'
    });
  }
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth'});
    document.querySelector('.nav-menu').style.display='none';
  });
});

// 3D TILT on project cards
document.querySelectorAll('.proj-card,.exp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform=''; });
});

// CERT MODAL
function openCertModal(title, org, meta) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalOrg').textContent = org + (meta?' · '+meta:'');
  document.getElementById('certModal').classList.add('open');
}
function closeCertModal(e) {
  if(!e || e.target.id==='certModal' || e.target.classList.contains('modal-close'))
    document.getElementById('certModal').classList.remove('open');
}
function handleCertUpload(e) {
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  const mp = document.getElementById('modalProof');
  mp.innerHTML = `<img src="${url}" style="width:100%;border-radius:8px;border:1px solid rgba(255,255,255,.1)"/>`;
}

// ADD CERT CARD
document.getElementById('addCertCard').addEventListener('click', () => {
  document.getElementById('certUpload').click();
});
document.getElementById('certUpload').addEventListener('change', e => {
  const file = e.target.files[0];
  if(!file) return;
  alert(`Certificate "${file.name}" selected! In a real deployment, this would be stored.`);
});
