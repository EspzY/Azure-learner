import { describe, it, expect } from 'vitest';
import {
  distance,
  gatewayReturn,
  nearestPlace,
  obstacles,
  places,
  routeTo,
  spawn,
  stepPlayer,
  walkable,
} from './world';
import { dialogue, entryNode, parseStoryEvent, storyFacts, type StoryEvent } from './story';
import { freshGame, restoreGame, rpgKey } from './persistence';
import { PlayerRuntime } from '@/features/rpg/runtime';
import { GameStore } from '@/features/rpg/game-provider';
import { nb } from '@/content/nb';
const technical = { guidedBuilt: false, hasWork: false };
const learned: StoryEvent[] = [
  { kind: 'model', model: 'iaas' },
  { kind: 'model', model: 'paas' },
  { kind: 'answer', question: 'service', answer: 'paas' },
  { kind: 'answer', question: 'ownership', answer: 'code-data-access' },
  { kind: 'accept' },
];
describe('bounded player control', () => {
  it('integrates the same travel distance across frame rates and pauses safely', () => {
    const positions = [30, 60, 120].map((fps) => {
      const rt = new PlayerRuntime(spawn);
      rt.pause(false);
      rt.keys.add('forward');
      for (let i = 0; i < fps * 2; i++) rt.tick(1 / fps);
      return rt.pose;
    });
    for (const pose of positions) expect(pose.z).toBeCloseTo(11 - 5.4, 2);
  });
  it('moves actual position, normalizes diagonals and rejects invalid input', () => {
    const forward = stepPlayer(spawn, { x: 0, z: -1 }, 0.05);
    const diagonal = stepPlayer(spawn, { x: 1, z: -1 }, 0.05);
    expect(forward.z).toBeLessThan(spawn.z);
    expect(distance(diagonal, spawn)).toBeCloseTo(distance(forward, spawn));
    expect(spawn.z).toBe(11);
    expect(stepPlayer(spawn, { x: NaN, z: 1 }, 0.1)).toBe(spawn);
    expect(stepPlayer(spawn, { x: 0, z: 1 }, Infinity)).toBe(spawn);
  });
  it('keeps the player on the floor and outside solid people/installations', () => {
    let p = { ...spawn };
    for (let i = 0; i < 2000; i++) p = stepPlayer(p, { x: 1, z: 0 }, 1 / 60);
    expect(p.x).toBeLessThanOrEqual(4.5);
    expect(walkable(p)).toBe(true);
    for (const obstacle of obstacles.filter((o) => walkable({ x: o.x, z: o.z + o.radius + 1 }))) {
      let pose: typeof spawn = { x: obstacle.x, z: obstacle.z + obstacle.radius + 1, yaw: 0 };
      for (let i = 0; i < 150; i++) pose = stepPlayer(pose, { x: 0, z: -1 }, 1 / 60);
      expect(distance(pose, obstacle)).toBeGreaterThan(obstacle.radius + 0.28);
    }
    p = { x: -3, z: 6, yaw: 0 };
    for (let i = 0; i < 200; i++) p = stepPlayer(p, { x: 0, z: -1 }, 1 / 60);
    expect(distance(p, places.guide)).toBeGreaterThan(0.82);
    expect(walkable(p)).toBe(true);
  });
  it('requires proximity and does not start conversations on approach', () => {
    expect(nearestPlace(spawn)).toBeNull();
    expect(nearestPlace(places.guide.approach)).toBe('guide');
    const rt = new PlayerRuntime(spawn);
    rt.pause(false);
    rt.navigate('guide');
    for (let i = 0; i < 900; i++) rt.tick(1 / 60);
    expect(rt.near).toBe('guide');
    expect(rt.conversation).toBeNull();
    expect(distance(rt.pose, places.guide.approach)).toBeLessThan(0.15);
  });
  it('routes from side areas around obstacles; manual input cancels automatic walking', () => {
    const initial = { x: -3, z: 1.5, yaw: 0 };
    const route = routeTo(initial, 'guide');
    expect(route.length).toBeGreaterThan(1);
    const rt = new PlayerRuntime(initial);
    rt.pause(false);
    rt.navigate('guide');
    for (let i = 0; i < 2000; i++) {
      rt.tick(1 / 60);
      expect(walkable(rt.pose)).toBe(true);
    }
    expect(rt.near).toBe('guide');
    rt.navigate('portal');
    rt.keys.add('back');
    rt.tick(1 / 60);
    expect(rt.route).toEqual([]);
    rt.pause(true);
    const before = { ...rt.pose };
    rt.tick(10);
    expect(rt.pose).toEqual(before);
    expect(walkable(gatewayReturn)).toBe(true);
  });
});
describe('authored learning and quest facts', () => {
  it('validates answers and keeps wrong choices observable without XP', () => {
    const story = { events: learned };
    expect(storyFacts(story, technical)).toMatchObject({
      canEnter: true,
      ready: false,
      reported: false,
    });
    expect(
      storyFacts(
        {
          events: [
            ...learned,
            { kind: 'answer', question: 'ownership', answer: 'provider-everything' },
          ],
        },
        technical,
      ).challenge,
    ).toBe(false);
    expect(story.events.filter((e) => e.kind === 'answer')).toHaveLength(2);
    expect(
      parseStoryEvent({ kind: 'answer', question: 'service', answer: 'code-data-access' }),
    ).toBeNull();
    expect(parseStoryEvent({ kind: 'accept', xp: 1000 })).toBeNull();
  });
  it('derives engineer responses from actual current technical work, never portal visits', () => {
    const story = { events: learned };
    expect(entryNode('engineer', story, technical)).toBe('engineer-reminder');
    expect(entryNode('engineer', story, { ...technical, hasWork: true })).toBe('engineer-progress');
    expect(entryNode('engineer', story, { guidedBuilt: true, hasWork: true })).toBe(
      'engineer-built',
    );
    const reported = { events: [...learned, { kind: 'report' }] as StoryEvent[] };
    expect(storyFacts(reported, { guidedBuilt: true, hasWork: true }).reported).toBe(true);
    expect(storyFacts(reported, technical).reported).toBe(false);
    expect(entryNode('portal', { events: [] }, technical)).toBe('portal-locked');
  });
  it('every dialogue edge, original text and choice resolves; there are no executable scripts', () => {
    for (const [id, node] of Object.entries(dialogue)) {
      expect(nb.rpg.dialogue).toHaveProperty(id);
      expect(nb.rpg.dialogue[id as keyof typeof dialogue].length).toBeGreaterThan(80);
      for (const c of node.choices) {
        if (c.next) expect(dialogue).toHaveProperty(c.next);
        expect(nb.rpg.choices).toHaveProperty(c.id);
        if (c.effect) expect(parseStoryEvent(c.effect)).not.toBeNull();
      }
    }
  });
});
describe('local RPG compatibility and safe resume', () => {
  it('owns event input and preserves a valid position at rounding/collision boundaries', () => {
    const data = new Map<string, string>();
    const store = new GameStore({
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => {
        data.set(k, v);
      },
      removeItem: (k) => {
        data.delete(k);
      },
    });
    store.load();
    const input: StoryEvent = { kind: 'model', model: 'iaas' };
    store.event(input);
    input.model = 'saas';
    expect(store.getSnapshot().save.events[0]).toEqual({ kind: 'model', model: 'iaas' });
    const pose = { x: -3 + 0.586, z: 4 + 0.59, yaw: 0 };
    expect(walkable(pose)).toBe(true);
    expect(store.position(pose)).toBe(true);
    expect(restoreGame(data.get(rpgKey)!).issue).toBeNull();
    expect(store.quality('unknown' as 'auto')).toBe(false);
  });
  it('replays bounded typed observations, rejects invalid poses/versions/corruption and ignores forged completion', () => {
    const good = {
      ...freshGame(),
      events: learned,
      pose: gatewayReturn,
      completed: true,
      xp: 10000,
    };
    expect(restoreGame(JSON.stringify(good)).save.events).toEqual(learned);
    expect(restoreGame(JSON.stringify(good)).save).not.toHaveProperty('xp');
    for (const raw of [
      'broken',
      '[]',
      JSON.stringify({ ...good, pose: { x: 99, z: 4, yaw: 0 } }),
      JSON.stringify({ ...good, events: [{ kind: 'hack' }] }),
      'x'.repeat(64001),
    ])
      expect(restoreGame(raw).issue).not.toBeNull();
    expect(restoreGame(JSON.stringify({ ...good, contentVersion: '99' })).issue).toBe(
      'unsupported',
    );
  });
  it('portal/return and RPG reset preserve existing awards and technical records', () => {
    const data = new Map([
      ['azurelab.progress.v1', 'legacy-awards'],
      ['azurelab.chapter01.guided.v1', 'technical-log'],
    ]);
    const port = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const a = new GameStore(port);
    a.load();
    for (const e of learned) a.event(e);
    a.portal();
    const b = new GameStore(port);
    b.load();
    expect(b.getSnapshot().save.pose).toEqual(gatewayReturn);
    expect(b.getSnapshot().save.returnPending).toBe(true);
    b.returned();
    expect(b.getSnapshot().save.returnPending).toBe(false);
    b.clear();
    expect(data.get('azurelab.progress.v1')).toBe('legacy-awards');
    expect(data.get('azurelab.chapter01.guided.v1')).toBe('technical-log');
    expect(data.has(rpgKey)).toBe(false);
  });
  it('detects stale tabs and handles denied persistence without fabricating progress', () => {
    const data = new Map<string, string>();
    const port = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => {
        data.set(k, v);
      },
      removeItem: (k: string) => {
        data.delete(k);
      },
    };
    const a = new GameStore(port),
      b = new GameStore(port);
    a.load();
    b.load();
    a.event(learned[0]);
    expect(b.event(learned[1])).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    b.load();
    expect(b.getSnapshot().save.events).toHaveLength(1);
    const denied = new GameStore({
      ...port,
      setItem: () => {
        throw new Error('quota');
      },
    });
    denied.load();
    expect(denied.event({ kind: 'accept' })).toBe(true);
    expect(denied.getSnapshot().issue).toBe('unsaved');
    const corrupt = new GameStore({ ...port, getItem: () => '{bad' });
    corrupt.load();
    expect(corrupt.event({ kind: 'accept' })).toBe(false);
    expect(storyFacts(corrupt.getSnapshot().save, technical).accepted).toBe(false);
  });
});
