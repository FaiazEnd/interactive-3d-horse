import assert from 'node:assert';
import * as THREE from 'three';
import { ParticleSystem } from '../src/interaction/ParticleSystem.js';

const scene = new THREE.Scene();
const particles = new ParticleSystem(scene);

assert.ok(particles.points instanceof THREE.Points, 'ParticleSystem must have THREE.Points');
assert.strictEqual(particles.maxParticles, 250, 'Max particles should be 250');

// Test spawning burst
particles.spawnBurst(new THREE.Vector3(0, 1.5, 0), 25);
let activeCount = 0;
for (let i = 0; i < particles.particles.length; i++) {
  if (particles.particles[i].alive) activeCount++;
}
assert.strictEqual(activeCount, 25, 'Should activate exactly 25 particles');

// Test particle update over time
particles.update(0.1);
assert.ok(particles.particles[0].life < particles.particles[0].maxLife, 'Particle life must decrease');

console.log('✓ ParticleSystem tests passed successfully');
