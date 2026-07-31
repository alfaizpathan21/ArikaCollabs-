import * as THREE from 'three';

/**
 * Premium Interactive 3D Logo Component for ARIKA COLLABS
 * Renders a metallic black and rose-gold 3D emblem with realistic PBR materials,
 * floating animation, 360-degree auto-rotation, mouse/touch cursor tilt, and ambient glow.
 */
export function initHero3DLogo(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear any previous child nodes
    container.innerHTML = '';

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight || 1;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // Renderer setup with shadow map and transparent background
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // --- Materials ---
    // Metallic Rose Gold
    const roseGoldMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#DDA291'),
        emissive: new THREE.Color('#3A1F18'),
        emissiveIntensity: 0.15,
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0,
        flatShading: false
    });

    // Dark Chrome / Metallic Obsidian
    const darkChromeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#1A1817'),
        metalness: 0.92,
        roughness: 0.22,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        reflectivity: 0.9
    });

    // High Polish Bright Gold Accent
    const brightGoldMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#F2C0B0'),
        metalness: 0.98,
        roughness: 0.08,
        clearcoat: 1.0,
        reflectivity: 1.0
    });

    // Platinum White Material for the 'C' Monogram
    const whitePlatinumMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFFFFF'),
        emissive: new THREE.Color('#25252A'),
        emissiveIntensity: 0.12,
        metalness: 0.88,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0
    });

    // Root Group for 3D Logo Assembly
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // --- 1. Extruded Stylized "A" Monogram Emblem (Rose Gold) ---
    const shapeA = new THREE.Shape();
    shapeA.moveTo(0.05, 1.85);
    shapeA.bezierCurveTo(0.15, 1.85, 0.28, 1.7, 0.38, 1.4);
    shapeA.lineTo(1.15, -1.05);
    // Swooping right leg flourish matching the reference image
    shapeA.bezierCurveTo(1.42, -1.38, 1.78, -1.65, 1.85, -1.72);
    shapeA.bezierCurveTo(1.62, -1.82, 1.25, -1.65, 0.98, -1.32);
    shapeA.lineTo(0.55, -0.42); // Right inner leg
    shapeA.lineTo(-0.48, -0.42); // Crossbar inner left
    shapeA.lineTo(-0.78, -1.22); // Left inner leg
    shapeA.lineTo(-1.32, -1.22); // Left foot serif
    shapeA.lineTo(-1.52, -1.42); // Left foot tip
    shapeA.lineTo(-0.85, -1.42); // Left foot right tip
    shapeA.lineTo(-0.15, 0.25); // Left leg going up
    shapeA.lineTo(0.15, 0.25); // Right leg going up
    shapeA.closePath();

    // Triangle hole in upper 'A'
    const holeA = new THREE.Path();
    holeA.moveTo(0.05, 1.35);
    holeA.lineTo(-0.22, 0.35);
    holeA.lineTo(0.32, 0.35);
    holeA.closePath();
    shapeA.holes.push(holeA);

    const extrudeSettingsA = {
        depth: 0.32,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.06,
        bevelThickness: 0.06
    };

    const geometryA = new THREE.ExtrudeGeometry(shapeA, extrudeSettingsA);
    geometryA.center();

    const meshA = new THREE.Mesh(geometryA, roseGoldMaterial);
    meshA.position.set(0.12, 0, 0);
    meshA.castShadow = true;
    meshA.receiveShadow = true;
    logoGroup.add(meshA);

    // --- 2. Extruded Stylized "C" Monogram Emblem (Platinum White) ---
    // Intertwined inside and around the left leg of 'A'
    const shapeC = new THREE.Shape();
    shapeC.moveTo(0.72, 0.68);
    // Outer arc
    shapeC.bezierCurveTo(-0.15, 0.78, -1.25, 0.48, -1.25, -0.22);
    shapeC.bezierCurveTo(-1.25, -0.92, -0.25, -1.22, 0.68, -1.12);
    // Tapered bottom tip
    shapeC.bezierCurveTo(0.48, -0.88, 0.28, -0.78, 0.08, -0.78);
    // Inner arc
    shapeC.bezierCurveTo(-0.68, -0.78, -0.68, 0.32, 0.08, 0.32);
    shapeC.bezierCurveTo(0.35, 0.32, 0.55, 0.48, 0.72, 0.68);
    shapeC.closePath();

    const extrudeSettingsC = {
        depth: 0.28,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.05,
        bevelThickness: 0.05
    };

    const geometryC = new THREE.ExtrudeGeometry(shapeC, extrudeSettingsC);
    geometryC.center();

    const meshC = new THREE.Mesh(geometryC, whitePlatinumMaterial);
    // Positioned slightly forward in Z to create depth-intertwining over the left leg of A
    meshC.position.set(-0.18, -0.12, 0.12);
    meshC.castShadow = true;
    meshC.receiveShadow = true;
    logoGroup.add(meshC);

    // --- 3. Top-Right Sparkle Star Element ---
    const starShape = new THREE.Shape();
    const starR = 0.28;
    const innerR = 0.05;
    starShape.moveTo(0, starR);
    starShape.quadraticCurveTo(0, innerR, innerR, 0);
    starShape.quadraticCurveTo(0, -innerR, 0, -starR);
    starShape.quadraticCurveTo(0, -innerR, -innerR, 0);
    starShape.quadraticCurveTo(0, innerR, 0, starR);
    starShape.closePath();

    const starExtrudeSettings = {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.03,
        bevelThickness: 0.03
    };

    const starGeometry = new THREE.ExtrudeGeometry(starShape, starExtrudeSettings);
    starGeometry.center();

    const starMesh = new THREE.Mesh(starGeometry, brightGoldMaterial);
    starMesh.position.set(1.05, 1.15, 0.18);
    starMesh.castShadow = true;
    logoGroup.add(starMesh);

    // --- 4. Outer Floating Luxury Emblem Frame Ring ---
    const ringGeo1 = new THREE.TorusGeometry(2.25, 0.035, 24, 120);
    const ringMesh1 = new THREE.Mesh(ringGeo1, roseGoldMaterial);
    ringMesh1.position.set(0, 0, -0.05);
    ringMesh1.castShadow = true;
    logoGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.48, 0.02, 24, 100);
    const ringMesh2 = new THREE.Mesh(ringGeo2, darkChromeMaterial);
    ringMesh2.rotation.x = Math.PI / 3.5;
    ringMesh2.rotation.y = Math.PI / 8;
    logoGroup.add(ringMesh2);

    // --- 4. Corner Accent Spheres ---
    const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const sphereAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    sphereAngles.forEach((angle) => {
        const sphere = new THREE.Mesh(sphereGeo, brightGoldMaterial);
        sphere.position.set(2.1 * Math.cos(angle), 0, 2.1 * Math.sin(angle));
        ringMesh1.add(sphere);
    });

    // --- 5. Ambient Floating Rose-Gold Particle Field ---
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 12;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        particleScales[i] = Math.random() * 0.06 + 0.02;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color('#DDA291'),
        size: 0.08,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // --- Lighting Setup ---
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x2B1E1A, 1.2);
    scene.add(ambientLight);

    // Key Directional Light (Warm Rose Gold)
    const keyLight = new THREE.DirectionalLight(0xFFE2D6, 3.2);
    keyLight.position.set(5, 6, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Fill Directional Light (Deep Metallic Contrast)
    const fillLight = new THREE.DirectionalLight(0x4A3832, 1.8);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    // Interactive Cursor Point Light (Creates dynamic specular reflections as mouse moves)
    const cursorLight = new THREE.PointLight(0xDDA291, 4.0, 12);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // --- Animation & Interactivity State ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (clientX: number, clientY: number) => {
        const rect = container.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;

        mouseX = x;
        mouseY = y;

        targetRotationY = x * 0.8; // Tilt left-right
        targetRotationX = -y * 0.8; // Tilt up-down

        // Update cursor light position smoothly in 3D space
        cursorLight.position.x = x * 6;
        cursorLight.position.y = -y * 6;
    };

    // Mouse Desktop Event
    const handleMouseMove = (e: MouseEvent) => {
        onPointerMove(e.clientX, e.clientY);
    };

    // Touch Mobile Event
    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Clock for smooth 60 FPS animation
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // 1. Slow floating sine-wave motion
        logoGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

        // 2. Continuous slow 360° auto-rotation (~12s per full loop)
        const autoRotationY = elapsedTime * (Math.PI * 2 / 12);

        // 3. Smooth Lerp interpolation for mouse tilt & rotation
        logoGroup.rotation.y += (autoRotationY + targetRotationY - logoGroup.rotation.y) * 0.05;
        logoGroup.rotation.x += (targetRotationX - logoGroup.rotation.x) * 0.05;

        // Counter-rotate outer rings for subtle complex motion
        ringMesh1.rotation.z = elapsedTime * 0.15;
        ringMesh2.rotation.z = -elapsedTime * 0.12;
        starMesh.rotation.z = Math.sin(elapsedTime * 2.5) * 0.08; // Subtle 4-point star shimmer animation

        // Rotate ambient particles floating field
        particleSystem.rotation.y = elapsedTime * 0.04;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

        renderer.render(scene, camera);
    };

    animate();

    // Responsive Resize Observer
    const handleResize = () => {
        if (!container) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        if (newWidth === 0 || newHeight === 0) return;

        camera.aspect = newWidth / newHeight;
        
        // Scale logo position/size responsively for small mobile screens
        if (newWidth < 640) {
            camera.position.z = 9.0;
        } else if (newWidth < 1024) {
            camera.position.z = 8.0;
        } else {
            camera.position.z = 7.2;
        }

        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
        handleResize();
    });
    resizeObserver.observe(container);
    handleResize();
}
