// ═══════════════════════════════════════════════════════════
//  THREE.JS 3D HERO SCENE — Alin Alex Portfolio
//  Floating 3D avatar orb with mouse interactivity
// ═══════════════════════════════════════════════════════════

(function initThreeScene() {
  'use strict';

  const wrap = document.getElementById('hero3dWrap');
  if (!wrap || typeof THREE === 'undefined') return;

  // ── Scene Setup ──────────────────────────────────────────
  const W = wrap.offsetWidth  || 400;
  const H = wrap.offsetHeight || 500;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  wrap.insertBefore(renderer.domElement, wrap.firstChild);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 5);

  // ── Lighting ─────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Main purple point light (the glow behind the head)
  const purpleLight = new THREE.PointLight(0xa87cff, 4, 10);
  purpleLight.position.set(0, 0, -1);
  scene.add(purpleLight);

  // Rim light from top-left
  const rimLight = new THREE.DirectionalLight(0xc2a4ff, 2);
  rimLight.position.set(-3, 3, 2);
  scene.add(rimLight);

  // Front soft white
  const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
  frontLight.position.set(1, 1, 5);
  scene.add(frontLight);

  // ── Materials ────────────────────────────────────────────
  // Ceramic/porcelain-like material for the head body
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xe8e0f0,
    roughness: 0.3,
    metalness: 0.1,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x1a0a2e,
    roughness: 0.6,
    metalness: 0.2,
  });

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x6040c0,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x3020a0,
    emissiveIntensity: 0.3,
  });

  // ── Build Avatar ─────────────────────────────────────────
  const avatar = new THREE.Group();

  // Head (main sphere)
  const headGeo  = new THREE.SphereGeometry(1, 64, 64);
  const head     = new THREE.Mesh(headGeo, bodyMat);
  head.castShadow = true;
  avatar.add(head);

  // Hair block on top
  const hairGeo  = new THREE.SphereGeometry(1.02, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const hair     = new THREE.Mesh(hairGeo, accentMat);
  hair.position.y = 0.05;
  avatar.add(hair);

  // Hair front tuft
  const tuftGeo  = new THREE.SphereGeometry(0.35, 32, 32);
  const tuft     = new THREE.Mesh(tuftGeo, accentMat);
  tuft.position.set(0, 0.85, 0.75);
  tuft.scale.set(1, 0.5, 0.6);
  avatar.add(tuft);

  // Left eye
  const eyeGeo = new THREE.SphereGeometry(0.13, 32, 32);
  const eyeL   = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.33, 0.1, 0.93);
  avatar.add(eyeL);

  // Right eye
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.33, 0.1, 0.93);
  avatar.add(eyeR);

  // Eye whites
  const eWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const eWhiteGeo = new THREE.SphereGeometry(0.18, 32, 32);
  const ewL = new THREE.Mesh(eWhiteGeo, eWhiteMat);
  ewL.position.set(-0.33, 0.1, 0.88);
  ewL.scale.set(1, 0.8, 0.4);
  avatar.add(ewL);
  const ewR = new THREE.Mesh(eWhiteGeo, eWhiteMat);
  ewR.position.set(0.33, 0.1, 0.88);
  ewR.scale.set(1, 0.8, 0.4);
  avatar.add(ewR);

  // Nose
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xd4c8e0, roughness: 0.5 });
  const noseGeo = new THREE.SphereGeometry(0.1, 32, 32);
  const nose    = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, -0.12, 0.98);
  nose.scale.set(1.1, 0.8, 0.7);
  avatar.add(nose);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.2, 32, 32);
  const earL   = new THREE.Mesh(earGeo, bodyMat);
  earL.position.set(-1.0, 0.05, 0.0);
  earL.scale.set(0.5, 0.7, 0.5);
  avatar.add(earL);
  const earR = new THREE.Mesh(earGeo, bodyMat);
  earR.position.set(1.0, 0.05, 0.0);
  earR.scale.set(0.5, 0.7, 0.5);
  avatar.add(earR);

  // Neck
  const neckGeo  = new THREE.CylinderGeometry(0.28, 0.32, 0.5, 32);
  const neck     = new THREE.Mesh(neckGeo, bodyMat);
  neck.position.y = -1.2;
  avatar.add(neck);

  // Collar/shirt top
  const shirtGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.4, 32);
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf0ecf8, roughness: 0.6 });
  const shirt    = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.y = -1.7;
  avatar.add(shirt);

  // Eyebrows
  const browMat = new THREE.MeshStandardMaterial({ color: 0x1a0a2e, roughness: 0.8 });
  const browGeo = new THREE.BoxGeometry(0.28, 0.04, 0.06);
  const browL   = new THREE.Mesh(browGeo, browMat);
  browL.position.set(-0.33, 0.33, 0.96);
  browL.rotation.z = 0.1;
  avatar.add(browL);
  const browR = new THREE.Mesh(browGeo, browMat);
  browR.position.set(0.33, 0.33, 0.96);
  browR.rotation.z = -0.1;
  avatar.add(browR);

  avatar.position.y = -0.3;
  scene.add(avatar);

  // ── Floating Particles around avatar ─────────────────────
  const particleCount = 120;
  const partGeo  = new THREE.BufferGeometry();
  const partPos  = new Float32Array(particleCount * 3);
  const partSpeeds = [];
  for (let i = 0; i < particleCount; i++) {
    const r = 1.8 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.random() * Math.PI;
    partPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    partPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    partPos[i*3+2] = r * Math.cos(phi);
    partSpeeds.push({ theta: Math.random() * 0.005 + 0.002, phi: (Math.random() - 0.5) * 0.003, r });
  }
  partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0xc2a4ff, size: 0.04, transparent: true, opacity: 0.7, sizeAttenuation: true
  });
  const particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // ── Glow Ring ────────────────────────────────────────────
  const ringGeo = new THREE.TorusGeometry(1.6, 0.012, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.5 });
  const ring    = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.3;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.006, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x6040c0, transparent: true, opacity: 0.25 })
  );
  ring2.rotation.x = Math.PI / 2.5;
  ring2.position.y = -0.3;
  scene.add(ring2);

  // ── Mouse tracking ───────────────────────────────────────
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  document.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = nx * 0.35;
    targetRotX = ny * 0.2;
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
  const clock = new THREE.Clock();
  let partThetas = [];
  for (let i = 0; i < particleCount; i++) partThetas.push(Math.random() * Math.PI * 2);

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    currentRotY += (targetRotY - currentRotY) * 0.05;
    currentRotX += (targetRotX - currentRotX) * 0.05;
    avatar.rotation.y = currentRotY;
    avatar.rotation.x = currentRotX;

    // Floating bob
    avatar.position.y = -0.3 + Math.sin(t * 0.8) * 0.08;

    // Eye blink every ~4s
    const blink = Math.abs(Math.sin(t * 0.8)) < 0.05 ? 0.05 : 1;
    ewL.scale.y = blink * 0.8;
    ewR.scale.y = blink * 0.8;
    eyeL.scale.y = blink;
    eyeR.scale.y = blink;

    // Particle orbit
    const positions = particles.geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      const spd = partSpeeds[i];
      partThetas[i] += spd.theta;
      const r = spd.r;
      positions.array[i*3]   = r * Math.cos(partThetas[i]);
      positions.array[i*3+1] = r * Math.sin(partThetas[i] * 0.4) * 0.6;
      positions.array[i*3+2] = r * Math.sin(partThetas[i]);
    }
    positions.needsUpdate = true;

    // Pulse rings
    ring.rotation.z  = t * 0.3;
    ring2.rotation.z = -t * 0.15;
    ring.material.opacity  = 0.3 + Math.sin(t * 1.5) * 0.15;
    ring2.material.opacity = 0.15 + Math.sin(t * 1.2 + 1) * 0.1;

    // Pulse purple light
    purpleLight.intensity = 3 + Math.sin(t * 1.8) * 1.2;

    renderer.render(scene, camera);
  }
  animate();
})();
