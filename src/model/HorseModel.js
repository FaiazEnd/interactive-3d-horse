import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ProceduralHorse } from './ProceduralHorse.js';

export class HorseModel {
  constructor(scene) {
    this.scene = scene;
    this.isLoaded = false;
    this.mesh = null;
    this.mixer = null;
    this.action = null;
    this.clip = null;
    this.proceduralFallback = null;

    // Animation & Gait state
    this.currentGait = 'gallop';
    this.playbackSpeed = 1.0;
    this.isPaused = false;
    this.petReactionTimer = 0;

    // Coat presets
    this.coatPresets = {
      chestnut: { name: 'Chestnut', color: '#793816', roughness: 0.55 },
      black: { name: 'Black Stallion', color: '#161616', roughness: 0.42 },
      palomino: { name: 'Palomino White', color: '#efe6d5', roughness: 0.50 },
      bay: { name: 'Mahogany Bay', color: '#4e2716', roughness: 0.52 },
      gray: { name: 'Dapple Gray', color: '#7c8084', roughness: 0.56 }
    };
    this.currentCoat = 'chestnut';
    this.customColor = '#793816';
    this.currentRoughness = 0.55;
    this.isWireframe = false;
  }

  // Create high-detail micro-fur procedural bump texture
  createFurTexture() {
    if (typeof document === 'undefined') return null;

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 45;
      const val = Math.min(255, Math.max(0, 128 + noise));
      data[i] = val;     // R
      data[i + 1] = val; // G
      data[i + 2] = val; // B
      data[i + 3] = 255; // A
    }

    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    return texture;
  }

  async load() {
    const basePath = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
      ? import.meta.env.BASE_URL
      : '/';
    const modelUrl = `${basePath.replace(/\/$/, '')}/models/horse.glb`;

    const loader = new GLTFLoader();

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(modelUrl, resolve, undefined, reject);
      });

      const horseMesh = gltf.scene.children[0];
      if (!horseMesh) {
        throw new Error('GLTF loaded but child mesh is missing');
      }

      this.mesh = horseMesh;

      // Realistic PBR material with fur micro-bump & morph targets
      const furBumpMap = this.createFurTexture();

      this.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(this.coatPresets[this.currentCoat].color),
        roughness: this.currentRoughness,
        metalness: 0.08,
        bumpMap: furBumpMap,
        bumpScale: 0.002,
        morphTargets: true
      });

      this.mesh.material = this.material;
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;

      // Scale and position horse properly on pedestal
      this.mesh.scale.set(0.009, 0.009, 0.009);
      this.mesh.position.set(0, 0, 0);
      this.mesh.rotation.y = Math.PI / 4; // Hero 3/4 pose

      this.scene.add(this.mesh);

      // Setup AnimationMixer
      this.mixer = new THREE.AnimationMixer(this.mesh);
      if (gltf.animations && gltf.animations.length > 0) {
        this.clip = gltf.animations[0];
        this.action = this.mixer.clipAction(this.clip);
        this.action.setDuration(1.2);
        this.action.play();
        this.updateGaitSpeed();
      }

      this.isLoaded = true;
      return true;
    } catch (err) {
      console.warn('Could not load horse.glb, activating ProceduralHorse fallback:', err);
      this.proceduralFallback = new ProceduralHorse();
      this.scene.add(this.proceduralFallback.group);
      this.isLoaded = true;
      return false;
    }
  }

  updateGaitSpeed() {
    if (!this.action) return;

    if (this.isPaused) {
      this.action.timeScale = 0;
      return;
    }

    let gaitFactor = 1.0;
    switch (this.currentGait) {
      case 'gallop':
        gaitFactor = 1.0;
        break;
      case 'trot':
        gaitFactor = 0.55;
        break;
      case 'walk':
        gaitFactor = 0.28;
        break;
      case 'idle':
        gaitFactor = 0.05;
        break;
    }

    let petBoost = 1.0;
    if (this.petReactionTimer > 0) {
      petBoost = 1.75;
    }

    this.action.timeScale = gaitFactor * this.playbackSpeed * petBoost;
  }

  setGait(gaitName) {
    this.currentGait = gaitName;
    this.updateGaitSpeed();
  }

  setSpeed(speed) {
    this.playbackSpeed = speed;
    this.updateGaitSpeed();
  }

  setPaused(paused) {
    this.isPaused = paused;
    this.updateGaitSpeed();
  }

  setCoat(presetOrColor) {
    if (this.coatPresets[presetOrColor]) {
      this.currentCoat = presetOrColor;
      const preset = this.coatPresets[presetOrColor];
      this.applyColor(preset.color);
      this.setRoughness(preset.roughness);
    } else {
      this.currentCoat = 'custom';
      this.applyColor(presetOrColor);
    }
  }

  applyColor(colorHex) {
    this.customColor = colorHex;
    const color = new THREE.Color(colorHex);

    if (this.material) {
      this.material.color.copy(color);
    }
    if (this.proceduralFallback) {
      this.proceduralFallback.setCoat(colorHex);
    }
  }

  setRoughness(roughness) {
    this.currentRoughness = roughness;
    if (this.material) {
      this.material.roughness = roughness;
    }
    if (this.proceduralFallback) {
      this.proceduralFallback.setRoughness(roughness);
    }
  }

  setWireframe(enabled) {
    this.isWireframe = enabled;
    if (this.material) {
      this.material.wireframe = enabled;
    }
    if (this.proceduralFallback) {
      this.proceduralFallback.setWireframe(enabled);
    }
  }

  triggerPetReaction() {
    this.petReactionTimer = 1.0;
    this.updateGaitSpeed();

    if (this.proceduralFallback) {
      this.proceduralFallback.triggerPetReaction();
    }
  }

  update(delta) {
    if (this.mixer && !this.isPaused) {
      this.mixer.update(delta);
    }

    if (this.proceduralFallback) {
      this.proceduralFallback.update(delta);
    }

    // Pet reaction dynamic spring
    if (this.petReactionTimer > 0) {
      this.petReactionTimer -= delta;
      if (this.petReactionTimer <= 0) {
        this.petReactionTimer = 0;
        this.updateGaitSpeed();
      }

      if (this.mesh) {
        const progress = this.petReactionTimer / 1.0;
        // Spring rear-up angle
        this.mesh.rotation.x = -Math.sin(progress * Math.PI) * 0.18;
        this.mesh.position.y = Math.sin(progress * Math.PI) * 0.22;
      }
    } else if (this.mesh) {
      this.mesh.rotation.x = 0;
      this.mesh.position.y = 0;
    }
  }
}
