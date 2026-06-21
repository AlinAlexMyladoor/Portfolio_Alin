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
document.querySelectorAll('a, button, .tilt-card, .proj-h-card, .ts-pill').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// ─── LOADING SCREEN ───────────────────────────────────────
const loadingScreen = document.getElementById('loadingScreen');
const loaderBar     = document.getElementById('loaderBar');
const loadPct       = document.getElementById('loadPct');
const mainBody      = document.getElementById('mainBody');

let pct = 0;
const loadInterval = setInterval(() => {
  pct += Math.floor(Math.random() * 8) + 2;
  if (pct > 100) pct = 100;
  loadPct.textContent = pct + '%';
  loaderBar.style.width = pct + '%';
  
  if (pct >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      mainBody.style.opacity = '1';
      mainBody.style.pointerEvents = 'auto';
      mainBody.style.transition = 'opacity 1s ease';
      document.body.style.overflow = 'auto';
      initReveal();
      initTilt();
      initHScroll();
    }, 800);
  }
}, 60);

// ─── NAVBAR & MOBILE MENU ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

const navBurger  = document.getElementById('navBurger');
const mobileNav  = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
navBurger.addEventListener('click',  () => { mobileNav.classList.add('open'); document.body.style.overflow='hidden'; });
mobileClose.addEventListener('click',() => { mobileNav.classList.remove('open'); document.body.style.overflow='auto'; });
document.querySelectorAll('.mobile-link').forEach(a => {
  a.addEventListener('click', () => { mobileNav.classList.remove('open'); document.body.style.overflow='auto'; });
});

// ─── SCROLL PROGRESS BAR ──────────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = scrolled + '%';
});

// ─── HORIZONTAL SCROLL LOGIC ──────────────────────────────
function initHScroll() {
  const hSection = document.querySelector('.hscroll-section');
  const hTrack   = document.getElementById('hscrollTrack');
  if(!hSection || !hTrack) return;
  
  window.addEventListener('scroll', () => {
    const rect = hSection.getBoundingClientRect();
    const scrollStart = rect.top;
    const scrollEnd = rect.height - window.innerHeight;
    
    if(scrollStart <= 0 && scrollStart > -scrollEnd) {
      // Calculate how far we've scrolled inside the section
      const progress = Math.abs(scrollStart) / scrollEnd;
      const maxScroll = hTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.1; // adjust padding
      hTrack.style.transform = `translateX(-${progress * maxScroll}px)`;
    } else if (scrollStart > 0) {
      hTrack.style.transform = `translateX(0px)`;
    } else {
      const maxScroll = hTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.1;
      hTrack.style.transform = `translateX(-${maxScroll}px)`;
    }
  });
}

// ─── REVEAL ON SCROLL ─────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
  }), { threshold: .1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── 3D TILT ──────────────────────────────────────────────
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx = ((y - r.height/2) / r.height) * -15;
      const ry = ((x - r.width/2)  / r.width)  *  15;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
  });
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
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
