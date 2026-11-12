import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene, maxParticles = 250) {
    this.scene = scene;
    this.maxParticles = maxParticles;
    this.particles = [];

    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);

    for (let i = 0; i < maxParticles; i++) {
      this.particles.push({
        position: new THREE.Vector3(0, -999, 0),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0,
        alive: false,
        baseColor: new THREE.Color(0xfbbf24)
      });
      positions[i * 3 + 1] = -999;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  spawnBurst(origin, count = 35) {
    let spawned = 0;
    const goldPalette = [0xfbbf24, 0xf59e0b, 0xfef08a, 0xffffff];

    for (let i = 0; i < this.maxParticles && spawned < count; i++) {
      const p = this.particles[i];
      if (!p.alive) {
        p.alive = true;
        p.life = 0;
        p.maxLife = 0.6 + Math.random() * 0.7; // 0.6s to 1.3s
        p.position.copy(origin).add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        ));

        // Radiate upward and outward
        const speed = 1.2 + Math.random() * 2.2;
        const angle = Math.random() * Math.PI * 2;
        const elevation = 0.4 + Math.random() * 0.6;
        p.velocity.set(
          Math.cos(angle) * (1 - elevation) * speed,
          elevation * speed * 1.5,
          Math.sin(angle) * (1 - elevation) * speed
        );

        const hex = goldPalette[Math.floor(Math.random() * goldPalette.length)];
        p.baseColor.setHex(hex);
        spawned++;
      }
    }
  }

  update(delta) {
    const posAttr = this.geometry.attributes.position;
    const colAttr = this.geometry.attributes.color;
    let needsUpdate = false;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];

      if (p.alive) {
        needsUpdate = true;
        p.life += delta;

        if (p.life >= p.maxLife) {
          p.alive = false;
          posAttr.setXYZ(i, 0, -999, 0);
          colAttr.setXYZ(i, 0, 0, 0);
          continue;
        }

        // Physics: gravity + gentle drag
        p.velocity.y -= delta * 3.8;
        p.velocity.x *= 0.98;
        p.velocity.z *= 0.98;

        p.position.addScaledVector(p.velocity, delta);
        posAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);

        // Alpha fade out via color brightness
        const progress = p.life / p.maxLife;
        const fade = Math.max(0, 1.0 - progress);
        colAttr.setXYZ(
          i,
          p.baseColor.r * fade,
          p.baseColor.g * fade,
          p.baseColor.b * fade
        );
      }
    }

    if (needsUpdate) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  }

  dispose() {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }
}
