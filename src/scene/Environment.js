import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.currentPreset = 'studio';

    this.initLights();
    this.initPedestal();
    this.setPreset('studio');
  }

  initLights() {
    // 1. Balanced Ambient Light for clear shadow visibility
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    // 2. Primary Directional Sunlight (Key Light with soft contact shadows)
    this.sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
    this.sunLight.position.set(5.0, 7.5, 4.0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.camera.left = -3.5;
    this.sunLight.shadow.camera.right = 3.5;
    this.sunLight.shadow.camera.top = 3.5;
    this.sunLight.shadow.camera.bottom = -3.5;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // 3. Silhouette Rim Light (Highlight on horse spine, mane, and rump)
    this.rimLight = new THREE.DirectionalLight(0x93c5fd, 3.0);
    this.rimLight.position.set(-5.0, 4.5, -4.5);
    this.scene.add(this.rimLight);

    // 4. Subtle Warm Front Fill Light
    this.fillLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    this.fillLight.position.set(-3.5, 2.5, 3.5);
    this.scene.add(this.fillLight);

    // 5. Hemisphere Light for natural atmospheric bounce
    this.hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x1e293b, 1.0);
    this.hemiLight.position.set(0, 10, 0);
    this.scene.add(this.hemiLight);
  }

  initPedestal() {
    this.pedestal = new THREE.Group();

    // Main Stage Cylinder (Dark Luxury Slate Stone)
    const baseGeo = new THREE.CylinderGeometry(2.6, 2.75, 0.22, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x12151c,
      roughness: 0.75,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.11;
    baseMesh.receiveShadow = true;
    this.pedestal.add(baseMesh);

    // Metallic Brass / Gold Accent Outer Perimeter Ring
    const ringGeo = new THREE.RingGeometry(2.46, 2.58, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.85,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.003;
    ringMesh.receiveShadow = true;
    this.pedestal.add(ringMesh);

    // Dark Charcoal Inlay Disc (Where the horse stands)
    const insetGeo = new THREE.CircleGeometry(2.45, 64);
    const insetMat = new THREE.MeshStandardMaterial({
      color: 0x181c24,
      roughness: 0.65,
      metalness: 0.15
    });
    const insetMesh = new THREE.Mesh(insetGeo, insetMat);
    insetMesh.rotation.x = -Math.PI / 2;
    insetMesh.position.y = 0.002;
    insetMesh.receiveShadow = true;
    this.pedestal.add(insetMesh);

    // Ground Contact Shadow Receiver
    const groundGeo = new THREE.PlaneGeometry(35, 35);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.22;
    groundMesh.receiveShadow = true;
    this.pedestal.add(groundMesh);

    this.scene.add(this.pedestal);
  }

  setPreset(preset) {
    this.currentPreset = preset;

    switch (preset) {
      case 'sunset': // Golden Hour Sunset
        this.scene.background = new THREE.Color(0x1a0f1c);
        if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x1a0f1c);
        this.ambientLight.color.setHex(0xffedd5);
        this.ambientLight.intensity = 0.85;
        this.sunLight.color.setHex(0xff8f00);
        this.sunLight.intensity = 3.4;
        this.sunLight.position.set(6.0, 4.0, 3.5);
        this.rimLight.color.setHex(0xf43f5e);
        this.rimLight.intensity = 2.8;
        this.fillLight.color.setHex(0xfbbf24);
        this.fillLight.intensity = 1.6;
        this.hemiLight.color.setHex(0x7e22ce);
        this.hemiLight.groundColor.setHex(0x3b1805);
        this.hemiLight.intensity = 1.2;
        break;

      case 'meadow': // Natural Morning Daylight
        this.scene.background = new THREE.Color(0x0e1713);
        if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x0e1713);
        this.ambientLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 0.9;
        this.sunLight.color.setHex(0xfffbeb);
        this.sunLight.intensity = 2.8;
        this.sunLight.position.set(4.0, 8.0, 4.0);
        this.rimLight.color.setHex(0x6ee7b7);
        this.rimLight.intensity = 2.2;
        this.fillLight.color.setHex(0xf0fdf4);
        this.fillLight.intensity = 1.4;
        this.hemiLight.color.setHex(0xbae6fd);
        this.hemiLight.groundColor.setHex(0x14532d);
        this.hemiLight.intensity = 1.4;
        break;

      case 'studio': // Cinematic Luxury Dark Studio
      default:
        this.scene.background = new THREE.Color(0x0c0f17);
        if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x0c0f17);
        this.ambientLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 0.8;
        this.sunLight.color.setHex(0xffffff);
        this.sunLight.intensity = 2.6;
        this.sunLight.position.set(5.0, 7.5, 4.0);
        this.rimLight.color.setHex(0x93c5fd);
        this.rimLight.intensity = 3.0;
        this.fillLight.color.setHex(0xffedd5);
        this.fillLight.intensity = 1.4;
        this.hemiLight.color.setHex(0xf8fafc);
        this.hemiLight.groundColor.setHex(0x1e293b);
        this.hemiLight.intensity = 1.0;
        break;
    }
  }

  setSunIntensity(intensity) {
    this.sunLight.intensity = Math.max(0, intensity);
  }

  setShadows(enabled) {
    this.sunLight.castShadow = enabled;
  }
}
