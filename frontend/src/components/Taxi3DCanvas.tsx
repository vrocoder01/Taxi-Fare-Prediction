import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Taxi3DCanvasProps {
  className?: string;
  speedMultiplier?: number;
}

export const Taxi3DCanvas: React.FC<Taxi3DCanvasProps> = ({
  className = '',
  speedMultiplier = 1,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070709, 0.022);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Initial safe camera position (above ground, angled toward vehicle)
    // Locked strictly with up = (0, 1, 0)
    camera.position.set(4.2, 2.4, 7.2);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5df, 2.4);
    dirLight.position.set(7, 12, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Yellow accent fill light
    const taxiAccentLight = new THREE.PointLight(0xffb800, 3.2, 14);
    taxiAccentLight.position.set(0, 3.2, 1);
    scene.add(taxiAccentLight);

    // Cool rim light from back-left
    const rimLight = new THREE.DirectionalLight(0x4080ff, 1.6);
    rimLight.position.set(-7, 6, -6);
    scene.add(rimLight);

    // 3. Create 3D Taxi Group (Locked Upright)
    const taxiGroup = new THREE.Group();
    taxiGroup.position.set(0, 0, 0);
    taxiGroup.up.set(0, 1, 0);

    // Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffb800,
      metalness: 0.25,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.8,
      roughness: 0.3,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a2233,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.65,
      transparent: true,
      opacity: 0.9,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb,
      metalness: 0.95,
      roughness: 0.1,
    });

    const wheelRubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x151619,
      roughness: 0.9,
    });

    const lightGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const tailGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff2222,
    });

    const taxiSignMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc83b,
      emissive: 0xffb800,
      emissiveIntensity: 0.85,
      roughness: 0.3,
    });

    // Lower Main Chassis Body (Resting above ground, wheels at y=0.36)
    const chassisGeo = new THREE.BoxGeometry(2.1, 0.55, 4.4);
    const chassis = new THREE.Mesh(chassisGeo, bodyMaterial);
    chassis.position.y = 0.52;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    taxiGroup.add(chassis);

    // Upper Cabin
    const cabinGeo = new THREE.BoxGeometry(1.85, 0.62, 2.3);
    const cabin = new THREE.Mesh(cabinGeo, bodyMaterial);
    cabin.position.set(0, 1.02, -0.2);
    cabin.castShadow = true;
    taxiGroup.add(cabin);

    // Front Windshield
    const windshieldGeo = new THREE.BoxGeometry(1.78, 0.56, 0.05);
    const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshield.position.set(0, 1.02, 0.96);
    windshield.rotation.x = 0.45;
    taxiGroup.add(windshield);

    // Rear Windshield
    const rearGlassGeo = new THREE.BoxGeometry(1.78, 0.52, 0.05);
    const rearGlass = new THREE.Mesh(rearGlassGeo, glassMaterial);
    rearGlass.position.set(0, 1.02, -1.36);
    rearGlass.rotation.x = -0.4;
    taxiGroup.add(rearGlass);

    // Side Windows
    const sideGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.46, 2.0), glassMaterial);
    sideGlassLeft.position.set(-0.93, 1.03, -0.2);
    taxiGroup.add(sideGlassLeft);

    const sideGlassRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.46, 2.0), glassMaterial);
    sideGlassRight.position.set(0.93, 1.03, -0.2);
    taxiGroup.add(sideGlassRight);

    // Roof TAXI Sign
    const signBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.45), darkAccentMaterial);
    signBase.position.set(0, 1.38, -0.15);
    taxiGroup.add(signBase);

    const signLight = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.22, 0.32), taxiSignMaterial);
    signLight.position.set(0, 1.5, -0.15);
    taxiGroup.add(signLight);

    // Front Grille & Bumper
    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 0.1), darkAccentMaterial);
    grille.position.set(0, 0.48, 2.22);
    taxiGroup.add(grille);

    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.16, 0.18), chromeMaterial);
    frontBumper.position.set(0, 0.3, 2.24);
    taxiGroup.add(frontBumper);

    const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.16, 0.18), chromeMaterial);
    rearBumper.position.set(0, 0.3, -2.24);
    taxiGroup.add(rearBumper);

    // Headlights (LED)
    const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.08), lightGlowMaterial);
    hlLeft.position.set(-0.72, 0.54, 2.22);
    taxiGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.08), lightGlowMaterial);
    hlRight.position.set(0.72, 0.54, 2.22);
    taxiGroup.add(hlRight);

    // Headlight Spotlights illuminating the road ahead
    const leftSpot = new THREE.SpotLight(0xfff8e7, 3.5, 22, Math.PI / 7, 0.35, 1);
    leftSpot.position.set(-0.72, 0.55, 2.3);
    leftSpot.target.position.set(-0.72, 0, 14);
    scene.add(leftSpot);
    scene.add(leftSpot.target);

    const rightSpot = new THREE.SpotLight(0xfff8e7, 3.5, 22, Math.PI / 7, 0.35, 1);
    rightSpot.position.set(0.72, 0.55, 2.3);
    rightSpot.target.position.set(0.72, 0, 14);
    scene.add(rightSpot);
    scene.add(rightSpot.target);

    // Taillights (Red LED)
    const tlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.08), tailGlowMaterial);
    tlLeft.position.set(-0.75, 0.56, -2.22);
    taxiGroup.add(tlLeft);

    const tlRight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.08), tailGlowMaterial);
    tlRight.position.set(0.75, 0.56, -2.22);
    taxiGroup.add(tlRight);

    // Side Mirrors
    const mirrorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.12), bodyMaterial);
    mirrorLeft.position.set(-1.12, 0.88, 0.7);
    taxiGroup.add(mirrorLeft);

    const mirrorRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.12), bodyMaterial);
    mirrorRight.position.set(1.12, 0.88, 0.7);
    taxiGroup.add(mirrorRight);

    // 4 Wheels Creation (Resting at road level y=0)
    const wheels: THREE.Group[] = [];
    const createWheel = (x: number, y: number, z: number) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Tire (cylinder radius 0.36 -> rests on y=0 when center is at y=0.36)
      const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, wheelRubberMaterial);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Rim
      const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.29, 12);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, chromeMaterial);
      wheelGroup.add(rim);

      taxiGroup.add(wheelGroup);
      wheels.push(wheelGroup);
    };

    createWheel(-1.05, 0.36, 1.35);  // Front-Left
    createWheel(1.05, 0.36, 1.35);   // Front-Right
    createWheel(-1.05, 0.36, -1.35); // Rear-Left
    createWheel(1.05, 0.36, -1.35);  // Rear-Right

    scene.add(taxiGroup);

    // 4. Perspective Road Plane with Moving Dashes
    const roadWidth = 8;
    const roadLength = 90;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 10, 20);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.65,
      metalness: 0.3,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, 10);
    road.receiveShadow = true;
    scene.add(road);

    // Road Dashes (Center yellow lines)
    const dashCount = 20;
    const dashGeo = new THREE.BoxGeometry(0.18, 0.02, 2.0);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffb800 });
    const dashes: THREE.Mesh[] = [];

    for (let i = 0; i < dashCount; i++) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(0, 0.02, -30 + i * 5);
      scene.add(dash);
      dashes.push(dash);
    }

    // Outer Shoulder neon lines
    const shoulderGeo = new THREE.BoxGeometry(0.08, 0.02, roadLength);
    const shoulderMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const shoulderL = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderL.position.set(-roadWidth / 2 + 0.3, 0.02, 10);
    scene.add(shoulderL);

    const shoulderR = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderR.position.set(roadWidth / 2 - 0.3, 0.02, 10);
    scene.add(shoulderR);

    // 5. Floating Dust / Speed Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = Math.random() * 6 + 0.3;
      particlePositions[i + 2] = (Math.random() - 0.5) * 50;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffb800,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Safe, Restrained Mouse Parallax
    // Mouse coords are strictly bounded to [-1, 1] and decay toward 0 when pointer leaves
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Local normalized coordinates relative to container
      const localX = (e.clientX - rect.left) / rect.width;
      const localY = (e.clientY - rect.top) / rect.height;

      // Clamp strictly within [-1, 1]
      targetMouseX = Math.max(-1, Math.min(1, localX * 2 - 1));
      targetMouseY = Math.max(-1, Math.min(1, (localY * 2 - 1) * -1));
    };

    const handlePointerLeave = () => {
      // Gently return to rest position when pointer leaves
      targetMouseX = 0;
      targetMouseY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 7. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop with Strict Orientation Protection
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for mouse interaction
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Restrained camera bounds:
      // X: [3.4, 5.0] (slight left/right perspective)
      // Y: [2.0, 2.9] (STRICTLY ABOVE ROAD LEVEL - NEVER GOES BELOW GROUND)
      // Z: [6.8, 7.6] (stable viewing distance)
      const camX = 4.2 + currentMouseX * 0.7;
      const camY = 2.4 + currentMouseY * 0.45; // Minimum is 2.4 - 0.45 = 1.95 > 0 ground!
      const camZ = 7.2 - currentMouseY * 0.3;

      camera.position.set(camX, camY, camZ);
      camera.up.set(0, 1, 0); // Lock world-up to positive Y
      camera.lookAt(0, 0.65, 0); // Always aim at car centroid

      // Subtle upright suspension bounce & very gentle yaw sway
      // NEVER rotate along X or flip Z
      taxiGroup.position.y = Math.sin(elapsedTime * 5) * 0.012;
      taxiGroup.rotation.x = 0; // Strictly locked flat on road
      taxiGroup.rotation.z = Math.sin(elapsedTime * 2.5) * 0.004; // Micro body roll
      taxiGroup.rotation.y = THREE.MathUtils.clamp(currentMouseX * 0.07, -0.12, 0.12); // Restrained steering yaw

      // Rotate wheels smoothly forward
      const wheelSpeed = delta * 18 * speedMultiplier;
      wheels.forEach((w) => {
        w.children.forEach((mesh) => {
          mesh.rotation.x += wheelSpeed;
        });
      });

      // Animate road center dashes backward to simulate forward vehicle movement
      const dashSpeed = delta * 24 * speedMultiplier;
      dashes.forEach((dash) => {
        dash.position.z -= dashSpeed;
        if (dash.position.z < -30) {
          dash.position.z += dashCount * 5;
        }
      });

      // Animate particle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 2; i < particleCount * 3; i += 3) {
        positions[i] -= dashSpeed * 0.65;
        if (positions[i] < -25) {
          positions[i] = 25;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Thorough Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      chassisGeo.dispose();
      cabinGeo.dispose();
      windshieldGeo.dispose();
      rearGlassGeo.dispose();
      roadGeo.dispose();
      dashGeo.dispose();
      particleGeo.dispose();

      bodyMaterial.dispose();
      darkAccentMaterial.dispose();
      glassMaterial.dispose();
      chromeMaterial.dispose();
      wheelRubberMaterial.dispose();
      taxiSignMaterial.dispose();
      roadMat.dispose();
      dashMat.dispose();
      particleMat.dispose();

      renderer.dispose();
    };
  }, [speedMultiplier]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[420px] select-none pointer-events-auto touch-none ${className}`}
      aria-label="Interactive 3D Taxi Simulation"
    />
  );
};
