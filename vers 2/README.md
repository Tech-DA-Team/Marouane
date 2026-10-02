# 🌌 Futuristic 3D Cyberpunk Portfolio

An ultra-modern, dark-themed **HTML5, CSS3, and JavaScript** developer portfolio packed with real-time **Three.js 3D animations**, interactive WebGL geometry, physics-based card tilts, custom shaders, and Web Audio API synthesized sound effects.

---

## ✨ Features & 3D Animations

- **Hero 3D Dev & Design Workstation (Three.js)**:
  - **💻 Cyber Laptop & Live Terminal**: Real-time 3D laptop with titanium chassis, glowing keyboard strips, and a display screen running an offscreen HTML5 canvas texture that types out live syntax-highlighted code with a blinking terminal cursor.
  - **⚡ Dev Code Tag `</>`**: High-voltage 3D developer code insignia with glowing neon chevrons, tilted center slash, and a floating logic node.
  - **🎨 UI/UX Design Layer Stack**: Isometric Figma-style floating glass UI layers with blueprint gridlines, UI components, vector Bézier curve pen tool with interactive anchor nodes, and floating color swatches.
  - **📱 Responsive Viewport Rig**: 3D studio monitor display + floating tilted mobile phone connected by holographic responsive layout guide beams.
  - **Orbiting 3D Tech Stack Logos**: 6 dual-sided 3D metallic badges orbiting the workstation with official branding and neon edge glows: **Figma**, **HTML5**, **CSS3**, **JavaScript (JS)**, **React**, and **TypeScript (TS)**.
  - **Mouse Parallax & Drag Rotation**: Click, drag, and spin the entire 3D workstation in full 360° space with inertia.
  - 2,800+ volumetric ambient particles swirling in 3D space with reactive camera depth.
- **Scroll-Driven 3D Camera Rig**:
  - The WebGL camera pans, zooms, and rotates along a 3D path as you scroll across sections.
- **Interactive 3D Lab Controller**:
  - Real-time model switcher: **💻 Cyber Laptop**, **⚡ Dev Tag**, **🎨 UI/UX Stack**, and **📱 Responsive Rig**.
  - Instant wireframe CAD blueprint toggle switch.
  - Theme switcher with 4 color modes: **Cyberpunk** (Cyan & Magenta), **Matrix** (Emerald & Neon Cyan), **Neon Violet** (Deep Purple & Electric Blue), and **Solar Flare** (Flame & Amber).
- **Interactive 3D Mini Project Canvases**:
  - Each featured project card embeds its own real-time Three.js WebGL scene (Space Portal, Neural Network, Luxury 3D Crystal, Matrix OS Grid) that accelerates when hovered.
- **3D Card Tilt & Specular Physics**:
  - Real-time perspective rotation on mouse movement with smooth return transitions.
  - Floating 3D layers that pop out along the Z-axis (`translateZ`).
  - Dynamic cursor-following specular glare and sheen.
- **Magnetic Buttons & Custom Cursor**:
  - Buttons magnetically pull toward the cursor when hovering nearby.
  - Custom fluid dual-ring glowing cursor with smooth lerp tracking.
- **Web Audio API Cyber Synthesizer**:
  - Zero external MP3/audio files needed; sounds are generated programmatically via Web Audio oscillators.
  - Subtle futuristic hover clicks, tactile confirmations, and harmonic theme chimes with a persistent mute toggle.
- **Dark Theme Cyber Aesthetic**:
  - Deep space darks (`#05050a`), neon accents, frosted glassmorphism (`backdrop-filter: blur`), glowing radar status pills, terminal emulator, and animated stats counters.

---

## 🚀 How to Run

### Method 1: Direct File Opening
Double-click `index.html` or drag it into any modern web browser (Chrome, Edge, Firefox, Brave, Safari).

### Method 2: Local HTTP Server (Recommended)
Using Node.js:
```bash
npx serve .
# or
npx http-server -p 3000
```

Using Python:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 🛠 Project Structure

```
portfolio-3d/
├── index.html           # Main semantic HTML5 markup & sections
├── css/
│   └── style.css        # Cyberpunk dark theme, glassmorphism, responsive styles
├── js/
│   ├── three-scene.js   # Three.js 3D engine, meshes, particles & camera spline
│   ├── tilt.js          # 3D card tilt physics, specular glare, magnetic buttons
│   ├── audio.js         # Web Audio API sound synthesizer
│   └── main.js          # Typewriter, stats counter, project filter, form handling
└── README.md            # Documentation
```

---

## 🎨 Customizing Your Portfolio

1. **Personal Information**:
   - Open `index.html` and search for `Alex Vance` to replace with your name.
   - Edit the terminal window section to customize your bio, title, and years of experience.
   - Update `mailto:alex@vance.dev` with your email.
2. **Projects**:
   - Update titles, descriptions, live demo links, and GitHub URLs in `.project-card` elements in `index.html`.
3. **Skills**:
   - Tweak skills and percentage bars in `.skill-item` elements.
4. **Theme & Colors**:
   - Modify color variables in `css/style.css` under `:root` or `[data-theme="..."]`.
