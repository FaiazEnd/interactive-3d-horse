import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class SceneManager {
  constructor(canvas) {
    if (!canvas) {
      throw new Error('SceneManager requires a valid HTML canvas element');
    }

    this.canvas = canvas;
    this.tickCallbacks = [];
    this.clock = new THREE.Clock();
    this.isRunning = false;
    this.animationFrameId = null;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0e14);
    this.scene.fog = new THREE.FogExp2(0x0c0e14, 0.035);

    // 2. Camera
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(4.5, 2.2, 5.5);

    // 3. Renderer with PBR & ACES Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. OrbitControls with smooth inertia damping
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 1.1, 0);
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 14.0;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent looking below stage
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1.2;

    // 5. Responsive Resize Listener
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onTick(callback) {
    if (typeof callback === 'function') {
      this.tickCallbacks.push(callback);
    }
  }

  setCameraPreset(preset) {
    const target = this.controls.target;
    switch (preset) {
      case 'hero': // 3/4 Perspective
        this.camera.position.set(4.2, 2.0, 4.8);
        target.set(0, 1.1, 0);
        break;
      case 'profile': // Pure side profile
        this.camera.position.set(5.5, 1.6, 0.0);
        target.set(0, 1.1, 0);
        break;
      case 'head': // Close-up portrait
        this.camera.position.set(2.2, 1.9, 1.8);
        target.set(0.6, 1.6, 0.2);
        break;
      case 'top': // Overhead dramatic
        this.camera.position.set(0.1, 6.5, 2.0);
        target.set(0, 0.8, 0);
        break;
      default:
        this.camera.position.set(4.5, 2.2, 5.5);
        target.set(0, 1.1, 0);
    }
    this.controls.update();
  }

  setAutoRotate(enabled, speed = 1.2) {
    this.controls.autoRotate = enabled;
    this.controls.autoRotateSpeed = speed;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();

    const loop = () => {
      if (!this.isRunning) return;
      this.animationFrameId = requestAnimationFrame(loop);

      const delta = this.clock.getDelta();
      const elapsedTime = this.clock.getElapsedTime();

      this.controls.update();

      for (let i = 0; i < this.tickCallbacks.length; i++) {
        this.tickCallbacks[i](delta, elapsedTime);
      }

      this.renderer.render(this.scene, this.camera);
    };

    loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
  }
}
