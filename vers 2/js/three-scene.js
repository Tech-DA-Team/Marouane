/**
 * PORTFOLIO 3D - THREE.JS ENGINE
 * Web Development & UI/UX Design Themed 3D Workstations, Code Insignias & Responsive Rigs
 */

class Portfolio3D {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 3D Objects & Groups
    this.coreGroup = null;
    this.orbitingMoons = [];
    this.particleSystem = null;
    this.light1 = null;
    this.light2 = null;
    this.ambientLight = null;

    // Offscreen Canvas for Live Typing Screen
    this.screenCanvas = null;
    this.screenCtx = null;
    this.screenTexture = null;

    // Interaction & Animation State
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.manualRotation = { x: 0.1, y: -0.3 };

    this.currentModel = 'laptop'; // 'laptop', 'brackets', 'ui-stack', 'devices'
    this.wireframeOnly = false;
    this.rotationSpeed = 1.0;
    this.clock = new THREE.Clock();

    // Color Themes for 3D materials
    this.themeColors = {
      cyberpunk: {
        primary: 0x00f2fe,
        secondary: 0xff0080,
        emissive: 0x004466,
        particle: 0x4facfe,
        light1: 0x00f2fe,
        light2: 0xff0080,
        hexPrimary: '#00f2fe',
        hexSecondary: '#ff0080'
      },
      matrix: {
        primary: 0x00ff87,
        secondary: 0x60efff,
        emissive: 0x003318,
        particle: 0x00ff87,
        light1: 0x00ff87,
        light2: 0x00aa60,
        hexPrimary: '#00ff87',
        hexSecondary: '#60efff'
      },
      violet: {
        primary: 0xb000ff,
        secondary: 0x00f0ff,
        emissive: 0x2e0054,
        particle: 0xe040fb,
        light1: 0xb000ff,
        light2: 0x7928ca,
        hexPrimary: '#b000ff',
        hexSecondary: '#00f0ff'
      },
      solar: {
        primary: 0xff5e3a,
        secondary: 0xff9500,
        emissive: 0x4d1600,
        particle: 0xff5e3a,
        light1: 0xff5e3a,
        light2: 0xff2a68,
        hexPrimary: '#ff5e3a',
        hexSecondary: '#ff9500'
      }
    };
    this.activeTheme = 'cyberpunk';

