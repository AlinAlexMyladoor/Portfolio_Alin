
// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
const loadingScreen = document.getElementById('loadingScreen');
const loadingWrap   = document.getElementById('loadingWrap');
const loadingBtn    = document.getElementById('loadingBtn');
const loadPct       = document.getElementById('loadPct');
const loadingCont   = document.getElementById('loadingContainer');
const loadCont2     = document.getElementById('loadingContent2');
const mainBody      = document.getElementById('mainBody');

// Generate game lines
const gameLinesEl = document.getElementById('gameLines');
for(let i=0;i<27;i++){
  const d=document.createElement('div');
  d.className='loaderGame-line';
  gameLinesEl.appendChild(d);
}

// Mouse hover effect on loading wrap
loadingWrap.addEventListener('mousemove',e=>{
  const r=loadingWrap.getBoundingClientRect();
  loadingWrap.style.setProperty('--mouse-x',(e.clientX-r.left)+'px');
  loadingWrap.style.setProperty('--mouse-y',(e.clientY-r.top)+'px');
});

let pct=0;
const fast=setInterval(()=>{
  pct+=Math.floor(Math.random()*12)+4;
  if(pct>=92){clearInterval(fast);pct=92;}
  loadPct.textContent=pct+'%';
},80);

// Simulate fully loaded
window.addEventListener('load',()=>{
  setTimeout(()=>{
    clearInterval(fast);
    const finish=setInterval(()=>{
      pct++;
      loadPct.textContent=pct+'%';
      if(pct>=100){
        clearInterval(finish);
        loadingBtn.classList.add('loading-complete');
        setTimeout(()=>{
          loadingWrap.classList.add('clicked');
          setTimeout(()=>{
            loadingScreen.style.opacity='0';
            loadingScreen.style.pointerEvents='none';
            mainBody.style.opacity='1';
            mainBody.style.pointerEvents='auto';
            mainBody.style.transition='opacity .6s ease';
            document.body.style.overflow='auto';
            initReveal();
            initCounters();
            initTilt();
          },900);
        },700);
      }
    },15);
  },400);
});

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled',window.scrollY>60);
});

// Mobile menu
const navBurger=document.getElementById('navBurger');
const mobileNav=document.getElementById('mobileNav');
const mobileClose=document.getElementById('mobileClose');
navBurger.addEventListener('click',()=>{mobileNav.classList.add('open');document.body.style.overflow='hidden';});
mobileClose.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.style.overflow='auto';});
document.querySelectorAll('.mobile-link').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.style.overflow='auto';}));

// ─── HERO CANVAS ──────────────────────────────────────────────────────────────
const hCanvas=document.getElementById('heroCanvas');
const hCtx=hCanvas.getContext('2d');
let HW,HH,pts=[];
function resizeHero(){HW=hCanvas.width=hCanvas.offsetWidth;HH=hCanvas.height=hCanvas.offsetHeight;}
resizeHero();
window.addEventListener('resize',resizeHero);

class Pt{
  constructor(){this.reset();}
  reset(){this.x=Math.random()*HW;this.y=Math.random()*HH;this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.4;this.r=Math.random()*1.5+.5;this.a=Math.random()*.4+.1;}
  update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>HW)this.vx*=-1;if(this.y<0||this.y>HH)this.vy*=-1;}
  draw(){hCtx.beginPath();hCtx.arc(this.x,this.y,this.r,0,Math.PI*2);hCtx.fillStyle=`rgba(194,164,255,${this.a})`;hCtx.fill();}
}
for(let i=0;i<60;i++)pts.push(new Pt());
function animHero(){
  hCtx.clearRect(0,0,HW,HH);
  pts.forEach(p=>{p.update();p.draw();});
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<130){hCtx.beginPath();hCtx.strokeStyle=`rgba(194,164,255,${.1*(1-d/130)})`;hCtx.lineWidth=.8;hCtx.moveTo(pts[i].x,pts[i].y);hCtx.lineTo(pts[j].x,pts[j].y);hCtx.stroke();}
  }
  requestAnimationFrame(animHero);
}
animHero();

// ─── STACK CANVAS ─────────────────────────────────────────────────────────────
const sCanvas=document.getElementById('stackCanvas');
if(sCanvas){
  const sCtx=sCanvas.getContext('2d');
  let SW,SH,spts=[];
  function resizeStack(){SW=sCanvas.width=sCanvas.offsetWidth;SH=sCanvas.height=sCanvas.offsetHeight;}
  resizeStack();window.addEventListener('resize',resizeStack);
  class SPt{constructor(){this.x=Math.random()*SW;this.y=Math.random()*SH;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.r=Math.random()*1.8+.5;this.a=Math.random()*.25+.05;}
  update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>SW)this.vx*=-1;if(this.y<0||this.y>SH)this.vy*=-1;}
  draw(){sCtx.beginPath();sCtx.arc(this.x,this.y,this.r,0,Math.PI*2);sCtx.fillStyle=`rgba(194,164,255,${this.a})`;sCtx.fill();}}
  for(let i=0;i<80;i++)spts.push(new SPt());
  function animStack(){sCtx.clearRect(0,0,SW,SH);spts.forEach(p=>{p.update();p.draw();});requestAnimationFrame(animStack);}
  animStack();
}

// ─── TYPED EFFECT ─────────────────────────────────────────────────────────────
const roles=['Backend Engineer','Full-Stack Developer','Go · Django · Spring','System Architect'];
let rIdx=0,cIdx=0,isDel=false;
const typedEl=document.getElementById('typedText');
function typeEffect(){
  const cur=roles[rIdx];
  typedEl.textContent=isDel?cur.substring(0,cIdx-1):cur.substring(0,cIdx+1);
  isDel?cIdx--:cIdx++;
  let spd=isDel?40:80;
  if(!isDel&&cIdx===cur.length){spd=2000;isDel=true;}
  else if(isDel&&cIdx===0){isDel=false;rIdx=(rIdx+1)%roles.length;spd=400;}
  setTimeout(typeEffect,spd);
}
setTimeout(typeEffect,1200);

// ─── REVEAL ON SCROLL ─────────────────────────────────────────────────────────
function initReveal(){
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

// ─── COUNTERS ─────────────────────────────────────────────────────────────────
function initCounters(){
  document.querySelectorAll('.hstat-num').forEach(el=>{
    const target=+el.getAttribute('data-to');
    let cur=0;const inc=target/35;
    const t=setInterval(()=>{cur+=inc;if(cur>=target){cur=target;clearInterval(t);}el.textContent=Math.ceil(cur);},35);
  });
}

// ─── 3D TILT ──────────────────────────────────────────────────────────────────
function initTilt(){
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=e.clientX-r.left,y=e.clientY-r.top;
      const rx=((y-r.height/2)/r.height)*-6;
      const ry=((x-r.width/2)/r.width)*6;
      card.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';});
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
const form=document.getElementById('cForm');
const fBtn=document.getElementById('fBtn');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    fBtn.innerHTML='<i class="ri-check-double-line"></i> Message Sent!';
    fBtn.style.background='linear-gradient(135deg,#22c55e,#16a34a)';
    fBtn.style.color='#fff';
    setTimeout(()=>{fBtn.innerHTML='<i class="ri-send-plane-fill"></i> Send Message';fBtn.style.background='';fBtn.style.color='';form.reset();},3000);
  });
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────────────────────────
const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.nav-links a');
const secObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>{a.style.color=a.getAttribute('href')==='#'+e.target.id?'var(--fg)':'var(--muted)';});}});},{threshold:.4});
sections.forEach(s=>secObs.observe(s));
