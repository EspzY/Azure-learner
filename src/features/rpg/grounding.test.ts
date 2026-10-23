import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { AnimationMixer, Box3, Group, Texture, Vector3, SkinnedMesh } from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { actorSupport, groundActor } from './grounding';

describe('actual licensed rig floor contact', () => {
  it('keeps both soles of all three rigs on the authored floor through idle, walking and interaction', async () => {
    for (const name of ['character-female-a', 'character-female-d', 'character-male-f']) {
      const buffer = readFileSync(`public/game/people/${name}.glb`);
      // Only image decoding is irrelevant to this CPU geometry/animation check; no network or WebGL.
      const loader = new GLTFLoader().register(() => ({
        name: 'geometry-test-texture',
        loadTexture: () => Promise.resolve(new Texture()),
      }));
      const gltf = await new Promise<GLTF>((resolve, reject) =>
        loader.parse(
          buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
          '',
          resolve,
          reject,
        ),
      );
      const rig = gltf.scene;
      const support = actorSupport(rig);
      expect(support.length).toBeGreaterThan(0);
      rig.scale.setScalar(1.75 / new Box3().setFromObject(rig, true).getSize(new Vector3()).y);
      const actor = new Group();
      actor.add(rig);
      actor.position.set(2, 0, -4);
      actor.rotation.y = 1.2;
      const mixer = new AnimationMixer(rig);
      for (const clipName of ['idle', 'walk', 'interact-right']) {
        const clip = gltf.animations.find((clip) => clip.name === clipName)!;
        mixer.clipAction(clip).reset().play();
        for (let i = 0; i < 12; i++) {
          mixer.setTime((clip.duration * i) / 12);
          groundActor(actor, support);
          // Independently inspect all vertices weighted to either leg, rather than the support subset.
          // Hands can sit lower than soles in a stylized pose; whole-body AABBs are not foot contact.
          let feet = Infinity;
          const point = new Vector3();
          actor.traverse((mesh) => {
            if (!(mesh instanceof SkinnedMesh)) return;
            const joints = mesh.geometry.getAttribute('skinIndex'),
              weights = mesh.geometry.getAttribute('skinWeight');
            for (let index = 0; index < joints.count; index++)
              if (
                [0, 1, 2, 3].some(
                  (j) =>
                    weights.getComponent(index, j) > 0 &&
                    mesh.skeleton.bones[joints.getComponent(index, j)]?.name.startsWith('leg-'),
                )
              ) {
                mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld);
                feet = Math.min(feet, point.y);
              }
          });
          expect(feet, `${name}/${clipName}/${i}`).toBeCloseTo(0.012, 2);
          expect(Math.abs(actor.position.y)).toBeLessThan(0.2);
          expect(actor.position.x).toBe(2);
          expect(actor.position.z).toBe(-4);
        }
        mixer.stopAllAction();
      }
      mixer.uncacheRoot(rig);
    }
  });
});
