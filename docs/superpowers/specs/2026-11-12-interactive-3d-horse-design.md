# Architectural Design Spec: Interactive 3D Horse Showcase

**Date:** 2026-11-12  
**Status:** Approved by User  
**Target Repository:** `FaiazEnd/interactive-3d-horse`  
**Local Project Path:** `C:\Users\pc\.gemini\antigravity\scratch\interactive-3d-horse`  

---

## 1. Executive Summary & Aesthetic Mandate

The objective of this project is to create an **ultra-realistic, high-performance, interactive 3D horse model showcase** using **Three.js** and **Vite**.

### Core Aesthetic Requirement ("Hella Realistic")
To avoid a low-fidelity or amateur appearance, the visual presentation must achieve photorealistic lighting, physically based rendering (PBR), and fluid anatomical motion:
1. **Photorealistic PBR Materials**: Utilizing `MeshStandardMaterial` / `MeshPhysicalMaterial` with calibrated roughness (0.45–0.65), micro-bump/normal detailing, coat sheen, and accurate light reflection for horse coats (Chestnut, Midnight Stallion, Golden Palomino, Bay, Dapple Gray).
2. **Cinematic Studio & Natural Lighting**: Dual-light setup with high-resolution soft contact shadows (`PCFSoftShadowMap`, 2048x2048 resolution), directional sunlight, fill light, and a dedicated rim/back-light to carve out the muscular horse silhouette against the backdrop.
3. **ACES Filmic Tone Mapping**: Industry-standard color grading (`THREE.ACESFilmicToneMapping`) with linear-to-sRGB output (`THREE.SRGBColorSpace`) to prevent overexposed highlights and washed-out shadows.
4. **Fluid Skeletal / Morph Animation**: Smooth cross-faded gait transitions (Gallop, Trot, Walk, Idle) via `THREE.AnimationMixer` with variable playback speed (0.2x slow-mo to 2.5x gallop sprint).
5. **Polished Pedestal Stage**: A circular luxury showcase stage with subtle metallic/stone rim, radial ambient occlusion, and shadow absorption so the model feels grounded in physical space.

---

## 2. System Architecture & Component Breakdown

```
interactive-3d-horse/
├── index.html                  # HTML5 entrypoint with responsive canvas & HUD overlay
├── package.json                # Dependencies: three, lil-gui
├── vite.config.js              # Vite dev server & GitHub Pages base path config
├── public/
│   └── models/
│       └── horse.glb           # Bundled realistic animated 3D horse model
├── src/
│   ├── main.js                 # App bootstrap, main animation loop & coordinator
│   ├── scene/
│   │   ├── SceneManager.js     # WebGLRenderer, Scene, PerspectiveCamera, OrbitControls & resize
│   │   └── Environment.js      # Realistic lighting presets (Studio, Sunset, Meadow) & pedestal
│   ├── model/
│   │   ├── HorseModel.js       # GLTF loader, PBR coat materials, AnimationMixer & cross-fading
│   │   └── ProceduralHorse.js  # Stylized emergency fallback mesh if asset fetch is interrupted
│   ├── interaction/
│   │   ├── InteractionManager.js # Raycasting, hover pointer, click-to-pet reaction & particle burst
│   │   └── ParticleSystem.js   # Golden dust / sparkle physics for interactive petting feedback
│   ├── ui/
│   │   ├── ControlsUI.js       # lil-gui panel (animations, speed, coat colors, lighting, camera)
│   │   └── HUD.js              # Responsive glassmorphism badge, help toasts, and FPS stats
│   └── style.css               # Reset, dark theme, modern 100dvh responsive layout
```

### Module Responsibilities

#### `SceneManager.js`
- Initializes `THREE.WebGLRenderer` with `antialias: true`, `powerPreference: "high-performance"`, and pixel ratio clamped to `Math.min(window.devicePixelRatio, 2)`.
- Configures `toneMapping = THREE.ACESFilmicToneMapping`, `toneMappingExposure = 1.05`, and `shadowMap.type = THREE.PCFSoftShadowMap`.
- Manages `THREE.PerspectiveCamera` (FOV 45°, near 0.1, far 100) focused on the horse's center of mass.
- Manages `OrbitControls` with smooth inertia damping (`enableDamping: true`, `dampingFactor: 0.05`), distance limits (`minDistance: 2.0`, `maxDistance: 12.0`), and polar angle limit (`maxPolarAngle: Math.PI / 2 - 0.02`) to prevent clipping under the floor.
- Implements viewport resize listener adhering to modern web guidance (`100dvh`).

