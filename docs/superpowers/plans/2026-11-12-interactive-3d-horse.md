# Interactive 3D Horse Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and host an ultra-realistic, high-performance, interactive 3D horse showcase web application using Three.js and Vite, with smooth skeletal animations, PBR materials, switchable lighting environments, click-to-pet raycasting, and GitHub Pages deployment.

**Architecture:** A modular vanilla Three.js architecture featuring `SceneManager` (central render loop, ACES tone mapping, OrbitControls), `Environment` (photorealistic lighting presets & pedestal stage), `HorseModel` (GLTF loader, PBR coat customization, `AnimationMixer` cross-fading, procedural fallback), `InteractionManager` (raycast hover & petting particle bursts), and `ControlsUI` (`lil-gui` + responsive HUD).

**Tech Stack:** Three.js (r160+), Vite, lil-gui, Modern CSS (100dvh, flexbox/grid), GitHub CLI (`gh`), GitHub Pages.

**Spec:** [docs/superpowers/specs/2026-11-12-interactive-3d-horse-design.md](file:///C:/Users/pc/.gemini/antigravity/scratch/interactive-3d-horse/docs/superpowers/specs/2026-11-12-interactive-3d-horse-design.md)

## Global Constraints
- Target repository: `FaiazEnd/interactive-3d-horse`
- Local project root: `C:\Users\pc\.gemini\antigravity\scratch\interactive-3d-horse`
- Realistic visual aesthetics: PBR materials, `ACESFilmicToneMapping`, `SRGBColorSpace`, 2048x2048 `PCFSoftShadowMap`
- Zero layout shift: Dynamic viewport units (`100dvh`), container-safe canvas sizing
- Fail-safe asset loading: `ProceduralHorse` fallback if asset loading encounters any hitch
- Production base URL: `/interactive-3d-horse/` for GitHub Pages hosting

## Review Focus
1. **Asset Fetch / Path Resolution**: Horse GLB asset must resolve correctly in both Vite local dev (`/models/horse.glb`) and GitHub Pages (`/interactive-3d-horse/models/horse.glb`).
2. **Animation Mixer Blending**: Transitioning between Gallop, Trot, and Idle must smoothly cross-fade without popping or joint inversion.
3. **PBR Material Realism**: Coat sheen, roughness, and specular response must look authentic under all 3 lighting presets (Studio, Sunset, Meadow) without clipping or blown-out highlights.
4. **Touch & Click Raycasting**: Raycaster must reliably intersect animated morph/skinned mesh coordinates across responsive screen sizes.
5. **Mobile Viewport Resizing**: Canvas and controls must gracefully adapt to browser UI appearance/disappearance using `100dvh`.

---

### Task 1: Project Scaffolding, Build Setup, Assets & Package Configuration

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/style.css`
- Create: `public/models/horse.glb`
- Create: `.gitignore`

**Interfaces:**
- Produces: Vite development server (`npm run dev`) and production build pipeline (`npm run build`).

- [ ] **Step 1: Create `package.json` with Three.js and lil-gui dependencies**
- [ ] **Step 2: Create `vite.config.js` with `/interactive-3d-horse/` base path**
- [ ] **Step 3: Setup `.gitignore` (node_modules, dist, cache)**
- [ ] **Step 4: Fetch and place official Three.js animated Horse GLTF asset into `public/models/horse.glb`**
- [ ] **Step 5: Create `index.html` with responsive canvas element, meta viewport, and HUD container**
- [ ] **Step 6: Create `src/style.css` with 100dvh viewport reset, glassmorphism HUD styles, and custom scrollbar**
- [ ] **Step 7: Run `npm install` and verify package installation**
- [ ] **Step 8: Commit Task 1 files**

---

### Task 2: SceneManager, Camera, ACES Tone Mapping & OrbitControls

**Files:**
- Create: `src/scene/SceneManager.js`
- Create: `tests/sceneManager.test.js` (or verification script)

**Interfaces:**
- Consumes: `index.html` `#webgl-canvas` element.
- Produces: `SceneManager` instance providing `scene`, `camera`, `renderer`, `controls`, and `onTick(callback)` animation loop.

- [ ] **Step 1: Implement `SceneManager.js` with WebGLRenderer configuration**
  - `antialias: true`, `powerPreference: "high-performance"`
  - `outputColorSpace: THREE.SRGBColorSpace`
  - `toneMapping: THREE.ACESFilmicToneMapping`, `toneMappingExposure: 1.05`
  - `shadowMap.enabled: true`, `shadowMap.type: THREE.PCFSoftShadowMap`
- [ ] **Step 2: Implement PerspectiveCamera and OrbitControls with damping**
  - `camera.fov = 45`, `near = 0.1`, `far = 100`
  - `controls.enableDamping = true`, `dampingFactor = 0.05`
  - `minDistance = 2.0`, `maxDistance = 14.0`, `maxPolarAngle = Math.PI / 2 - 0.02`
- [ ] **Step 3: Implement dynamic resize listener using `window.innerWidth` and `window.innerHeight`**
- [ ] **Step 4: Implement delta time clock (`THREE.Clock`) and ticker loop**
- [ ] **Step 5: Verify scene rendering and camera orbit**
- [ ] **Step 6: Commit Task 2 files**

---

### Task 3: Photorealistic Environment, Lighting Presets & Circular Pedestal

**Files:**
- Create: `src/scene/Environment.js`

**Interfaces:**
- Consumes: `SceneManager.scene`
- Produces: `Environment` instance with methods `setPreset(name)`, `setSunIntensity(val)`, `setShadows(enabled)`.

- [ ] **Step 1: Implement circular pedestal stage mesh**
  - Textured circular stage with beveled brass/dark stone rim.
  - Shadow-receiving ground plane catching soft contact shadows.
- [ ] **Step 2: Implement 3 lighting presets**
  - **Studio**: Overhead key spotlight, cool rim light (`#64B5F6`), warm fill light (`#FFE082`).
  - **Sunset**: Dramatic low-angle amber sun (`#FF8F00`), dusk fill (`#4A148C`), long cast shadows.
  - **Meadow**: Bright morning sun (`#FFF8E1`), sky hemisphere light (`#81D4FA` / `#33691E`).
- [ ] **Step 3: Configure 2048x2048 shadow maps with soft bias to prevent acne**
- [ ] **Step 4: Implement preset transition logic**
- [ ] **Step 5: Verify lighting and shadow rendering**
- [ ] **Step 6: Commit Task 3 files**

---

### Task 4: HorseModel Loading, PBR Coat Material & Animation Mixer

**Files:**
- Create: `src/model/HorseModel.js`
- Create: `src/model/ProceduralHorse.js`

**Interfaces:**
- Consumes: `SceneManager.scene`, `public/models/horse.glb`
- Produces: `HorseModel` instance with methods `load()`, `update(delta)`, `setGait(name)`, `setSpeed(speed)`, `setCoat(presetOrColor)`, `setRoughness(val)`, `setWireframe(bool)`, `triggerPetReaction()`.

- [ ] **Step 1: Implement `HorseModel.js` GLTF loader with base path support**
- [ ] **Step 2: Implement mesh traversal for shadow casting and PBR material setup**
  - Apply `MeshStandardMaterial` with coat sheen, normal micro-detail, and realistic roughness.
- [ ] **Step 3: Implement `AnimationMixer` cross-fading system**
  - Support `Gallop`, `Trot`, `Idle` animations with 0.4s cross-fade ease.
  - Support playback speed multiplier (`0.2x` – `2.5x`).
- [ ] **Step 4: Implement coat presets (Chestnut, Black Stallion, Palomino, Bay, Dapple Gray) and custom color tint**
- [ ] **Step 5: Implement `ProceduralHorse.js` fallback mesh**
- [ ] **Step 6: Verify model loads, casts shadows, and animations blend seamlessly**
- [ ] **Step 7: Commit Task 4 files**

---

### Task 5: ParticleSystem & Interactive Click-to-Pet Raycasting

**Files:**
- Create: `src/interaction/ParticleSystem.js`
- Create: `src/interaction/InteractionManager.js`

**Interfaces:**
- Consumes: `SceneManager.camera`, `SceneManager.renderer.domElement`, `HorseModel`
- Produces: `InteractionManager` with raycasting click/hover listeners, emitting spark particles on pet.

- [ ] **Step 1: Implement `ParticleSystem.js` for golden sparkle burst**
  - Instanced or buffer geometry particles with velocity, gravity, and alpha decay.
- [ ] **Step 2: Implement raycasting hover detection on horse mesh**
  - Cursor switches to `pointer` when hovering over the horse.
- [ ] **Step 3: Implement click/tap trigger on horse**
  - Triggers horse pet reaction animation and spawns 30 golden sparkle particles at contact point.
- [ ] **Step 4: Verify raycasting and particle physics in render loop**
- [ ] **Step 5: Commit Task 5 files**

---

### Task 6: Controls UI (`lil-gui`), HUD Overlay & Application Coordination

**Files:**
- Create: `src/ui/ControlsUI.js`
- Create: `src/ui/HUD.js`
- Modify: `src/main.js`

**Interfaces:**
- Consumes: `SceneManager`, `Environment`, `HorseModel`, `InteractionManager`
- Produces: Full interactive experience with floating `lil-gui` panel and responsive HUD.

- [ ] **Step 1: Implement `ControlsUI.js` using `lil-gui`**
  - Animation folder: Gait selector, Playback speed, Play/Pause.
  - Appearance folder: Coat preset, Custom color, Roughness, Wireframe toggle.
  - Lighting folder: Environment preset, Light intensity, Shadows toggle.
  - Camera folder: Camera presets (Hero, Profile, Head, Top), Auto-rotate toggle.
- [ ] **Step 2: Implement `HUD.js` with responsive glassmorphism badge and instruction tips**
- [ ] **Step 3: Wire modules together in `src/main.js`**
- [ ] **Step 4: Verify full interactivity and control responsiveness**
- [ ] **Step 5: Commit Task 6 files**

---

### Task 7: Visual Polish, Verification & Production Build

**Files:**
- Verify: Full codebase in local browser

- [ ] **Step 1: Start local dev server (`npm run dev`) and verify 60fps performance and visuals**
- [ ] **Step 2: Verify all 3 lighting presets, coat colors, animations, and raycast interactions**
- [ ] **Step 3: Run `npm run build` to verify zero production build errors**
- [ ] **Step 4: Run `npm run preview` to verify production assets and base path `/interactive-3d-horse/`**
- [ ] **Step 5: Commit Task 7 updates**

---

### Task 8: GitHub Repository Creation & GitHub Pages Deployment

**Files:**
- Deploy: GitHub repository `FaiazEnd/interactive-3d-horse`
- Deploy: GitHub Pages branch `gh-pages`

- [ ] **Step 1: Verify git status and all local commits**
- [ ] **Step 2: Create public GitHub repo `FaiazEnd/interactive-3d-horse` with `gh repo create`**
- [ ] **Step 3: Build production bundle into `dist/` and deploy to `gh-pages` branch**
- [ ] **Step 4: Enable GitHub Pages on `gh-pages` branch via GitHub CLI**
- [ ] **Step 5: Verify live URL `https://faiazend.github.io/interactive-3d-horse/`**
