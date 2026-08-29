import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import { useLoading } from "../context/LoadingProvider";
import { setProgress } from "./Loading";
import * as THREE from "three";

// The actual 3D Mesh
const AICore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Mouse tracking
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Cache nodes outside useFrame for performance
  const nodes = useRef<{ hero: HTMLElement | null, about: HTMLElement | null, what: HTMLElement | null }>({ hero: null, about: null, what: null });

  useEffect(() => {
    nodes.current = {
      hero: document.querySelector(".landing-section"),
      about: document.querySelector(".about-section"),
      what: document.querySelector(".whatIDO")
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // --- IDLE ANIMATIONS ---
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x += delta * 0.1;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x += delta * (0.15 + i * 0.05);
        ring.rotation.y += delta * (0.2 + i * 0.08);
      });
    }
    if (fragmentsRef.current) {
      fragmentsRef.current.rotation.y += delta * 0.1;
      fragmentsRef.current.rotation.z += delta * 0.05;
    }

    // --- SCROLL TARGETING ---
    const { hero: heroNode, about: aboutNode, what: whatIDoNode } = nodes.current;

    let targetX = 0;
    let targetY = 0; 
    let targetScale = 1; 

    if (heroNode && aboutNode && whatIDoNode) {
      const scrollY = window.scrollY;
      const windowHalf = window.innerHeight / 2;
      const screenCenterY = scrollY + windowHalf;

      const getCenter = (node: HTMLElement) => {
        const rect = node.getBoundingClientRect();
        return scrollY + rect.top + rect.height / 2;
      };

      const heroCenter = getCenter(heroNode);
      const aboutCenter = getCenter(aboutNode);
      const whatIDoCenter = getCenter(whatIDoNode);
      
      const whatIDoBottom = scrollY + whatIDoNode.getBoundingClientRect().bottom;

      let progressHeroToAbout = 0;
      if (screenCenterY > heroCenter && screenCenterY < aboutCenter) {
        progressHeroToAbout = (screenCenterY - heroCenter) / (aboutCenter - heroCenter);
      } else if (screenCenterY >= aboutCenter) {
        progressHeroToAbout = 1;
      }

      let progressAboutToWhat = 0;
      if (screenCenterY > aboutCenter && screenCenterY < whatIDoCenter) {
        progressAboutToWhat = (screenCenterY - aboutCenter) / (whatIDoCenter - aboutCenter);
      } else if (screenCenterY >= whatIDoCenter) {
        progressAboutToWhat = 1;
      }

      let progressPastWhatIDo = 0;
      if (screenCenterY > whatIDoBottom) {
        progressPastWhatIDo = Math.min((screenCenterY - whatIDoBottom) / 300, 1);
      }

      const isMobile = window.innerWidth < 768;
      const heroTargetX = 0; // Center-left space between the two text blocks
      const leftSideX = isMobile ? 0 : -viewport.width * 0.35; 
      const centerX = 0;

      const defaultY = 0;

      if (progressAboutToWhat > 0) {
        targetX = THREE.MathUtils.lerp(leftSideX, centerX, progressAboutToWhat);
        targetY = defaultY;
        targetScale = THREE.MathUtils.lerp(1, 1.1, progressAboutToWhat);
      } else {
        targetX = THREE.MathUtils.lerp(heroTargetX, leftSideX, progressHeroToAbout);
        targetY = defaultY;
        targetScale = 1;
      }

      // Hide the object completely if scrolled past the What I Do section
      if (progressPastWhatIDo > 0) {
        targetScale = THREE.MathUtils.lerp(targetScale, 0, progressPastWhatIDo);
      }
    }

    // Smooth damp position
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 4, delta);
    
    // Scale
    const currentScale = THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 4, delta);
    groupRef.current.scale.set(currentScale, currentScale, currentScale);

    // Subtle Cursor Interaction
    const targetRotX = mouse.current.y * 0.3;
    const targetRotY = mouse.current.x * 0.3;

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX + Math.sin(state.clock.elapsedTime * 0.5) * 0.1, 2, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 2, delta);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Bright Glowing Center Starburst */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.06, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
          <pointLight color="#b300ff" intensity={8} distance={10} />
          <pointLight color="#ff00ff" intensity={6} distance={5} />
        </mesh>

        {/* Orbital Glass Rings */}
        <group ref={ringsRef}>
          {/* Thick Main Glass Ring */}
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[1.1, 0.2, 64, 128]} />
            <MeshTransmissionMaterial 
              backside 
              thickness={2} 
              roughness={0.02} 
              transmission={1} 
              ior={1.5} 
              chromaticAberration={0.2} 
              color="#4a0080"
              clearcoat={1}
            />
          </mesh>
          
          {/* Thin Intersecting Glass Rings */}
          <mesh rotation={[Math.PI / 2, -Math.PI / 4, 0]}>
            <torusGeometry args={[1.3, 0.02, 32, 100]} />
            <MeshTransmissionMaterial thickness={0.5} roughness={0.05} transmission={1} ior={1.4} color="#df99ff" />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, Math.PI / 3]}>
            <torusGeometry args={[1.4, 0.015, 32, 100]} />
            <MeshTransmissionMaterial thickness={0.5} roughness={0.05} transmission={1} ior={1.4} color="#ff66ff" />
          </mesh>
        </group>

        {/* Floating Fragments */}
        <group ref={fragmentsRef}>
          {[...Array(15)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <octahedronGeometry args={[Math.random() * 0.08 + 0.04, 0]} />
              <MeshTransmissionMaterial 
                thickness={1} 
                roughness={0.05} 
                transmission={1} 
                ior={1.5}
                color="#df99ff"
                chromaticAberration={0.1}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};

const Premium3DObject = () => {
  const location = useLocation();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (location.pathname !== "/") return;
    
    // Simulate loading progress for the UI
    const { loaded, clear } = setProgress(setLoading);
    
    // Fake load completion after a short delay since our 3D model is lightweight
    const timeout = setTimeout(() => {
      clear();
      loaded();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [location.pathname, setLoading]);

  // ONLY render the 3D object on the home page route
  if (location.pathname !== "/") return null;

  return (
    <div 
      className="premium-3d-model"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1, // Above background, below main text (which is usually > 5)
        pointerEvents: "none" // Extremely important: never block existing UI interactions
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        <AICore />
      </Canvas>
    </div>
  );
};

export default Premium3DObject;
