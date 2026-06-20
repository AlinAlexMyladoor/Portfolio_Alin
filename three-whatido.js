// ═══════════════════════════════════════════════════════════
//  THREE.JS "WHAT I DO" SCENE — Minimalist 3D Laptop/Desk
// ═══════════════════════════════════════════════════════════

(function initWhatIDoScene() {
  const wrap = document.querySelector('.whatido-3d');
  if (!wrap || typeof THREE === 'undefined') return;

  // ── Scene Setup ──────────────────────────────────────────
  const W = wrap.offsetWidth || 400;
  const H = wrap.offsetHeight || 400;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  wrap.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(2, 3, 5);
  camera.lookAt(0, 0, 0);

  // ── Lighting ─────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const dirLight = new THREE.DirectionalLight(0xc2a4ff, 1.5);
  dirLight.position.set(5, 5, 2);
  scene.add(dirLight);
  
  const fillLight = new THREE.PointLight(0xff55b3, 1.5, 10);
  fillLight.position.set(-3, 1, 3);
  scene.add(fillLight);

  // ── Build Laptop / Desk ──────────────────────────────────
  const group = new THREE.Group();

  // Material setup
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3, metalness: 0.8 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1, emissive: 0x3a0ca3, emissiveIntensity: 0.5 });
  const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

  // Laptop Base
  const baseGeo = new THREE.BoxGeometry(2, 0.1, 1.5);
  const base = new THREE.Mesh(baseGeo, darkMat);
  base.position.y = -0.05;
  group.add(base);

  // Keyboard indented area
  const kbGeo = new THREE.BoxGeometry(1.8, 0.05, 0.8);
  const kb = new THREE.Mesh(kbGeo, keyboardMat);
  kb.position.set(0, 0.02, 0.1);
  group.add(kb);
  
  // Trackpad
  const tpGeo = new THREE.BoxGeometry(0.5, 0.05, 0.35);
  const tp = new THREE.Mesh(tpGeo, keyboardMat);
  tp.position.set(0, 0.02, 0.8 - 0.1); // Move to the front edge
  group.add(tp);

  // Screen
  const screenGroup = new THREE.Group();
  screenGroup.position.set(0, 0, -0.7); // Pivot point at the back edge
  screenGroup.rotation.x = Math.PI / 6; // Angled open

  const lidGeo = new THREE.BoxGeometry(2, 1.3, 0.05);
  const lid = new THREE.Mesh(lidGeo, darkMat);
  lid.position.y = 0.65;
  screenGroup.add(lid);

  const displayGeo = new THREE.BoxGeometry(1.9, 1.1, 0.01);
  const display = new THREE.Mesh(displayGeo, screenMat);
  display.position.set(0, 0.65, 0.03);
  screenGroup.add(display);

  group.add(screenGroup);

  // Floating code elements coming out of screen
  const codeGeo = new THREE.BoxGeometry(0.2, 0.05, 0.01);
  const codeMat = new THREE.MeshBasicMaterial({ color: 0xc2a4ff });
  const codeBlocks = [];
  
  for(let i=0; i<5; i++) {
    const b = new THREE.Mesh(codeGeo, codeMat);
    b.position.set((Math.random()-0.5)*1.5, 0.65 + Math.random(), (Math.random()) * 2);
    b.userData = { 
      speed: Math.random() * 0.02 + 0.01,
      offset: Math.random() * Math.PI * 2
    };
    group.add(b);
    codeBlocks.push(b);
  }

  // Floating Coffee Cup
  const cupGroup = new THREE.Group();
  cupGroup.position.set(1.5, 0.2, 0.5);
  
  const cupGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.3, 16);
  const cupMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const cup = new THREE.Mesh(cupGeo, cupMat);
  cupGroup.add(cup);
  
  const smokeGeo = new THREE.TorusGeometry(0.08, 0.02, 8, 16);
  const smokeMat = new THREE.MeshBasicMaterial({ color: 0xc2a4ff, transparent: true, opacity: 0.4 });
  const smoke1 = new THREE.Mesh(smokeGeo, smokeMat);
  smoke1.position.y = 0.3;
  smoke1.rotation.x = Math.PI/2;
  cupGroup.add(smoke1);
  
  group.add(cupGroup);

  // Center group
  group.position.y = -0.5;
  scene.add(group);

  // ── Mouse tracking ───────────────────────────────────────
  let targetRotY = 0;
  let currentRotY = 0;
  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetRotY = nx * 0.5;
  });

  // ── Resize ───────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const nW = wrap.offsetWidth;
    const nH = wrap.offsetHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });

  // ── Animation Loop ───────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    // Smooth rotate
    currentRotY += (targetRotY - currentRotY) * 0.05;
    group.rotation.y = currentRotY - Math.PI / 6; // Default angled slightly
    group.rotation.x = Math.sin(t * 0.5) * 0.05;
    group.position.y = -0.5 + Math.sin(t) * 0.1;

    // Animate code blocks
    codeBlocks.forEach((b, i) => {
      b.position.y += b.userData.speed;
      b.position.x += Math.sin(t * 2 + b.userData.offset) * 0.01;
      b.material.opacity = 1 - (b.position.y / 2);
      b.material.transparent = true;
      if(b.position.y > 2) {
        b.position.y = 0.5;
        b.position.z = 0.2 + Math.random() * 0.5;
        b.position.x = (Math.random()-0.5)*1.5;
      }
    });

    // Animate smoke
    smoke1.position.y = 0.3 + Math.sin(t * 2) * 0.1;
    smoke1.scale.setScalar(1 + Math.sin(t * 2) * 0.2);
    smoke1.material.opacity = 0.4 - Math.sin(t * 2) * 0.2;

    renderer.render(scene, camera);
  }
  animate();
})();
