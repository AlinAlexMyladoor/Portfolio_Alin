import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import { useLoading } from "../context/LoadingProvider";
import { setProgress } from "./Loading";
import * as THREE from "three";

// Pre-calculate random fragments so they don't jump around (refresh) on re-renders
const fragmentsData = Array.from({ length: 15 }).map(() => ({
  position: [
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4
  ] as [number, number, number],
  rotation: [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ] as [number, number, number],
  size: Math.random() * 0.08 + 0.04
}));

// The actual 3D Mesh
const AICore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  const { viewport, invalidate } = useThree();
  const isMobile = window.innerWidth < 768;

  // Mouse tracking
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      // ONLY wake up the 3D renderer if the model is actually on screen!
      if (!layoutCache.current.initialized || window.scrollY < layoutCache.current.whatBottom + 200) {
        invalidate(); 
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [invalidate]);

  // Invalidate on scroll so the 3D object moves with scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!layoutCache.current.initialized || window.scrollY < layoutCache.current.whatBottom + 200) {
        invalidate();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [invalidate]);

  // Cache layout dimensions to prevent severe layout thrashing (lag) on scroll
  const layoutCache = useRef({
    heroCenter: 0,
    aboutCenter: 0,
    whatCenter: 0,
    whatBottom: 0,
    initialized: false
  });

  useEffect(() => {
    const updateCache = () => {
      const heroNode = document.querySelector(".landing-section") as HTMLElement;
      const aboutNode = document.querySelector(".about-section") as HTMLElement;
      const whatNode = document.querySelector(".whatIDO") as HTMLElement;
      
      if (heroNode && aboutNode && whatNode) {
        const getAbsTop = (node: HTMLElement) => {
          let top = 0;
          let el: HTMLElement | null = node;
          while (el) {
            top += el.offsetTop;
            el = el.offsetParent as HTMLElement;
          }
          return top;
        };
        
        const heroTop = getAbsTop(heroNode);
        const aboutTop = getAbsTop(aboutNode);
        const whatTop = getAbsTop(whatNode);

        layoutCache.current = {
          heroCenter: heroTop + heroNode.offsetHeight / 2,
          aboutCenter: aboutTop + aboutNode.offsetHeight / 2,
          whatCenter: whatTop + whatNode.offsetHeight / 2,
          whatBottom: whatTop + whatNode.offsetHeight,
          initialized: true
        };
      }
    };

    // Delay slightly to let DOM render
    const t = setTimeout(updateCache, 1000);
    window.addEventListener("resize", updateCache);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateCache);
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

    // We will conditionally call invalidate() at the end of the frame instead
    // --- SCROLL TARGETING ---
    const cache = layoutCache.current;
    
    let targetX = 0;
    let targetY = 0; 
    let targetScale = 1; 

    if (cache.initialized) {
      const scrollY = window.scrollY;
      const windowHalf = window.innerHeight / 2;
      const screenCenterY = scrollY + windowHalf;

      const { heroCenter, aboutCenter, whatCenter, whatBottom } = cache;

      let progressHeroToAbout = 0;
      if (screenCenterY > heroCenter && screenCenterY < aboutCenter) {
        progressHeroToAbout = (screenCenterY - heroCenter) / (aboutCenter - heroCenter);
      } else if (screenCenterY >= aboutCenter) {
        progressHeroToAbout = 1;
      }

      let progressAboutToWhat = 0;
      if (screenCenterY > aboutCenter && screenCenterY < whatCenter) {
        progressAboutToWhat = (screenCenterY - aboutCenter) / (whatCenter - aboutCenter);
      } else if (screenCenterY >= whatCenter) {
        progressAboutToWhat = 1;
      }

      let progressPastWhatIDo = 0;
      if (screenCenterY > whatBottom) {
        progressPastWhatIDo = Math.min((screenCenterY - whatBottom) / 300, 1);
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

    // CRITICAL PERF FIX: Stop rendering if the object is effectively invisible (scaled down to 0)
    if (currentScale < 0.005 && targetScale === 0) {
      groupRef.current.visible = false;
    } else {
      groupRef.current.visible = true;
      invalidate(); // Only render frames if the object is actually visible
    }
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
          {/* Thick Main Glass Ring — heavily optimized */}
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[1.1, 0.2, 16, 48]} />
            <MeshTransmissionMaterial 
              backside 
              thickness={2} 
              roughness={0.05} 
              transmission={1} 
              ior={1.5} 
              color="#4a0080"
              clearcoat={0}
              resolution={128}  // Reduced: was 256
              samples={2}       // Reduced: was 4
            />
          </mesh>
          
          {/* Thin Intersecting Glass Rings - Hidden on mobile */}
          {!isMobile && (
            <>
              <mesh rotation={[Math.PI / 2, -Math.PI / 4, 0]}>
                <torusGeometry args={[1.3, 0.02, 16, 64]} />
                <MeshTransmissionMaterial thickness={0.5} roughness={0.05} transmission={1} ior={1.4} color="#df99ff" resolution={64} samples={1} />
              </mesh>
              <mesh rotation={[-Math.PI / 4, 0, Math.PI / 3]}>
                <torusGeometry args={[1.4, 0.015, 16, 64]} />
                <MeshTransmissionMaterial thickness={0.5} roughness={0.05} transmission={1} ior={1.4} color="#ff66ff" resolution={64} samples={1} />
              </mesh>
            </>
          )}
        </group>

        {/* Floating Fragments - Hidden on mobile, limited count on desktop */}
        {!isMobile && (
          <group ref={fragmentsRef}>
            {fragmentsData.slice(0, 8).map((data, i) => (  // Reduced: was 15, now 8
            <mesh 
              key={i} 
              position={data.position}
              rotation={data.rotation}
            >
              <octahedronGeometry args={[data.size, 0]} />
              <MeshTransmissionMaterial 
                thickness={1} 
                roughness={0.05} 
                transmission={1} 
                ior={1.5}
                color="#df99ff"
                resolution={32}  // Reduced: was 64
                samples={1}      // Reduced: was 2
              />
            </mesh>
          ))}
        </group>
        )}
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
      <Canvas 
        style={{ pointerEvents: "none" }}
        camera={{ position: [0, 0, 5], fov: 45 }} 
        dpr={[0.8, 1]}          // Adaptive: cap at 1x, allow down to 0.8x
        frameloop="demand"      // Only render when invalidate() is called — no idle GPU burn
        performance={{ min: 0.5 }} // Allow Three.js to drop DPR if FPS falls
        gl={{ 
          antialias: false,     // Disable MSAA — huge perf win with little visual diff
          powerPreference: "low-power" // Tell GPU to prefer battery/cool over performance
        }}
      >
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        <AICore />
      </Canvas>
    </div>
  );
};

export default Premium3DObject;