    this.init();
  }

  init() {
    this.initScreenCanvas();
    this.initScene();
    this.initLights();
    this.buildCurrentModel();
    this.createOrbitingMoons();
    this.createStarField();
    this.initMiniProjectCanvases();
    this.bindEvents();
    this.animate();
  }

  initScreenCanvas() {
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 1024;
    this.screenCanvas.height = 680;
    this.screenCtx = this.screenCanvas.getContext('2d');
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.anisotropy = 4;
    this.renderScreenFrame(0);
  }

  renderScreenFrame(time) {
    if (!this.screenCtx) return;
    const ctx = this.screenCtx;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;
    const theme = this.themeColors[this.activeTheme];

    // Background
    ctx.fillStyle = '#070810';
    ctx.fillRect(0, 0, w, h);

    // Titlebar
    ctx.fillStyle = '#101222';
    ctx.fillRect(0, 0, w, 56);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeRect(0, 0, w, 56);

    // Window controls
    ctx.beginPath(); ctx.arc(28, 28, 8, 0, Math.PI * 2); ctx.fillStyle = '#ff5f56'; ctx.fill();
    ctx.beginPath(); ctx.arc(52, 28, 8, 0, Math.PI * 2); ctx.fillStyle = '#ffbd2e'; ctx.fill();
    ctx.beginPath(); ctx.arc(76, 28, 8, 0, Math.PI * 2); ctx.fillStyle = '#27c93f'; ctx.fill();

    // Editor tab
    ctx.fillStyle = '#17192e';
    ctx.fillRect(115, 10, 270, 46);
    ctx.fillStyle = theme.hexPrimary;
    ctx.fillRect(115, 52, 270, 4);

    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('App.tsx (WebGL 3D)', 140, 37);

    // Code lines
    ctx.font = '22px "JetBrains Mono", "Courier New", monospace';
    const lines = [
      { num: '01', text: "import { ThreeWebGL, ShaderCore } from '@graphics/engine';", color: '#c084fc' },
      { num: '02', text: "import { ResponsiveGrid, DesignTokens } from './ux-system';", color: '#c084fc' },
      { num: '03', text: "", color: '#64748b' },
      { num: '04', text: "// 3D Creative Technologist & Fullstack Architect", color: '#4ade80' },
      { num: '05', text: "export const developer = new CreativeEngineer({", color: '#38bdf8' },
      { num: '06', text: "  name: 'Alex Vance',", color: '#fde047' },
      { num: '07', text: "  disciplines: ['3D WebGL', 'GLSL Shaders', 'React / Next.js', 'UI/UX'],", color: '#f472b6' },
      { num: '08', text: "  framerate: '60 FPS Solid',", color: '#34d399' },
      { num: '09', text: "  status: 'Ready to build extraordinary web experiences'", color: '#fb7185' },
      { num: '10', text: "});", color: '#38bdf8' },
      { num: '11', text: "", color: '#64748b' },
      { num: '12', text: "export default function RenderWorld() {", color: '#c084fc' },
      { num: '13', text: "  return <Canvas mode='CYBER_DARK_3D' interactive={true} />;", color: theme.hexPrimary },
      { num: '14', text: "}", color: '#c084fc' },
      { num: '15', text: "⚡ COMPILED: 0 errors • 60 FPS nominal telemetry", color: theme.hexPrimary }
    ];

    let startY = 100;
    lines.forEach((l) => {
      ctx.fillStyle = '#475569';
      ctx.fillText(l.num, 30, startY);

      ctx.fillStyle = l.color;
      ctx.fillText(l.text, 90, startY);
      startY += 34;
    });

    // Blinking terminal cursor
    if (Math.sin(time * 5) > 0) {
      ctx.fillStyle = theme.hexPrimary;
      ctx.fillRect(720, startY - 34, 14, 25);
    }

    if (this.screenTexture) {
      this.screenTexture.needsUpdate = true;
    }
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05050a, 0.035);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
  }

  initLights() {
    const theme = this.themeColors[this.activeTheme];

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(this.ambientLight);

    this.light1 = new THREE.PointLight(theme.light1, 4.5, 35);
    this.light1.position.set(5, 5, 5);
    this.scene.add(this.light1);

    this.light2 = new THREE.PointLight(theme.light2, 4.5, 35);
    this.light2.position.set(-5, -4, 4);
    this.scene.add(this.light2);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    this.dirLight.position.set(0, 10, 10);
    this.scene.add(this.dirLight);
  }

  /* ==========================================================================
     BUILD DESIGN & DEV 3D MODELS
     ========================================================================== */
  buildCurrentModel() {
    if (this.coreGroup) {
      this.scene.remove(this.coreGroup);
    }

    this.coreGroup = new THREE.Group();

    switch (this.currentModel) {
      case 'brackets':
        this.buildCodeBracketsModel();
        break;
      case 'ui-stack':
        this.buildUIStackModel();
        break;
      case 'devices':
        this.buildResponsiveDevicesModel();
        break;
      case 'laptop':
      default:
        this.buildCyberLaptopModel();
        break;
    }

    // Position relative to hero layout (slightly to the right on desktop)
    this.coreGroup.position.set(window.innerWidth > 992 ? 2.3 : 0, 0, 0);
    this.scene.add(this.coreGroup);
  }

  /* 1. CYBER LAPTOP & LIVE TERMINAL DISPLAY */
  buildCyberLaptopModel() {
    const theme = this.themeColors[this.activeTheme];
    const laptopGroup = new THREE.Group();

    // Base chassis
    const baseGeo = new THREE.BoxGeometry(4.2, 0.16, 2.9);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x121422,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: this.wireframeOnly
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -0.65, 0.1);
    laptopGroup.add(baseMesh);

    // Glowing base rim
    const rimMat = new THREE.MeshBasicMaterial({
      color: theme.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const rimMesh = new THREE.Mesh(new THREE.BoxGeometry(4.24, 0.18, 2.94), rimMat);
    rimMesh.position.copy(baseMesh.position);
    laptopGroup.add(rimMesh);

    // Keyboard well
    const kbWell = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.04, 1.45),
      new THREE.MeshStandardMaterial({ color: 0x090a12, metalness: 0.9, roughness: 0.5 })
    );
    kbWell.position.set(0, -0.55, -0.2);
    laptopGroup.add(kbWell);

    // Glowing key strips
    for (let r = 0; r < 4; r++) {
      const rowKey = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 0.03, 0.24),
        new THREE.MeshStandardMaterial({
          color: 0x1c1e33,
          emissive: theme.primary,
          emissiveIntensity: 0.2,
          roughness: 0.3
        })
      );
      rowKey.position.set(0, -0.53, -0.65 + r * 0.32);
      laptopGroup.add(rowKey);
    }

    // Glass trackpad
    const trackpad = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.03, 0.85),
      new THREE.MeshStandardMaterial({
        color: 0x181a2e,
        metalness: 0.7,
        roughness: 0.2,
        emissive: theme.secondary,
        emissiveIntensity: 0.15
      })
    );
    trackpad.position.set(0, -0.55, 0.95);
    laptopGroup.add(trackpad);

    // Screen Lid Group (Tilted back like a real open laptop)
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, -0.56, -1.35);
    screenGroup.rotation.x = -0.32; // ~18 degrees tilted back

    // Display backing lid
    const lidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.7, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x141628,
        metalness: 0.85,
        roughness: 0.25,
        wireframe: this.wireframeOnly
      })
    );
    lidMesh.position.set(0, 1.35, 0);
    screenGroup.add(lidMesh);

    // Display Screen Canvas (Syntax Highlighted Code)
    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 2.45),
      new THREE.MeshBasicMaterial({
        map: this.screenTexture,
        wireframe: this.wireframeOnly
      })
    );
    screenMesh.position.set(0, 1.35, 0.065);
    screenGroup.add(screenMesh);

    // Screen neon outline
    const screenBezel = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.92, 2.47)),
      new THREE.LineBasicMaterial({ color: theme.primary, linewidth: 2 })
    );
    screenBezel.position.copy(screenMesh.position);
    screenBezel.position.z += 0.01;
    screenGroup.add(screenBezel);

    laptopGroup.add(screenGroup);
    this.coreGroup.add(laptopGroup);
  }

  /* 2. 3D DEVELOPER CODE INSIGNIA </TAG> */
  buildCodeBracketsModel() {
    const theme = this.themeColors[this.activeTheme];
    const bracketGroup = new THREE.Group();

    const chevronMat = new THREE.MeshPhysicalMaterial({
      color: theme.primary,
      emissive: theme.emissive,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      wireframe: this.wireframeOnly
    });

    const slashMat = new THREE.MeshPhysicalMaterial({
      color: theme.secondary,
      emissive: theme.secondary,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: this.wireframeOnly
    });

    // Left Chevron `<`
    const leftTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.0, 0.35), chevronMat);
    leftTop.position.set(-1.8, 0.68, 0);
    leftTop.rotation.z = 0.65;

    const leftBottom = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.0, 0.35), chevronMat);
    leftBottom.position.set(-1.8, -0.68, 0);
    leftBottom.rotation.z = -0.65;

    // Center Slash `/`
    const centerSlash = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.4, 0.35), slashMat);
    centerSlash.position.set(0, 0, 0);
    centerSlash.rotation.z = -0.38;

    // Right Chevron `>`
    const rightTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.0, 0.35), chevronMat);
    rightTop.position.set(1.8, 0.68, 0);
    rightTop.rotation.z = -0.65;

    const rightBottom = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.0, 0.35), chevronMat);
    rightBottom.position.set(1.8, -0.68, 0);
    rightBottom.rotation.z = 0.65;

    // Center Logic Core (Glowing Floating Octahedron)
    const coreLogic = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
        emissive: theme.primary,
        emissiveIntensity: 0.7
      })
    );
    coreLogic.position.set(0, 0, 0);

    // Orbital Ring around code tag
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.04, 16, 80),
      new THREE.MeshBasicMaterial({ color: theme.primary, wireframe: true })
    );
    ringMesh.rotation.x = Math.PI / 2.3;

    bracketGroup.add(leftTop);
    bracketGroup.add(leftBottom);
    bracketGroup.add(centerSlash);
    bracketGroup.add(rightTop);
    bracketGroup.add(rightBottom);
    bracketGroup.add(coreLogic);
    bracketGroup.add(ringMesh);

    this.coreGroup.add(bracketGroup);
  }

  /* 3. FLOATING UI/UX DESIGN LAYER STACK */
  buildUIStackModel() {
    const theme = this.themeColors[this.activeTheme];
    const stackGroup = new THREE.Group();

    // Layer 1: Artboard Base Blueprint (Z = -0.8)
    const baseCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 3.0),
      new THREE.MeshStandardMaterial({
        color: 0x090a16,
        roughness: 0.4,
        metalness: 0.8,
        wireframe: this.wireframeOnly
      })
    );
    baseCanvas.position.set(0, 0, -0.8);
    stackGroup.add(baseCanvas);

    const baseOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(4.4, 3.0)),
      new THREE.LineBasicMaterial({ color: 0x3b82f6 })
    );
    baseOutline.position.copy(baseCanvas.position);
    stackGroup.add(baseOutline);

    // Layer 2: Glass Wireframe Layout Pane (Z = 0.0)
    const glassPane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 2.5),
      new THREE.MeshPhysicalMaterial({
        color: theme.primary,
        transparent: true,
        opacity: this.wireframeOnly ? 0.1 : 0.35,
        roughness: 0.1,
        metalness: 0.5,
        wireframe: this.wireframeOnly
      })
    );
    glassPane.position.set(0, 0, 0);
    stackGroup.add(glassPane);

    // Layout elements on middle layer (Navbar + 2 Content cards + Button)
    const navBar = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.35, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x1f233f, metalness: 0.8 })
    );
    navBar.position.set(0, 0.9, 0.05);
    stackGroup.add(navBar);

    const cardLeft = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.2, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x14172c, metalness: 0.8 })
    );
    cardLeft.position.set(-0.9, 0.05, 0.05);
    stackGroup.add(cardLeft);

    const cardRight = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.2, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x14172c, metalness: 0.8 })
    );
    cardRight.position.set(0.9, 0.05, 0.05);
    stackGroup.add(cardRight);

    // Layer 3: Vector Tooling & Bézier Handles (Z = +0.8)
    // Central Anchor Node (Diamond)
    const anchorNode = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshStandardMaterial({
        color: theme.secondary,
        emissive: theme.secondary,
        emissiveIntensity: 0.6
      })
    );
    anchorNode.rotation.z = Math.PI / 4;
    anchorNode.position.set(0, -0.3, 0.8);
    stackGroup.add(anchorNode);

    // Tangent Control Bar & Handle Spheres
    const tangentBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 2.2),
      new THREE.MeshBasicMaterial({ color: theme.primary })
    );
    tangentBar.rotation.z = Math.PI / 3;
    tangentBar.position.set(0, -0.3, 0.8);
    stackGroup.add(tangentBar);

    const handle1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: theme.primary })
    );
    handle1.position.set(-0.95, -0.85, 0.8);
    stackGroup.add(handle1);

    const handle2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: theme.primary })
    );
    handle2.position.set(0.95, 0.25, 0.8);
    stackGroup.add(handle2);

    // 4 Floating Color Swatches
    const swatchColors = [0x00f2fe, 0xff0080, 0x00ff87, 0xf5a623];
    swatchColors.forEach((col, idx) => {
      const swatch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.08, 24),
        new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.4 })
      );
      swatch.rotation.x = Math.PI / 2;
      swatch.position.set(-1.2 + idx * 0.8, -1.0, 0.8);
      stackGroup.add(swatch);
    });

    this.coreGroup.add(stackGroup);
  }

  /* 4. RESPONSIVE DEVICES RIG (STUDIO DISPLAY + MOBILE PHONE) */
  buildResponsiveDevicesModel() {
    const theme = this.themeColors[this.activeTheme];
    const deviceGroup = new THREE.Group();

    // --- Desktop Display ---
    const desktopGroup = new THREE.Group();
    desktopGroup.position.set(-0.8, 0.2, -0.2);

    // Screen Bezel
    const deskScreen = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.2, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x101222,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: this.wireframeOnly
      })
    );
    desktopGroup.add(deskScreen);

    // Screen Display Plane (Desktop Layout)
    const deskDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.0),
      new THREE.MeshBasicMaterial({
        map: this.screenTexture,
        wireframe: this.wireframeOnly
      })
    );
    deskDisplay.position.set(0, 0, 0.065);
    desktopGroup.add(deskDisplay);

    // Stand
    const standNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1f233a, metalness: 0.85 })
    );
    standNeck.position.set(0, -1.3, 0);
    desktopGroup.add(standNeck);

    const standBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.06, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x1a1d30, metalness: 0.85 })
    );
    standBase.position.set(0, -1.9, 0);
    desktopGroup.add(standBase);

    // --- Mobile Phone ---
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(1.9, -0.2, 0.6);
    phoneGroup.rotation.y = -0.25;
    phoneGroup.rotation.z = 0.08;

    const phoneBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 2.2, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0x0a0c16,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: this.wireframeOnly
      })
    );
    phoneGroup.add(phoneBody);

    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.98, 2.05),
      new THREE.MeshBasicMaterial({
        color: 0x0f1224,
        wireframe: this.wireframeOnly
      })
    );
    phoneScreen.position.set(0, 0, 0.055);
    phoneGroup.add(phoneScreen);

    // Mini UI Blocks on Phone Screen
    const phonePill = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.18, 0.02),
      new THREE.MeshBasicMaterial({ color: theme.primary })
    );
    phonePill.position.set(0, 0.7, 0.065);
    phoneGroup.add(phonePill);

    const phoneCard1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.5, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x1f2545 })
    );
    phoneCard1.position.set(0, 0.2, 0.065);
    phoneGroup.add(phoneCard1);

    const phoneCard2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.5, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x1f2545 })
    );
    phoneCard2.position.set(0, -0.45, 0.065);
    phoneGroup.add(phoneCard2);

    // Holographic sync beam connecting desktop & mobile
    const beamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.0, 0.2, 0),
      new THREE.Vector3(1.9, -0.2, 0.6)
    ]);
    const beamLine = new THREE.Line(
      beamGeo,
      new THREE.LineDashedMaterial({
        color: theme.secondary,
        dashSize: 0.2,
        gapSize: 0.1
      })
    );
    beamLine.computeLineDistances();

    deviceGroup.add(desktopGroup);
    deviceGroup.add(phoneGroup);
    deviceGroup.add(beamLine);

    this.coreGroup.add(deviceGroup);
  }

  /* Orbiting Satellites: Web Dev & Design Glyphs */
  /* --------------------------------------------------------------------------
     ORBITING TECH STACK LOGOS (Figma, HTML5, CSS3, JavaScript, React, TypeScript)
     -------------------------------------------------------------------------- */
  roundRect(ctx, x, y, width, height, radius) {
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }

  createTechLogoTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);

    if (type === 'figma') {
      // Figma Dark Glass Badge
      ctx.fillStyle = '#161726';
      this.roundRect(ctx, 10, 10, 236, 236, 42);
      ctx.fill();
      ctx.strokeStyle = 'rgba(162, 89, 255, 0.6)';
      ctx.lineWidth = 5;
      ctx.stroke();

      // 5 Iconic Figma Shapes (Grid of 2 cols, 3 rows)
      const r = 26;
      const cx1 = 92, cx2 = 144;
      const cy1 = 66, cy2 = 118, cy3 = 170;

      // 1. Top Left: #F24E1E (half circle left)
      ctx.fillStyle = '#F24E1E';
      ctx.beginPath();
      ctx.arc(cx1, cy1, r, Math.PI / 2, Math.PI * 1.5);
      ctx.lineTo(cx1 + 0.1, cy1 - r);
      ctx.lineTo(cx1 + 0.1, cy1 + r);
      ctx.closePath();
      ctx.fill();

      // 2. Top Right: #FF7262 (circle)
      ctx.fillStyle = '#FF7262';
      ctx.beginPath();
      ctx.arc(cx2, cy1, r, 0, Math.PI * 2);
      ctx.fill();

      // 3. Middle Left: #A259FF (half circle left)
      ctx.fillStyle = '#A259FF';
      ctx.beginPath();
      ctx.arc(cx1, cy2, r, Math.PI / 2, Math.PI * 1.5);
      ctx.lineTo(cx1 + 0.1, cy2 - r);
      ctx.lineTo(cx1 + 0.1, cy2 + r);
      ctx.closePath();
      ctx.fill();

      // 4. Middle Right: #1ABCFE (circle)
      ctx.fillStyle = '#1ABCFE';
      ctx.beginPath();
      ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
      ctx.fill();

      // 5. Bottom Left: #0ACF83 (circle)
      ctx.fillStyle = '#0ACF83';
      ctx.beginPath();
      ctx.arc(cx1, cy3, r, 0, Math.PI * 2);
      ctx.fill();

      // Figma Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FIGMA', 128, 226);

    } else if (type === 'html') {
      // HTML5 Orange Shield Badge
      ctx.fillStyle = '#131522';
      this.roundRect(ctx, 10, 10, 236, 236, 42);
      ctx.fill();
      ctx.strokeStyle = '#e44d26';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Outer Shield
      ctx.beginPath();
      ctx.moveTo(56, 44);
      ctx.lineTo(200, 44);
      ctx.lineTo(187, 182);
      ctx.lineTo(128, 198);
      ctx.lineTo(69, 182);
      ctx.closePath();
      ctx.fillStyle = '#E44D26';
      ctx.fill();

      // Right-half lighter shield facet
      ctx.beginPath();
      ctx.moveTo(128, 54);
      ctx.lineTo(186, 54);
      ctx.lineTo(176, 172);
      ctx.lineTo(128, 186);
      ctx.closePath();
      ctx.fillStyle = '#F16529';
      ctx.fill();

      // Stylized 5
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 86px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('5', 128, 120);

      // Label
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.fillText('HTML5', 128, 226);

    } else if (type === 'css') {
      // CSS3 Blue Shield Badge
      ctx.fillStyle = '#131522';
      this.roundRect(ctx, 10, 10, 236, 236, 42);
      ctx.fill();
      ctx.strokeStyle = '#264de4';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Outer Shield
      ctx.beginPath();
      ctx.moveTo(56, 44);
      ctx.lineTo(200, 44);
      ctx.lineTo(187, 182);
      ctx.lineTo(128, 198);
      ctx.lineTo(69, 182);
      ctx.closePath();
      ctx.fillStyle = '#264DE4';
      ctx.fill();

      // Right-half lighter shield facet
      ctx.beginPath();
      ctx.moveTo(128, 54);
      ctx.lineTo(186, 54);
      ctx.lineTo(176, 172);
      ctx.lineTo(128, 186);
      ctx.closePath();
      ctx.fillStyle = '#2965F1';
      ctx.fill();

      // Stylized 3
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 86px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('3', 128, 120);

      // Label
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.fillText('CSS3', 128, 226);

    } else if (type === 'js') {
      // JavaScript Yellow Square
      ctx.fillStyle = '#F7DF1E';
      this.roundRect(ctx, 10, 10, 236, 236, 42);
      ctx.fill();
      ctx.strokeStyle = '#c4ad10';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = '900 115px "Space Grotesk", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('JS', 222, 230);

      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('JAVASCRIPT', 28, 48);

    } else if (type === 'react') {
      // React Navy/Cyan Badge
      ctx.fillStyle = '#1a1d2e';
      this.roundRect(ctx, 10, 10, 236, 236, 42);
      ctx.fill();
      ctx.strokeStyle = '#61DAFB';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Center Nucleus
      ctx.beginPath();
      ctx.arc(128, 116, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#61DAFB';
      ctx.fill();

      // 3 Ellipses
      ctx.strokeStyle = '#61DAFB';
      ctx.lineWidth = 6;
      [0, Math.PI / 3, (2 * Math.PI) / 3].forEach((ang) => {
        ctx.beginPath();
        ctx.ellipse(128, 116, 62, 22, ang, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Label
      ctx.fillStyle = '#61DAFB';
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('REACT', 128, 226);

    } else if (type === 'ts') {
      // TypeScript Blue Square Badge
      ctx.fillStyle = '#3178C6';
      this.roundRect(ctx, 10, 10, 236, 236, 42);
      ctx.fill();
      ctx.strokeStyle = '#225a98';
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 115px "Space Grotesk", sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('TS', 224, 230);

      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('TYPESCRIPT', 28, 48);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }

  createOrbitingMoons() {
    this.orbitingMoons.forEach(m => this.scene.remove(m.mesh));
    this.orbitingMoons = [];

    const techConfigs = [
      { type: 'figma', glow: 0xa259ff, radius: 4.2, speed: 0.65, yOffset: 0.75, angle: 0 },
      { type: 'html',  glow: 0xe44d26, radius: 4.6, speed: 0.65, yOffset: -0.6, angle: (1 / 6) * Math.PI * 2 },
      { type: 'css',   glow: 0x264de4, radius: 4.3, speed: 0.65, yOffset: 0.45, angle: (2 / 6) * Math.PI * 2 },
      { type: 'js',    glow: 0xf7df1e, radius: 4.8, speed: 0.65, yOffset: -0.45, angle: (3 / 6) * Math.PI * 2 },
      { type: 'react', glow: 0x61dafb, radius: 4.4, speed: 0.65, yOffset: 0.8, angle: (4 / 6) * Math.PI * 2 },
      { type: 'ts',    glow: 0x3178c6, radius: 4.7, speed: 0.65, yOffset: -0.7, angle: (5 / 6) * Math.PI * 2 }
    ];

    techConfigs.forEach((cfg) => {
      const texture = this.createTechLogoTexture(cfg.type);
      const badgeGroup = new THREE.Group();

      // Badge Chassis Body (Dark Metallic)
      const bodyGeo = new THREE.BoxGeometry(0.85, 0.85, 0.12);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x0f111e,
        metalness: 0.85,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      badgeGroup.add(body);

      // Front Face
      const faceGeo = new THREE.PlaneGeometry(0.84, 0.84);
      const faceMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      });
      const frontFace = new THREE.Mesh(faceGeo, faceMat);
      frontFace.position.z = 0.063;
      badgeGroup.add(frontFace);

      // Back Face (so it's visible as it spins 360 degrees)
      const backFace = new THREE.Mesh(faceGeo, faceMat);
      backFace.position.z = -0.063;
      backFace.rotation.y = Math.PI;
      badgeGroup.add(backFace);

      // Glowing Accent Border
      const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.86, 0.86, 0.13));
      const edgeMat = new THREE.LineBasicMaterial({
        color: cfg.glow,
        linewidth: 2
      });
      const rim = new THREE.LineSegments(edgeGeo, edgeMat);
      badgeGroup.add(rim);

      this.scene.add(badgeGroup);
      this.orbitingMoons.push({ mesh: badgeGroup, ...cfg });
    });
  }

  createStarField() {
    if (this.particleSystem) this.scene.remove(this.particleSystem);

    const particleCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 45;
      positions[i3 + 1] = (Math.random() - 0.5) * 45;
      positions[i3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const theme = this.themeColors[this.activeTheme];
    const material = new THREE.PointsMaterial({
      color: theme.particle,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  setModel(modelName) {
    // Map backwards-compatible aliases
    const map = {
      'laptop': 'laptop',
      'brackets': 'brackets',
      'ui-stack': 'ui-stack',
      'devices': 'devices',
      'torus': 'laptop',
      'icosahedron': 'brackets',
      'cube': 'ui-stack',
      'galaxy': 'devices'
    };

    this.currentModel = map[modelName] || 'laptop';
    this.buildCurrentModel();
  }

  setShape(shapeName) {
    this.setModel(shapeName);
  }

  setWireframe(isWireframe) {
    this.wireframeOnly = isWireframe;
    this.buildCurrentModel();
  }

  setSpeed(speedVal) {
    this.rotationSpeed = parseFloat(speedVal);
  }

  setTheme(themeName) {
    if (!this.themeColors[themeName]) return;
    this.activeTheme = themeName;
    const theme = this.themeColors[themeName];

    // Update lights
    this.light1.color.setHex(theme.light1);
    this.light2.color.setHex(theme.light2);

    // Rebuild active 3D model & satellites
    this.buildCurrentModel();
    this.createOrbitingMoons();

    if (this.particleSystem) {
      this.particleSystem.material.color.setHex(theme.particle);
      this.particleSystem.material.needsUpdate = true;
    }

    if (this.miniMeshes && this.miniMeshes.length > 0) {
      this.miniMeshes.forEach((mesh, idx) => {
        if (mesh && mesh.material) {
          const col = idx % 2 === 0 ? theme.primary : theme.secondary;
          mesh.material.color.setHex(col);
          mesh.material.needsUpdate = true;
        }
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      if (this.coreGroup) {
        this.coreGroup.position.x = window.innerWidth > 992 ? 2.3 : 0;
      }
    });

    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        this.manualRotation.y += deltaX * 0.008;
        this.manualRotation.x += deltaY * 0.008;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    // Drag rotation on interactive 3D hero stage
    const heroCard = document.querySelector('.hero-3d-interactive-card');
    if (heroCard) {
      heroCard.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      heroCard.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isDragging = false;
      });

      window.addEventListener('touchmove', (e) => {
        if (this.isDragging && e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
          const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
          this.manualRotation.y += deltaX * 0.008;
          this.manualRotation.x += deltaY * 0.008;
          this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });
    }

    // Scroll Camera Interaction
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

      const targetCamZ = 10 - scrollProgress * 3;
      const targetCamY = -scrollProgress * 2.5;
      const targetMeshX = (window.innerWidth > 992 ? 2.3 : 0) - scrollProgress * 3.5;

      gsap.to(this.camera.position, {
        z: targetCamZ,
        y: targetCamY,
        duration: 0.6,
        ease: 'power1.out'
      });

      if (this.coreGroup) {
        gsap.to(this.coreGroup.position, {
          x: targetMeshX,
          duration: 0.6,
          ease: 'power1.out'
        });
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Render dynamic code lines onto screen canvas
    this.renderScreenFrame(elapsedTime);

    // Smooth Lerp for Mouse Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Rotate Core Group
    if (this.coreGroup) {
      this.coreGroup.rotation.x = this.manualRotation.x + this.mouseY * 0.35 + Math.sin(elapsedTime * 0.8) * 0.05;
      this.coreGroup.rotation.y = this.manualRotation.y + this.mouseX * 0.55 + elapsedTime * 0.2 * this.rotationSpeed;

      // Gentle floating hover
      this.coreGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.15;
    }

    // Rotate Orbiting Tech Stack Logos (Figma, HTML5, CSS3, JS, React, TS)
    this.orbitingMoons.forEach((m) => {
      m.angle += m.speed * delta * this.rotationSpeed;
      m.mesh.position.x = (this.coreGroup ? this.coreGroup.position.x : 0) + Math.cos(m.angle) * m.radius;
      m.mesh.position.z = Math.sin(m.angle) * m.radius;
      m.mesh.position.y = (this.coreGroup ? this.coreGroup.position.y : 0) + m.yOffset + Math.sin(elapsedTime * 2 + m.angle) * 0.25;

      // Smooth spin so both faces and metallic bevels catch lighting
      m.mesh.rotation.y += delta * 1.4;
      m.mesh.rotation.x = Math.sin(elapsedTime * 1.8 + m.angle) * 0.18;
    });

    // Particle field gentle rotation
    if (this.particleSystem) {
      this.particleSystem.rotation.y = elapsedTime * 0.03 * this.rotationSpeed + this.mouseX * 0.15;
      this.particleSystem.rotation.x = elapsedTime * 0.02 * this.rotationSpeed - this.mouseY * 0.1;
    }

    // Dynamic light movement
    if (this.light1) {
      this.light1.position.x = Math.sin(elapsedTime * 0.8) * 6;
      this.light1.position.y = Math.cos(elapsedTime * 0.6) * 6;
    }
    if (this.light2) {
      this.light2.position.x = -Math.sin(elapsedTime * 0.7) * 6;
      this.light2.position.y = -Math.cos(elapsedTime * 0.9) * 6;
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Mini 3D Canvases inside Project Cards for extra 3D wow factor
  initMiniProjectCanvases() {
    this.miniMeshes = [];
    const miniContainers = document.querySelectorAll('.project-canvas-preview');

    miniContainers.forEach((container) => {
      const type = container.dataset.type || 'wireframe';
      let width = container.clientWidth || 340;
      let height = container.clientHeight || 220;

      const miniScene = new THREE.Scene();
      const miniCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      miniCamera.position.z = 4.2;

      const miniRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      miniRenderer.setSize(width, height);
      miniRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      miniRenderer.domElement.style.width = '100%';
      miniRenderer.domElement.style.height = '100%';
      container.appendChild(miniRenderer.domElement);

      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          if (cr.width > 0 && cr.height > 0) {
            miniCamera.aspect = cr.width / cr.height;
            miniCamera.updateProjectionMatrix();
            miniRenderer.setSize(cr.width, cr.height);
          }
        }
      });
      resizeObserver.observe(container);

      let miniMesh;
      if (type === 'space-portal') {
        const geo = new THREE.TorusGeometry(1.4, 0.4, 16, 60);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x00f2fe,
          wireframe: true,
          emissive: 0x005588
        });
        miniMesh = new THREE.Mesh(geo, mat);
      } else if (type === 'neural-ai') {
        const geo = new THREE.IcosahedronGeometry(1.6, 2);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xff0080,
          wireframe: true,
          emissive: 0x660033
        });
        miniMesh = new THREE.Mesh(geo, mat);
      } else if (type === 'ecommerce-3d') {
        const geo = new THREE.OctahedronGeometry(1.5, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xf5a623,
          metalness: 0.8,
          roughness: 0.2,
          wireframe: true,
          emissive: 0x553300
        });
        miniMesh = new THREE.Mesh(geo, mat);
      } else {
        const geo = new THREE.DodecahedronGeometry(1.4);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x00ff87,
          wireframe: true,
          emissive: 0x004411
        });
        miniMesh = new THREE.Mesh(geo, mat);
      }

      const pLight = new THREE.PointLight(0xffffff, 2, 10);
      pLight.position.set(2, 3, 4);
      miniScene.add(pLight);
      miniScene.add(new THREE.AmbientLight(0xffffff, 0.5));
      miniScene.add(miniMesh);

      this.miniMeshes.push(miniMesh);

      let isCardHovered = false;
      const card = container.closest('.project-card');
      if (card) {
        card.addEventListener('mouseenter', () => { isCardHovered = true; });
        card.addEventListener('mouseleave', () => { isCardHovered = false; });
      }

      const miniAnimate = () => {
        requestAnimationFrame(miniAnimate);
        if (miniMesh) {
          const speedMultiplier = isCardHovered ? 2.5 : 1.0;
          miniMesh.rotation.x += 0.008 * speedMultiplier;
          miniMesh.rotation.y += 0.014 * speedMultiplier;
        }
        miniRenderer.render(miniScene, miniCamera);
      };
      miniAnimate();
    });
  }
}

window.Portfolio3D = Portfolio3D;
