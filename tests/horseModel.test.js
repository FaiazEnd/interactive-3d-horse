import assert from 'node:assert';
import * as THREE from 'three';
import { ProceduralHorse } from '../src/model/ProceduralHorse.js';
import { HorseModel } from '../src/model/HorseModel.js';

// 1. Verify ProceduralHorse creates a valid Three.js hierarchy
const procedural = new ProceduralHorse();
assert.ok(procedural.group instanceof THREE.Group, 'ProceduralHorse must have a group');
assert.ok(procedural.materials.length > 0, 'ProceduralHorse must have materials');
procedural.update(0.016);
procedural.setCoat('#793816');
procedural.setWireframe(true);
assert.strictEqual(procedural.materials[0].wireframe, true);
procedural.setWireframe(false);
assert.strictEqual(procedural.materials[0].wireframe, false);

console.log('✓ ProceduralHorse tested successfully');

// 2. Verify HorseModel coat presets and state management
const scene = new THREE.Scene();
const horseModel = new HorseModel(scene);

assert.strictEqual(horseModel.currentGait, 'gallop');
assert.strictEqual(horseModel.playbackSpeed, 1.0);
assert.strictEqual(typeof horseModel.coatPresets.chestnut.color, 'string');
assert.strictEqual(typeof horseModel.coatPresets.black.color, 'string');
assert.strictEqual(typeof horseModel.coatPresets.palomino.color, 'string');

horseModel.setGait('trot');
assert.strictEqual(horseModel.currentGait, 'trot');

horseModel.setSpeed(1.5);
assert.strictEqual(horseModel.playbackSpeed, 1.5);

horseModel.setCoat('black');
assert.strictEqual(horseModel.currentCoat, 'black');

console.log('✓ HorseModel state management and presets tested successfully');
