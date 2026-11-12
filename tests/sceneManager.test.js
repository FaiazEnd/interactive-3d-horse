import assert from 'node:assert';
import * as THREE from 'three';

// Verify Three.js constants and classes needed by SceneManager
assert.strictEqual(typeof THREE.Scene, 'function', 'THREE.Scene must be a constructor');
assert.strictEqual(typeof THREE.PerspectiveCamera, 'function', 'THREE.PerspectiveCamera must be a constructor');
assert.strictEqual(THREE.ACESFilmicToneMapping, 4, 'ACESFilmicToneMapping must be constant 4');
assert.strictEqual(THREE.SRGBColorSpace, 'srgb', 'SRGBColorSpace must be "srgb"');
assert.strictEqual(THREE.PCFSoftShadowMap, 2, 'PCFSoftShadowMap must be constant 2');

console.log('✓ Three.js constants and constructors verified for SceneManager');
