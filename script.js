
// ═══════════════════════════════════════════════════════════
//  ALIN ALEX — PREMIUM PORTFOLIO SCRIPT
// ═══════════════════════════════════════════════════════════

// ─── CUSTOM CURSOR ────────────────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorDot  = document.getElementById('cursorDot');
let mx = -200, my = -200, dx = -200, dy = -200;
let cursorVisible = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (!cursorVisible) { cursorVisible = true; cursor.style.opacity='1'; cursorDot.style.opacity='1'; }
});
document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; cursorDot.style.opacity='0'; cursorVisible=false; });

function animateCursor() {
  dx += (mx - dx) * 0.1;
  dy += (my - dy) * 0.1;
  cursor.style.transform    = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
  cursorDot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor interactions
document.querySelectorAll('a,button,.tilt-card,.tech-pill,.proj-card,.epill').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// ─── LOADING SCREEN ───────────────────────────────────────
const loadingScreen = document.getElementById('loadingScreen');
const loadingWrap   = document.getElementById('loadingWrap');
const loadingBtn    = document.getElementById('loadingBtn');
const loadPct       = document.getElementById('loadPct');
const loadingCont   = document.getElementById('loadingContainer');
const loadCont2     = document.getElementById('loadingContent2');
const mainBody      = document.getElementById('mainBody');

// Generate game lines
const gameLinesEl = document.getElementById('gameLines');
for(let i=0;i<27;i++){const d=document.createElement('div');d.className='loaderGame-line';gameLinesEl.appendChild(d);}

loadingWrap.addEventListener('mousemove', e => {
  const r = loadingWrap.getBoundingClientRect();
  loadingWrap.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
  loadingWrap.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
});

let pct = 0;
const fast = setInterval(() => {
  pct += Math.floor(Math.random()*12)+4;
  if(pct >= 92){clearInterval(fast); pct=92;}
  loadPct.textContent = pct + '%';
}, 80);

window.addEventListener('load', () => {
  setTimeout(() => {
    clearInterval(fast);
    const finish = setInterval(() => {
      pct++;
      loadPct.textContent = pct + '%';
      if(pct >= 100){
        clearInterval(finish);
        loadingBtn.classList.add('loading-complete');
        setTimeout(() => {
          loadingWrap.classList.add('clicked');
          setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            mainBody.style.opacity = '1';
            mainBody.style.pointerEvents = 'auto';
            mainBody.style.transition = 'opacity .8s ease';
            document.body.style.overflow = 'auto';
            initReveal();
            initCounters();
            initTilt();
            initMagneticBtns();
            initScrollProgress();
          }, 900);
        }, 700);
      }
    }, 15);
  }, 400);
});

// ─── SCROLL PROGRESS BAR ──────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(scrolled, 100) + '%';
  });
}

// ─── NAVBAR ───────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const navBurger  = document.getElementById('navBurger');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
navBurger.addEventListener('click',  () => { mobileNav.classList.add('open');    document.body.style.overflow='hidden'; });
mobileClose.addEventListener('click',() => { mobileNav.classList.remove('open'); document.body.style.overflow='auto';   });
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open'); document.body.style.overflow='auto';
}));

// ─── HERO 3D CANVAS — Floating Geometric Network ──────────
const hCanvas = document.getElementById('heroCanvas');
const hCtx    = hCanvas.getContext('2d');
let HW, HH, pts = [];
let mouseX = 0, mouseY = 0;

function resizeHero() { HW = hCanvas.width = hCanvas.offsetWidth; HH = hCanvas.height = hCanvas.offsetHeight; }
resizeHero();
window.addEventListener('resize', resizeHero);

document.addEventListener('mousemove', e => {
  const r = hCanvas.getBoundingClientRect();
  mouseX = e.clientX - r.left;
  mouseY = e.clientY - r.top;
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * HW;
    this.y  = Math.random() * HH;
    this.ox = this.x; this.oy = this.y;
    this.vx = (Math.random() - .5) * .5;
    this.vy = (Math.random() - .5) * .5;
    this.r  = Math.random() * 2 + .5;
    this.a  = Math.random() * .5 + .1;
    this.hue = Math.random() * 60 + 240; // purple-blue range
  }
  update() {
    // Mouse repulsion
    const dx = this.x - mouseX, dy = this.y - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 120) {
      this.x += (dx / dist) * 1.2;
      this.y += (dy / dist) * 1.2;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }
    if(this.x < 0 || this.x > HW) this.vx *= -1;
    if(this.y < 0 || this.y > HH) this.vy *= -1;
  }
  draw() {
    hCtx.beginPath();
    hCtx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    const grad = hCtx.createRadialGradient(this.x,this.y,0, this.x,this.y,this.r*2);
    grad.addColorStop(0, `hsla(${this.hue},80%,75%,${this.a})`);
    grad.addColorStop(1, `hsla(${this.hue},80%,75%,0)`);
    hCtx.fillStyle = grad;
    hCtx.fill();
  }
}

