import { SceneManager } from './scene/SceneManager.js';
import { Environment } from './scene/Environment.js';
import { HorseModel } from './model/HorseModel.js';
import { ParticleSystem } from './interaction/ParticleSystem.js';
import { InteractionManager } from './interaction/InteractionManager.js';
import { ControlsUI } from './ui/ControlsUI.js';
import { HUD } from './ui/HUD.js';

async function init() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) {
    console.error('Fatal: webgl-canvas element not found');
    return;
  }

  // 1. HUD & Performance overlay
  const hud = new HUD();

  // 2. Core Scene, Camera & Renderer
  const sceneManager = new SceneManager(canvas);

  // 3. Lighting & Pedestal Stage
  const environment = new Environment(sceneManager.scene);

  // 4. Horse Model & Animations
  const horseModel = new HorseModel(sceneManager.scene);

  // 5. Interactive Particle System
  const particleSystem = new ParticleSystem(sceneManager.scene);

  // 6. Raycast Interaction (Hover highlight & click-to-pet reaction)
  const interactionManager = new InteractionManager(
    sceneManager.scene,
    sceneManager.camera,
    sceneManager.renderer.domElement,
    horseModel,
    particleSystem,
    (hitPoint) => {
      hud.showToast('✦ Stallion petted! Energetic trot reaction activated.');
    }
  );

  // 7. GUI Controls
  const controlsUI = new ControlsUI(
    sceneManager,
    environment,
    horseModel,
    particleSystem,
    hud
  );

  // 8. Load 3D Asset
  try {
    await horseModel.load();
  } catch (err) {
    console.error('Model load failure:', err);
  } finally {
    hud.hideLoading();
  }

  // 9. Central Render & Update Loop
  sceneManager.onTick((delta) => {
    horseModel.update(delta);
    particleSystem.update(delta);
    hud.updateFPS();
  });

  // 10. Start Animation Loop
  sceneManager.start();

  console.log('✓ Interactive 3D Horse Showcase initialized successfully');
}

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
