import assert from 'node:assert';
import * as THREE from 'three';
import { Environment } from '../src/scene/Environment.js';

const scene = new THREE.Scene();
const env = new Environment(scene);

// Check that lights and pedestal are added
assert.ok(env.sunLight instanceof THREE.DirectionalLight, 'sunLight must be DirectionalLight');
assert.ok(env.rimLight instanceof THREE.DirectionalLight, 'rimLight must be DirectionalLight');
assert.ok(env.hemiLight instanceof THREE.HemisphereLight, 'hemiLight must be HemisphereLight');
assert.ok(env.pedestal instanceof THREE.Group, 'pedestal must be a THREE.Group');
assert.strictEqual(env.currentPreset, 'studio', 'Default preset should be studio');

// Test preset change
env.setPreset('sunset');
assert.strictEqual(env.currentPreset, 'sunset');

env.setPreset('meadow');
assert.strictEqual(env.currentPreset, 'meadow');

// Test sun intensity
env.setSunIntensity(3.0);
assert.strictEqual(env.sunLight.intensity, 3.0);

// Test shadows toggle
env.setShadows(false);
assert.strictEqual(env.sunLight.castShadow, false);
env.setShadows(true);
assert.strictEqual(env.sunLight.castShadow, true);

console.log('✓ Environment tests passed successfully');