// Add floating geometric shapes
class GeoShape {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * HW;
    this.y    = Math.random() * HH;
    this.size = Math.random() * 60 + 20;
    this.rot  = Math.random() * Math.PI * 2;
    this.vr   = (Math.random() - .5) * .005;
    this.vx   = (Math.random() - .5) * .2;
    this.vy   = (Math.random() - .5) * .2;
    this.type = Math.floor(Math.random() * 3); // 0=tri, 1=square, 2=hex
    this.a    = Math.random() * .06 + .02;
    this.hue  = Math.random() < .5 ? 270 : 200;
  }
  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.rot += this.vr;
    if(this.x < -100 || this.x > HW+100) this.vx *= -1;
    if(this.y < -100 || this.y > HH+100) this.vy *= -1;
  }
  draw() {
    hCtx.save();
    hCtx.translate(this.x, this.y);
    hCtx.rotate(this.rot);
    hCtx.strokeStyle = `hsla(${this.hue},70%,70%,${this.a})`;
    hCtx.lineWidth = 1;
    hCtx.beginPath();
    const sides = this.type === 0 ? 3 : this.type === 1 ? 4 : 6;
    for(let i=0; i<sides; i++) {
      const angle = (i/sides)*Math.PI*2 - Math.PI/2;
      const s = this.size;
      if(i===0) hCtx.moveTo(Math.cos(angle)*s, Math.sin(angle)*s);
      else       hCtx.lineTo(Math.cos(angle)*s, Math.sin(angle)*s);
    }
    hCtx.closePath();
    hCtx.stroke();
    hCtx.restore();
  }
}

const shapes = [];
for(let i=0; i<8; i++) shapes.push(new GeoShape());
for(let i=0; i<80; i++) pts.push(new Particle());

function animHero() {
  hCtx.clearRect(0, 0, HW, HH);
  shapes.forEach(s => { s.update(); s.draw(); });
  pts.forEach(p => { p.update(); p.draw(); });
  // Draw connecting lines
  for(let i=0; i<pts.length; i++)
    for(let j=i+1; j<pts.length; j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d < 150) {
        const alpha = .12*(1-d/150);
        hCtx.beginPath();
        hCtx.strokeStyle = `rgba(194,164,255,${alpha})`;
        hCtx.lineWidth = .6;
        hCtx.moveTo(pts[i].x, pts[i].y);
        hCtx.lineTo(pts[j].x, pts[j].y);
        hCtx.stroke();
      }
    }
  requestAnimationFrame(animHero);
}
animHero();

// ─── STACK CANVAS REPLACED BY 3D SCENE ────────────────────

// ─── TYPED EFFECT ─────────────────────────────────────────
const roles = ['Backend Engineer','Full-Stack Developer','Go · Django · Spring','System Architect','SIH\'25 Finalist'];
let rIdx=0, cIdx=0, isDel=false;
const typedEl = document.getElementById('typedText');
function typeEffect(){
  const cur = roles[rIdx];
  typedEl.textContent = isDel ? cur.substring(0,cIdx-1) : cur.substring(0,cIdx+1);
  isDel ? cIdx-- : cIdx++;
  let spd = isDel ? 40 : 80;
  if(!isDel && cIdx===cur.length){spd=2200; isDel=true;}
  else if(isDel && cIdx===0){isDel=false; rIdx=(rIdx+1)%roles.length; spd=400;}
  setTimeout(typeEffect, spd);
}
setTimeout(typeEffect, 1400);

