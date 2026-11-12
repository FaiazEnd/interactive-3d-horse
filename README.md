# 🐎 Interactive 3D Equine Stallion Showcase

> An ultra-realistic, high-performance, interactive 3D horse showcase rendered in real-time with **Three.js** and **Vite**.

🌐 **Live Demo:** [https://faiazend.github.io/interactive-3d-horse/](https://faiazend.github.io/interactive-3d-horse/)  
📦 **Repository:** [https://github.com/FaiazEnd/interactive-3d-horse](https://github.com/FaiazEnd/interactive-3d-horse)

---

## ✨ Features & Visual Realism

- **Photorealistic PBR Pipeline**: Realistic `MeshStandardMaterial` / `MeshPhysicalMaterial` with fine-tuned micro-fur bump maps, calibrated coat roughness, specular sheen, and natural light reflection.
- **Skeletal & Morph Motion**: Smooth cross-faded animation gaits (**Gallop**, **Trot**, **Walk**, **Idle**) powered by `THREE.AnimationMixer` with variable playback speed from 0.2x slow-motion to 2.5x sprint.
- **Dynamic Lighting Environments**:
  - 🏛️ **Luxury Studio**: Neutral key spotlight, soft blue rim light (`#64B5F6`), warm fill, and pedestal stage reflection.
  - 🌅 **Golden Hour Sunset**: Dramatic low-angle amber sun (`#FF8F00`), dusk purple fill (`#4A148C`), and long cast shadows.
  - 🌿 **Lush Meadow**: Crisp morning sun (`#FFF8E1`), sky hemisphere reflection (`#81D4FA` / `#33691E`).
- **Soft Contact Shadows**: High-resolution 2048x2048 `PCFSoftShadowMap` with normal bias compensation to eliminate shadow acne.
- **Interactive Petting & Raycasting**: Hover detection switches pointer cursor; click/tap triggers dynamic rearing reaction with a bursting fountain of 35 golden sparkle particles.
- **Floating Controls (`lil-gui`)**: Customize gaits, speed, coat presets (Chestnut, Black Stallion, White Palomino, Mahogany Bay, Dapple Gray), custom hex tint, light intensity, and camera angles.
- **Responsive & Mobile-Ready**: Built with modern CSS dynamic viewport units (`100dvh`), fluid typography, and touch gesture support.
- **Fail-Safe Fallback**: Includes `ProceduralHorse` to guarantee zero downtime if network or external assets are ever interrupted.

---

## 🎮 Controls

| Action | Control |
|---|---|
| **Rotate / Orbit** | Left-click + drag / Single touch + swipe |
| **Zoom** | Mouse scroll wheel / Pinch in & out |
| **Pan** | Right-click + drag / Two-finger swipe |
| **Pet Horse** | Click or tap anywhere on the horse body |
| **Camera Presets** | Use GUI to toggle Hero, Profile, Head, or Top views |

---

## 🛠️ Development & Building

```bash
# 1. Clone repository
git clone https://github.com/FaiazEnd/interactive-3d-horse.git
cd interactive-3d-horse

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview
```

---

## 📄 License

MIT © [FaiazEnd](https://github.com/FaiazEnd)
