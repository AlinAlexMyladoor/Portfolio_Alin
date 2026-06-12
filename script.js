// LOADER
const ldPct = document.getElementById('ldPct');
let pct = 0;
const ldInt = setInterval(() => {
  pct += Math.floor(Math.random() * 15) + 5;
  if(pct >= 100) {
    pct = 100;
    clearInterval(ldInt);
    setTimeout(() => {
      document.getElementById('loader').classList.add('done');
      initReveal();
      initCounters();
    }, 500);
  }
  ldPct.textContent = pct + '%';
}, 150);

// CUSTOM CURSOR
const cur = document.getElementById('cur');
const curRing = document.getElementById('curRing');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
  curRing.style.left = e.clientX + 'px';
  curRing.style.top = e.clientY + 'px';
});

const interactiveElements = document.querySelectorAll('a, button, .proj-card, .exp-card, .award-card, .tech-pill, .cert-card');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    curRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
    curRing.style.borderColor = 'var(--p2)';
    cur.style.background = 'var(--p2)';
  });
  el.addEventListener('mouseleave', () => {
    curRing.style.transform = 'translate(-50%, -50%) scale(1)';
    curRing.style.borderColor = 'rgba(167, 139, 250, 0.4)';
    cur.style.background = '#fff';
  });
});

// CANVAS BACKGROUND
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 0.5;
    const colors = ['rgba(124, 58, 237, ', 'rgba(6, 182, 212, ', 'rgba(236, 72, 153, '];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if(this.x < 0 || this.x > W) this.vx *= -1;
    if(this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  }
}

for(let i = 0; i < 70; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  for(let i=0; i<particles.length; i++) {
    for(let j=i+1; j<particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if(dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - dist/120)})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// NAV & MOBILE MENU
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if(window.scrollY > 50) nav.classList.add('stuck');
  else nav.classList.remove('stuck');
});

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  const isActive = mobileMenu.classList.contains('active');
  burger.innerHTML = isActive ? '<i class="ri-close-line"></i>' : '<i class="ri-menu-3-line"></i>';
});

window.closeMobile = function() {
  mobileMenu.classList.remove('active');
  burger.innerHTML = '<i class="ri-menu-3-line"></i>';
}

// TYPED EFFECT
const roles = ['Backend Engineer', 'Full-Stack Developer', 'Go · Django · Spring', 'System Architect'];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed');

function typeEffect() {
  const currentRole = roles[roleIdx];
  if(isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typedEl.textContent = currentRole.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 40 : 80;

  if(!isDeleting && charIdx === currentRole.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if(isDeleting && charIdx === 0) {
    isDeleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    typeSpeed = 500;
  }

  setTimeout(typeEffect, typeSpeed);
}
setTimeout(typeEffect, 1000);

// REVEAL ON SCROLL
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// NUMBER COUNTERS
function initCounters() {
  const stats = document.querySelectorAll('.hstat-n');
  stats.forEach(stat => {
    const target = +stat.getAttribute('data-to');
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
      current += increment;
      if(current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.ceil(current);
    }, 40);
  });
}

// 3D TILT EFFECT
const tiltCards = document.querySelectorAll('.proj-card, .exp-card, .award-card, .cert-card, .contact-wrap');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
  });
});

// FORM SUBMISSION
const form = document.getElementById('cForm');
const formBtn = document.getElementById('fBtn');
if(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formBtn.innerHTML = '<i class="ri-check-double-line"></i> Message Sent!';
    formBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      formBtn.innerHTML = '<i class="ri-send-plane-fill"></i> Send Message';
      formBtn.style.background = '';
      form.reset();
    }, 3000);
  });
}