#### `Environment.js`
- **Lighting Presets**:
  - **Luxury Studio**: Neutral key spotlight, soft blue rim light (`#64B5F6`), warm fill light (`#FFE082`), subtle floor reflection.
  - **Golden Hour / Sunset**: Low-angle amber directional sunlight (`#FF8F00`, intensity 2.8), dusk purple fill (`#4A148C`), long dramatic shadows.
  - **Lush Meadow / Daylight**: Crisp morning sun (`#FFF8E1`), sky hemisphere light (`#81D4FA` sky, `#33691E` grass bounce), airy distance fog.
- **Stage Floor**: Circular pedestal with beveled edge, radial gradient texture, and shadow-catcher material preventing hard floor edges.

#### `HorseModel.js`
- Loads `public/models/horse.glb` via `GLTFLoader`.
- Traverses mesh hierarchy to apply:
  - `castShadow = true`, `receiveShadow = true`.
  - PBR material tuning: `MeshStandardMaterial` with coat sheen, customized roughness map, specular highlights, and natural hoof/mane textures.
- Manages `AnimationMixer`:
  - Registers animations: `Gallop`, `Trot`, `Idle`, and reactive pose.
  - Implements smooth cross-fading (`crossFadeTo(duration: 0.4s)`) between gaits.
  - Exposes `setPlaybackRate(speed)` and `pause()`/`resume()`.
- Coat Presets:
  - **Chestnut**: `#793816`, roughness 0.58.
  - **Black Stallion**: `#161616`, roughness 0.42.
  - **Palomino / White**: `#EFE6D5`, roughness 0.52.
  - **Bay**: `#4E2716`, dark points.
  - **Dapple Gray**: `#7C8084`, subtle mottling.
  - Custom Color: Dynamic reactive hex color picker.

#### `InteractionManager.js` & `ParticleSystem.js`
- Uses `THREE.Raycaster` tracking normalized pointer coordinates `(x, y)`.
- Changes mouse cursor to `pointer` when hovering over the horse.
- On click / tap:
  - Triggers a dynamic "petting" animation: momentary rearing up / trot spring combined with a slight head tilt.
  - Emits a bursting fountain of 30 golden sparkle particles at the exact 3D raycast intersection point using physics velocities and gravity fade-out.

#### `ControlsUI.js` & `HUD.js`
- Clean `lil-gui` menu floating in the top-right corner with grouped folders:
  - 🐎 **Animation**: Gait dropdown, Playback Speed (0.2x – 2.5x), Play/Pause.
  - 🎨 **Appearance**: Coat Presets, Custom Coat Color picker, Roughness slider, Wireframe toggle.
  - 💡 **Lighting**: Preset switcher (Studio, Sunset, Meadow), Sun Intensity, Shadow toggle.
  - 📷 **Camera**: Viewpoint buttons (Hero Front, Side Profile, Head Portrait, Top Down), Auto-rotate toggle.
- Non-intrusive bottom HUD hint with glassmorphism styling informing users how to orbit, zoom, pan, and click to pet.

---

## 3. Deployment, GitHub Integration & Hosting

1. **Git Initialization**:
   - `git init`, `.gitignore` covering `node_modules/`, `dist/`, `.DS_Store`, etc.
   - Initial commit of project files.
2. **GitHub Repository Creation**:
   - Authenticated creation via `gh repo create FaiazEnd/interactive-3d-horse --public --source=. --push`.
3. **Automated Live Hosting on GitHub Pages**:
   - Configured with `vite.config.js` `base: '/interactive-3d-horse/'`.
   - Built with `npm run build`.
   - Deployed to GitHub Pages branch `gh-pages` or via GitHub Actions workflow, delivering an immediate public URL: `https://faiazend.github.io/interactive-3d-horse/`.

---

## 4. Verification & Testing Strategy

1. **Local Dev & Visual Verification**:
   - Start Vite local dev server (`npm run dev`).
   - Validate 60fps rendering, shadow quality, material sheen, and animation cross-fades.
   - Verify raycast petting interaction and particle effects.
   - Test responsive layout on various viewport dimensions.
2. **Build & Bundle Verification**:
   - Run `npm run build` to verify zero build errors, asset chunk hashing, and clean output in `dist/`.
   - Run `npm run preview` to verify production assets and base path handling.
3. **Live Deployment Verification**:
   - Push to GitHub and verify GitHub Pages builds successfully.
   - Access the live hosted URL and verify WebGL initializes cleanly on production with zero console errors.
