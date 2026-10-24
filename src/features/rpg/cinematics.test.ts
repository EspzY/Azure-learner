import { describe, it, expect } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { places, spawn } from '@/domain/rpg/world';
import { dialogue, nodeIds } from '@/domain/rpg/story';
import { actorEye, conversationShot, planShot, projectPoint } from './cinematics';
describe('bounded cinematic direction', () => {
  it('authors shots for every existing dialogue beat without altering story definitions', () => {
    const before = JSON.stringify(dialogue);
    const intents = new Set(nodeIds.map((id) => conversationShot(id, dialogue[id].speaker).intent));
    expect([...intents].sort()).toEqual([
      'demonstration',
      'over-shoulder',
      'speaker-close',
      'two-shot',
    ]);
    expect(JSON.stringify(dialogue)).toBe(before);
  });
  it.each([
    [1440, 960, 0.68],
    [412, 839, 0.43],
    [360, 640, 0.39],
    [844, 390, 0.44],
  ])(
    'keeps speaker head and both participants clear above dialogue at %i × %i',
    (width, height, safe) => {
      for (const npc of ['guide', 'engineer'] as const) {
        const pose = { ...places[npc].approach, yaw: Math.PI };
        for (const id of [
          npc === 'guide' ? 'guide-welcome' : 'engineer-offer',
          npc === 'guide' ? 'guide-purpose' : 'engineer-brief',
          npc === 'guide' ? 'guide-mechanism' : 'engineer-progress',
        ] as const) {
          const plan = planShot(pose, npc, conversationShot(id, npc), width, height, safe);
          const camera = new PerspectiveCamera(48, width / height, 0.1, 140);
          camera.position.copy(plan.eye);
          camera.lookAt(plan.target);
          camera.updateMatrixWorld();
          const head = projectPoint(actorEye(places[npc]), camera);
          const top = projectPoint(new Vector3(places[npc].x, 1.8, places[npc].z), camera);
          expect(head.x).toBeGreaterThan(0.08);
          expect(head.x).toBeLessThan(0.9);
          expect(top.y).toBeGreaterThan(0.03);
          expect(head.y).toBeLessThan(safe);
          if (plan.intent === 'two-shot') {
            const player = projectPoint(actorEye(pose), camera);
            expect(player.x).toBeGreaterThan(0.02);
            expect(player.x).toBeLessThan(0.98);
            expect(player.y).toBeLessThan(safe);
          }
          if (plan.intent === 'over-shoulder') {
            const player = projectPoint(actorEye(pose), camera);
            expect(Math.abs(player.x - head.x)).toBeGreaterThan(0.1);
            const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
            const playerEdge = projectPoint(actorEye(pose).addScaledVector(right, 0.43), camera);
            const speakerEdge = projectPoint(
              actorEye(places[npc]).addScaledVector(right, -0.43),
              camera,
            );
            expect(playerEdge.x).toBeLessThan(speakerEdge.x + 0.02);
          }
          expect(plan.playerVisible).toBe(plan.intent !== 'speaker-close');
        }
      }
    },
  );
  it('can return from a teaching demonstration to the actual distant speaker', () => {
    const pose = { ...places.installation.approach, yaw: 0 };
    const plan = planShot(
      pose,
      'installation',
      { ...conversationShot('installation', 'guide'), intent: 'speaker-close', focusSpeaker: true },
      1440,
      960,
    );
    expect(plan.intent).toBe('speaker-close');
    expect(plan.speaker).toBe('guide');
    expect(plan.playerVisible).toBe(false);
  });
  it('reserves the right-hand teaching column in short landscape', () => {
    const pose = { ...places.engineer.approach, yaw: 0 };
    const shot = planShot(
      pose,
      'engineer',
      { ...conversationShot('engineer-offer', 'engineer'), framing: 'side-dialogue' },
      844,
      390,
      0.3,
    );
    const camera = new PerspectiveCamera(48, 844 / 390, 0.1, 140);
    camera.position.copy(shot.eye);
    camera.lookAt(shot.target);
    camera.updateMatrixWorld();
    expect(projectPoint(actorEye(places.engineer), camera).x).toBeLessThan(0.43);
    expect(projectPoint(actorEye(pose), camera).x).toBeGreaterThan(0.06);
  });
  it('uses installation focus instead of inventing an NPC relocation; return preserves pose', () => {
    const pose = { ...places.installation.approach, yaw: 0 };
    const plan = planShot(
      pose,
      'installation',
      conversationShot('ownership-question', 'guide'),
      412,
      839,
      0.4,
    );
    expect(plan.intent).toBe('demonstration');
    expect(plan.playerVisible).toBe(false);
    const before = { ...spawn };
    expect(planShot(spawn, null, null, 1440, 960).intent).toBe('exploration');
    expect(spawn).toEqual(before);
  });
  it('protects the speaker silhouette from near/north-side returning players', () => {
    for (const [x, z] of [
      [0, -1.1],
      [0, 2.4],
      [1.1, 0],
      [-2.3, 0],
    ]) {
      const npc = places.engineer;
      const pose = { x: npc.x + x!, z: npc.z + z!, yaw: 0 };
      const plan = planShot(
        pose,
        'engineer',
        conversationShot('engineer-built', 'engineer'),
        412,
        839,
        0.56,
      );
      if (plan.intent === 'speaker-close') {
        expect(plan.playerVisible).toBe(false);
        continue;
      }
      const camera = new PerspectiveCamera(48, 412 / 839, 0.1, 140);
      camera.position.copy(plan.eye);
      camera.lookAt(plan.target);
      camera.updateMatrixWorld();
      const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      expect(projectPoint(actorEye(pose).addScaledVector(right, 0.6), camera).x).toBeLessThan(
        projectPoint(actorEye(npc).addScaledVector(right, -0.6), camera).x,
      );
    }
  });
});
