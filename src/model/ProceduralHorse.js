import * as THREE from 'three';

export class ProceduralHorse {
  constructor() {
    this.group = new THREE.Group();
    this.materials = [];
    this.time = 0;
    this.petReactionTime = 0;

    this.initMesh();
  }

  initMesh() {
    // Body material with PBR properties
    this.bodyMat = new THREE.MeshStandardMaterial({
      color: 0x793816,
      roughness: 0.55,
      metalness: 0.08,
      flatShading: true
    });
    this.materials.push(this.bodyMat);

    // Dark mane/hoof accent material
    this.accentMat = new THREE.MeshStandardMaterial({
      color: 0x1a120b,
      roughness: 0.45,
      metalness: 0.1,
      flatShading: true
    });
    this.materials.push(this.accentMat);

    // 1. Torso / Barrel
    const torsoGeo = new THREE.BoxGeometry(0.85, 0.85, 1.8);
    const torso = new THREE.Mesh(torsoGeo, this.bodyMat);
    torso.position.y = 1.25;
    torso.castShadow = true;
    torso.receiveShadow = true;
    this.group.add(torso);
    this.torso = torso;

    // 2. Neck & Head
    this.neck = new THREE.Group();
    this.neck.position.set(0, 0.35, 0.8);

    const neckMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.85, 0.5), this.bodyMat);
    neckMesh.position.set(0, 0.4, 0.15);
    neckMesh.rotation.x = -Math.PI / 4.5;
    neckMesh.castShadow = true;
    this.neck.add(neckMesh);

    // Mane
    const maneMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 0.2), this.accentMat);
    maneMesh.position.set(0, 0.5, 0.0);
    maneMesh.rotation.x = -Math.PI / 4.5;
    this.neck.add(maneMesh);

    // Head
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.75), this.bodyMat);
    headMesh.position.set(0, 0.85, 0.45);
    headMesh.rotation.x = 0.2;
    headMesh.castShadow = true;
    this.neck.add(headMesh);

    // Ears
    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 4), this.bodyMat);
    earL.position.set(0.12, 1.12, 0.28);
    const earR = earL.clone();
    earR.position.x = -0.12;
    this.neck.add(earL);
    this.neck.add(earR);

    torso.add(this.neck);

    // 3. Legs (4 articulated limbs)
    this.legs = [];
    const legPositions = [
      { x: 0.3, z: 0.65, isFront: true },   // Front Right
      { x: -0.3, z: 0.65, isFront: true },  // Front Left
      { x: 0.3, z: -0.65, isFront: false }, // Back Right
      { x: -0.3, z: -0.65, isFront: false } // Back Left
    ];

    legPositions.forEach((pos, idx) => {
      const legPivot = new THREE.Group();
      legPivot.position.set(pos.x, -0.2, pos.z);

      // Thigh
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.26), this.bodyMat);
      thigh.position.y = -0.3;
      thigh.castShadow = true;
      legPivot.add(thigh);

      // Shin / lower leg
      const shin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.2), this.bodyMat);
      shin.position.y = -0.7;
      shin.castShadow = true;
      legPivot.add(shin);

      // Hoof
      const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.22), this.accentMat);
      hoof.position.y = -1.02;
      hoof.castShadow = true;
      legPivot.add(hoof);

      torso.add(legPivot);
      this.legs.push({ pivot: legPivot, isFront: pos.isFront, phase: (idx % 2 === 0 ? 0 : Math.PI) + (pos.isFront ? 0 : Math.PI / 2) });
    });

    // 4. Tail
    this.tail = new THREE.Group();
    this.tail.position.set(0, 0.2, -0.9);
    const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.9, 6), this.accentMat);
    tailMesh.position.set(0, -0.4, -0.2);
    tailMesh.rotation.x = -0.4;
    tailMesh.castShadow = true;
    this.tail.add(tailMesh);
    torso.add(this.tail);

    this.group.scale.set(1.15, 1.15, 1.15);
  }

  update(delta) {
    this.time += delta * 6;

    // Trot oscillation for legs
    this.legs.forEach(leg => {
      leg.pivot.rotation.x = Math.sin(this.time + leg.phase) * 0.45;
    });

    // Subtle torso bobbing and neck motion
    if (this.torso) {
      this.torso.position.y = 1.25 + Math.abs(Math.sin(this.time * 2)) * 0.08;
    }
    if (this.neck) {
      this.neck.rotation.x = Math.sin(this.time) * 0.06;
    }
    if (this.tail) {
      this.tail.rotation.z = Math.sin(this.time * 1.5) * 0.18;
    }

    // Pet reaction rearing up
    if (this.petReactionTime > 0) {
      this.petReactionTime -= delta;
      const progress = Math.max(0, this.petReactionTime / 0.8);
      this.group.rotation.x = -Math.sin(progress * Math.PI) * 0.25;
      this.group.position.y = Math.sin(progress * Math.PI) * 0.35;
    } else {
      this.group.rotation.x = 0;
      this.group.position.y = 0;
    }
  }

  setCoat(colorHex) {
    const color = new THREE.Color(colorHex);
    this.bodyMat.color.copy(color);
  }

  setRoughness(val) {
    this.bodyMat.roughness = val;
  }

  setWireframe(enabled) {
    this.materials.forEach(mat => {
      mat.wireframe = enabled;
    });
  }

  triggerPetReaction() {
    this.petReactionTime = 0.8;
  }
}
