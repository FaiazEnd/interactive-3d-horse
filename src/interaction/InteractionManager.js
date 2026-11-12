import * as THREE from 'three';

export class InteractionManager {
  constructor(scene, camera, domElement, horseModel, particleSystem, onPetCallback = null) {
    this.scene = scene;
    this.camera = camera;
    this.domElement = domElement;
    this.horseModel = horseModel;
    this.particleSystem = particleSystem;
    this.onPetCallback = onPetCallback;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);
    this.pointerDownPos = new THREE.Vector2();
    this.isHoveringHorse = false;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.domElement.addEventListener('pointermove', this.onPointerMove);
    this.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.domElement.addEventListener('pointerup', this.onPointerUp);
  }

  unbindEvents() {
    this.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.domElement.removeEventListener('pointerup', this.onPointerUp);
  }

  getTargetMesh() {
    if (this.horseModel.mesh) {
      return [this.horseModel.mesh];
    }
    if (this.horseModel.proceduralFallback) {
      return [this.horseModel.proceduralFallback.group];
    }
    return [];
  }

  onPointerMove(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.checkHover();
  }

  onPointerDown(e) {
    this.pointerDownPos.set(e.clientX, e.clientY);
  }

  onPointerUp(e) {
    const dist = this.pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
    // Only count as click if user didn't drag camera
    if (dist > 6) return;

    this.handleClick();
  }

  checkHover() {
    const targets = this.getTargetMesh();
    if (targets.length === 0) return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(targets, true);

    if (intersects.length > 0) {
      if (!this.isHoveringHorse) {
        this.isHoveringHorse = true;
        this.domElement.style.cursor = 'pointer';
      }
    } else {
      if (this.isHoveringHorse) {
        this.isHoveringHorse = false;
        this.domElement.style.cursor = 'default';
      }
    }
  }

  handleClick() {
    const targets = this.getTargetMesh();
    if (targets.length === 0) return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(targets, true);

    if (intersects.length > 0) {
      const hit = intersects[0];

      // Trigger horse reaction
      this.horseModel.triggerPetReaction();

      // Trigger sparkle particle burst
      if (this.particleSystem) {
        this.particleSystem.spawnBurst(hit.point, 40);
      }

      if (typeof this.onPetCallback === 'function') {
        this.onPetCallback(hit.point);
      }
    }
  }

  dispose() {
    this.unbindEvents();
    this.domElement.style.cursor = 'default';
  }
}