// ─── REVEAL ON SCROLL ─────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
  }), { threshold: .1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── COUNTERS ─────────────────────────────────────────────
function initCounters() {
  document.querySelectorAll('.hstat-num').forEach(el => {
    const target = +el.getAttribute('data-to');
    let cur = 0; const inc = target / 40;
    const t = setInterval(() => {
      cur += inc;
      if(cur >= target){cur=target; clearInterval(t);}
      el.textContent = Math.ceil(cur);
    }, 30);
  });
}

// ─── 3D TILT ──────────────────────────────────────────────
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    let rafId;
    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - r.height/2) / r.height) * -10;
        const ry = ((x - r.width/2)  / r.width)  *  10;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
        // Shine effect
        const shine = card.querySelector('.tilt-shine');
        if(shine){
          const cx = (x/r.width)*100, cy = (y/r.height)*100;
          shine.style.background = `radial-gradient(circle at ${cx}% ${cy}%, rgba(255,255,255,.08), transparent 60%)`;
          shine.style.opacity = '1';
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .6s cubic-bezier(.19,1,.22,1)';
      card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      const shine = card.querySelector('.tilt-shine');
      if(shine) shine.style.opacity = '0';
      setTimeout(() => card.style.transition = '', 600);
    });
    card.style.transition = 'transform .1s ease';
    // Inject shine overlay
    if(!card.querySelector('.tilt-shine')){
      const s = document.createElement('div'); s.className='tilt-shine';
      card.appendChild(s);
    }
  });
}

// ─── MAGNETIC BUTTONS ─────────────────────────────────────
function initMagneticBtns() {
  document.querySelectorAll('.btn-primary,.btn-outline,.nav-resume').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top  + r.height/2);
      btn.style.transform = `translate(${dx*.2}px,${dy*.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .4s cubic-bezier(.19,1,.22,1)';
      btn.style.transform  = 'translate(0,0)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
}

// ─── GLITCH EFFECT ON HERO NAME ───────────────────────────
const nameWords = document.querySelectorAll('.name-word');
nameWords.forEach(w => {
  w.setAttribute('data-text', w.textContent);
});

// ─── CONTACT FORM ─────────────────────────────────────────
const form = document.getElementById('cForm');
const fBtn = document.getElementById('fBtn');
if(form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    fBtn.innerHTML = '<i class="ri-check-double-line"></i> Message Sent!';
    fBtn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    fBtn.style.color = '#fff';
    fBtn.style.boxShadow = '0 0 30px rgba(34,197,94,.4)';
    setTimeout(() => {
      fBtn.innerHTML = '<i class="ri-send-plane-fill"></i> Send Message';
      fBtn.style.background = '';
      fBtn.style.color = '';
      fBtn.style.boxShadow = '';
      form.reset();
    }, 3000);
  });
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('nav-active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: .4 });
sections.forEach(s => secObs.observe(s));

// ─── FLOATING ORBS (ambient bg) ───────────────────────────
function createOrbs() {
  const orbContainer = document.getElementById('orbContainer');
  if(!orbContainer) return;
  const colors = ['rgba(194,164,255,.12)','rgba(139,92,246,.1)','rgba(236,72,153,.08)','rgba(6,182,212,.07)'];
  colors.forEach((clr, i) => {
    const orb = document.createElement('div');
    orb.className = 'ambient-orb';
    orb.style.cssText = `background:${clr};animation-delay:${i*3}s;animation-duration:${18+i*4}s;left:${10+i*22}%;top:${15+i*18}%;width:${300+i*100}px;height:${300+i*100}px;`;
    orbContainer.appendChild(orb);
  });
}
createOrbs();

// ─── SECTION NUMBER PARALLAX ──────────────────────────────
window.addEventListener('scroll', () => {
  document.querySelectorAll('.sec-bg-num').forEach(el => {
    const rect = el.closest('section').getBoundingClientRect();
    const progress = -rect.top / window.innerHeight;
    el.style.transform = `translateY(${progress * 40}px)`;
  });
});

// ─── PROJECT CARD HOVER GLOW ──────────────────────────────
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left)/r.width*100).toFixed(1);
    const y = ((e.clientY - r.top)/r.height*100).toFixed(1);
    card.style.setProperty('--gx', x + '%');
    card.style.setProperty('--gy', y + '%');
  });
});

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── TECH PILL STAGGER REVEAL ─────────────────────────────
const pillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.querySelectorAll('.tech-pill').forEach((pill, i) => {
        setTimeout(() => pill.classList.add('pill-visible'), i * 60);
      });
      pillObs.unobserve(entry.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.cat-pills').forEach(g => pillObs.observe(g));

// ─── SKILL CARD TOGGLE ──────────────────────────────────────
document.querySelectorAll('.sc-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.parentElement;
    card.classList.toggle('active');
  });
});
