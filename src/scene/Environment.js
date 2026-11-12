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
    // 1. Primary Directional Sunlight (Key Light with soft contact shadows)
    this.sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    this.sunLight.position.set(5.5, 8.5, 4.5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -4.5;
    this.sunLight.shadow.camera.right = 4.5;
    this.sunLight.shadow.camera.top = 4.5;
    this.sunLight.shadow.camera.bottom = -4.5;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);

    // 2. Silhouette Rim Light (carves out horse muscle anatomy and spine)
    this.rimLight = new THREE.DirectionalLight(0x64b5f6, 2.2);
    this.rimLight.position.set(-6.0, 4.5, -5.5);
    this.scene.add(this.rimLight);

    // 3. Subtle Warm Fill Light
    this.fillLight = new THREE.DirectionalLight(0xffecd2, 0.7);
    this.fillLight.position.set(-4.0, 3.0, 4.0);
    this.scene.add(this.fillLight);

    // 4. Ambient Hemisphere Light for natural color bleeding
    this.hemiLight = new THREE.HemisphereLight(0x334155, 0x0f172a, 0.85);
    this.hemiLight.position.set(0, 10, 0);
    this.scene.add(this.hemiLight);
  }

  initPedestal() {
    this.pedestal = new THREE.Group();

    // Main Stage Cylinder (Luxury Dark Matte Stone)
    const baseGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.28, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x161922,
      roughness: 0.38,
      metalness: 0.15
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.14;
    baseMesh.receiveShadow = true;
    this.pedestal.add(baseMesh);

    // Metallic Brass / Gold Accent Bevel Ring
    const ringGeo = new THREE.CylinderGeometry(4.22, 4.22, 0.06, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.28,
      metalness: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -0.03;
    ringMesh.receiveShadow = true;
    this.pedestal.add(ringMesh);

    // Inner Inset Pedestal Mat (Catches subtle contact shadows without clipping)
    const insetGeo = new THREE.CircleGeometry(3.95, 64);
    const insetMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e28,
      roughness: 0.55,
      metalness: 0.1
    });
    const insetMesh = new THREE.Mesh(insetGeo, insetMat);
    insetMesh.rotation.x = -Math.PI / 2;
    insetMesh.position.y = 0.002;
    insetMesh.receiveShadow = true;
    this.pedestal.add(insetMesh);

    // Ground Contact Shadow Receiver
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.28;
    groundMesh.receiveShadow = true;
    this.pedestal.add(groundMesh);

    this.scene.add(this.pedestal);
  }

  setPreset(preset) {
    this.currentPreset = preset;

    switch (preset) {
      case 'sunset': // Golden Hour
        this.scene.background = new THREE.Color(0x1a0d18);
        if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x1a0d18);
        this.sunLight.color.setHex(0xff8f00);
        this.sunLight.intensity = 2.6;
        this.sunLight.position.set(7.0, 4.5, 4.0);
        this.rimLight.color.setHex(0xff4081);
        this.rimLight.intensity = 2.2;
        this.fillLight.color.setHex(0xffb74d);
        this.fillLight.intensity = 0.9;
        this.hemiLight.color.setHex(0x7b1fa2);
        this.hemiLight.groundColor.setHex(0x3e2723);
        this.hemiLight.intensity = 1.0;
        break;

      case 'meadow': // Natural Morning Sunlight
        this.scene.background = new THREE.Color(0x0e1713);
        if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x0e1713);
        this.sunLight.color.setHex(0xfff8e1);
        this.sunLight.intensity = 2.2;
        this.sunLight.position.set(4.5, 9.0, 5.0);
        this.rimLight.color.setHex(0xa7f3d0);
        this.rimLight.intensity = 1.5;
        this.fillLight.color.setHex(0xdcfce7);
        this.fillLight.intensity = 0.8;
        this.hemiLight.color.setHex(0xbae6fd);
        this.hemiLight.groundColor.setHex(0x14532d);
        this.hemiLight.intensity = 1.1;
        break;

      case 'studio': // Cinematic Dark Luxury Studio
      default:
        this.scene.background = new THREE.Color(0x0c0e14);
        if (this.scene.fog) this.scene.fog.color = new THREE.Color(0x0c0e14);
        this.sunLight.color.setHex(0xffffff);
        this.sunLight.intensity = 1.8;
        this.sunLight.position.set(5.5, 8.5, 4.5);
        this.rimLight.color.setHex(0x64b5f6);
        this.rimLight.intensity = 2.2;
        this.fillLight.color.setHex(0xffecd2);
        this.fillLight.intensity = 0.7;
        this.hemiLight.color.setHex(0x334155);
        this.hemiLight.groundColor.setHex(0x0f172a);
        this.hemiLight.intensity = 0.85;
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
