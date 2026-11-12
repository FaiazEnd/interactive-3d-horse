import GUI from 'lil-gui';

export class ControlsUI {
  constructor(sceneManager, environment, horseModel, particleSystem, hud) {
    this.sceneManager = sceneManager;
    this.environment = environment;
    this.horseModel = horseModel;
    this.particleSystem = particleSystem;
    this.hud = hud;

    this.gui = new GUI({ title: '🐎 Stallion Studio Controls', width: 300 });

    this.params = {
      // 1. Animation
      gait: 'gallop',
      speed: 1.0,
      paused: false,
      pet: () => {
        this.horseModel.triggerPetReaction();
        if (this.particleSystem) {
          const target = this.horseModel.mesh ? this.horseModel.mesh.position : { x: 0, y: 1.2, z: 0 };
          this.particleSystem.spawnBurst({ x: target.x, y: 1.4, z: target.z }, 45);
        }
        if (this.hud) {
          this.hud.showToast('✦ Stallion petted! Energetic trot reaction activated.');
        }
      },

      // 2. Appearance & Coat
      coatPreset: 'chestnut',
      coatColor: '#793816',
      roughness: 0.55,
      wireframe: false,

      // 3. Lighting & Environment
      environmentPreset: 'studio',
      sunIntensity: 1.8,
      shadows: true,

      // 4. Camera
      cameraPreset: 'hero',
      autoRotate: false,
      rotateSpeed: 1.2,
      resetCamera: () => {
        this.sceneManager.setCameraPreset('hero');
        this.params.cameraPreset = 'hero';
        camController.setValue('hero');
      }
    };

    let camController = null;
    let colorController = null;

    // Folder 1: Animation
    const animFolder = this.gui.addFolder('Animation & Gaits');
    animFolder
      .add(this.params, 'gait', ['gallop', 'trot', 'walk', 'idle'])
      .name('Gait')
      .onChange(val => this.horseModel.setGait(val));

    animFolder
      .add(this.params, 'speed', 0.2, 2.5, 0.05)
      .name('Speed Multiplier')
      .onChange(val => this.horseModel.setSpeed(val));

    animFolder
      .add(this.params, 'paused')
      .name('Pause Motion')
      .onChange(val => this.horseModel.setPaused(val));

    animFolder.add(this.params, 'pet').name('✦ Pet Horse (Click/Tap)');

    // Folder 2: Appearance & Coat
    const coatFolder = this.gui.addFolder('Coat & Materials (PBR)');
    coatFolder
      .add(this.params, 'coatPreset', ['chestnut', 'black', 'palomino', 'bay', 'gray', 'custom'])
      .name('Coat Breed')
      .onChange(val => {
        if (val !== 'custom') {
          this.horseModel.setCoat(val);
          const hex = this.horseModel.coatPresets[val].color;
          this.params.coatColor = hex;
          colorController.setValue(hex);
          const rough = this.horseModel.coatPresets[val].roughness;
          this.params.roughness = rough;
          roughController.setValue(rough);
        }
      });

    colorController = coatFolder
      .addColor(this.params, 'coatColor')
      .name('Custom Tint')
      .onChange(val => {
        this.horseModel.setCoat(val);
        this.params.coatPreset = 'custom';
      });

    const roughController = coatFolder
      .add(this.params, 'roughness', 0.15, 0.95, 0.01)
      .name('Coat Roughness')
      .onChange(val => this.horseModel.setRoughness(val));

    coatFolder
      .add(this.params, 'wireframe')
      .name('Wireframe Mesh')
      .onChange(val => this.horseModel.setWireframe(val));

    // Folder 3: Environment & Lighting
    const lightFolder = this.gui.addFolder('Lighting & Stage');
    lightFolder
      .add(this.params, 'environmentPreset', ['studio', 'sunset', 'meadow'])
      .name('Light Atmosphere')
      .onChange(val => this.environment.setPreset(val));

    lightFolder
      .add(this.params, 'sunIntensity', 0.2, 4.0, 0.1)
      .name('Key Light Intensity')
      .onChange(val => this.environment.setSunIntensity(val));

    lightFolder
      .add(this.params, 'shadows')
      .name('Soft Shadows')
      .onChange(val => this.environment.setShadows(val));

    // Folder 4: Camera
    const camFolder = this.gui.addFolder('Camera Controls');
    camController = camFolder
      .add(this.params, 'cameraPreset', ['hero', 'profile', 'head', 'top'])
      .name('Camera Angle')
      .onChange(val => this.sceneManager.setCameraPreset(val));

    camFolder
      .add(this.params, 'autoRotate')
      .name('Auto Rotate')
      .onChange(val => this.sceneManager.setAutoRotate(val, this.params.rotateSpeed));

    camFolder
      .add(this.params, 'rotateSpeed', 0.2, 5.0, 0.1)
      .name('Rotate Speed')
      .onChange(val => this.sceneManager.setAutoRotate(this.params.autoRotate, val));

    camFolder.add(this.params, 'resetCamera').name('Reset Camera View');

    // On mobile devices, collapse GUI by default so it doesn't block the horse
    if (window.innerWidth < 768) {
      this.gui.close();
    }
  }

  destroy() {
    this.gui.destroy();
  }
}
