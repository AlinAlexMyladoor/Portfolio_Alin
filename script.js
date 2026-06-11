// ── LOADER ────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initAnimations();
  }, 2200);
});

// ── CANVAS PARTICLES ──────────────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.8 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// connections
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // subtle gradient bg
  const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width * 0.7);
  grad.addColorStop(0, 'rgba(10,15,46,0.4)');
  grad.addColorStop(1, 'rgba(5,8,22,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ── CUSTOM CURSOR ────────────────────────────────
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  trail.style.left = mx + 'px';
  trail.style.top = my + 'px';
});

document.querySelectorAll('a,button,.glass-card,.project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; cursor.style.background = 'var(--accent2)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = 'var(--accent)'; });
});

// ── NAVBAR SCROLL ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// ── TYPED EFFECT ─────────────────────────────────
const roles = [
  'Backend Engineer 🚀',
  'Full-Stack Developer 💻',
  'Open Source Enthusiast 🐧',
  'SIH\'25 Finalist 🏆',
  'Django | Spring | Go ⚡',
];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = roles[ri];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++ci);
    if (ci === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ── SCROLL ANIMATIONS ────────────────────────────
function initAnimations() {
  const els = document.querySelectorAll('.glass-card,.about-card,.skill-category,.project-card,.ach-card,.cert-card,.lead-item,.tl-card,.contact-item,.contact-form,.contact-info,.section-header');
  els.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // skill bars
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(b => b.classList.add('animated'));
        barObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bars').forEach(s => barObserver.observe(s));
}

// ── CONTACT FORM ─────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('sendBtn');
  btn.textContent = '✅ Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
  setTimeout(() => {
    btn.textContent = 'Send Message 🚀';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// ── HAMBURGER ────────────────────────────────────
document.getElementById('hamburger').addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  if (links.style.display === 'flex') {
    links.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:70px;left:0;width:100%;background:rgba(5,8,22,.98);padding:2rem;gap:1.5rem;border-bottom:1px solid rgba(255,255,255,.08)';
  }
});

// ── 3D CARD TILT ─────────────────────────────────
document.querySelectorAll('.project-card,.about-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * 8;
    const rotX = -((y - cy) / cy) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── GLOWING ORB FOLLOW ────────────────────────────
const orb = document.createElement('div');
orb.style.cssText = 'position:fixed;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%);pointer-events:none;z-index:0;transition:left .8s ease,top .8s ease;transform:translate(-50%,-50%)';
document.body.appendChild(orb);
document.addEventListener('mousemove', e => {
  orb.style.left = e.clientX + 'px';
  orb.style.top = e.clientY + 'px';
});

// ── SMOOTH SCROLL FOR NAV ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    // close mobile menu
    const links = document.querySelector('.nav-links');
    if (window.innerWidth < 900) links.style.display = 'none';
  });
});
