import {
  distance,
  nearestPlace,
  routeTo,
  stepPlayer,
  type PlaceId,
  type Point,
  type Pose,
} from '@/domain/rpg/world';
import type { ConversationShot } from './cinematics';
export interface RenderMeasurement {
  frames: number;
  fps: number;
  p95: number;
  calls: number;
  triangles: number;
  geometries: number;
  adapted: boolean;
}
export class PlayerRuntime {
  pose: Pose;
  keys = new Set<string>();
  route: Point[] = [];
  paused = true;
  moving = false;
  near: PlaceId | null = null;
  conversation: PlaceId | null = null;
  shot: ConversationShot | null = null;
  intro: number | null = null;
  destination: PlaceId | null = null;
  establish(beat: number | null) {
    this.intro = beat;
    this.telemetry({ cameraSettled: 'false' });
  }
  markDestination(place: PlaceId) {
    this.destination = place;
  }
  playerVisible = true;
  dialogueTop = 0.63;
  dialogueLeft = 0.08;
  inspectedLayer: string | null = null;
  inspect(layer: string | null) {
    this.inspectedLayer = layer;
  }
  safeFrame(top: number, left: number) {
    this.dialogueTop = Math.max(0.3, Math.min(0.8, top));
    this.dialogueLeft = left;
  }
  gate = false;
  root: HTMLElement | null = null;
  measurement: RenderMeasurement = {
    frames: 0,
    fps: 0,
    p95: 0,
    calls: 0,
    triangles: 0,
    geometries: 0,
    adapted: false,
  };
  private accumulator = 0;
  constructor(pose: Pose) {
    this.pose = { ...pose };
  }
  restore(pose: Pose) {
    this.pose = { ...pose };
    this.stop();
  }
  attach(node: HTMLElement | null) {
    this.root = node;
  }
  pause(paused: boolean) {
    this.paused = paused;
    if (paused) this.stop();
  }
  converse(place: PlaceId | null) {
    this.conversation = place;
    if (!place) this.shot = null;
    this.telemetry({ cameraSettled: 'false' });
  }
  direct(shot: ConversationShot | null) {
    this.shot = shot;
    this.telemetry({ cameraSettled: 'false' });
  }
  activateGate() {
    this.gate = true;
  }
  record(measurement: RenderMeasurement) {
    this.measurement = measurement;
  }
  telemetry(values: Record<string, string>) {
    if (this.root) Object.assign(this.root.dataset, values);
  }
  navigate(id: PlaceId) {
    this.keys.clear();
    this.route = routeTo(this.pose, id);
  }
  stop() {
    this.keys.clear();
    this.route = [];
    this.moving = false;
  }
  tick(delta: number) {
    if (this.paused) {
      this.moving = false;
      return;
    }
    this.accumulator += Math.min(delta, 0.25);
    const before = this.pose;
    while (this.accumulator >= 1 / 60) {
      this.accumulator -= 1 / 60;
      let input: Point = {
        x: Number(this.keys.has('right')) - Number(this.keys.has('left')),
        z: Number(this.keys.has('back')) - Number(this.keys.has('forward')),
      };
      if (this.keys.size) this.route = [];
      while (this.route[0] && distance(this.pose, this.route[0]) < 0.12) this.route.shift();
      if (this.route[0] && !this.keys.size) {
        const target = this.route[0];
        const d = distance(this.pose, target);
        input = { x: (target.x - this.pose.x) / d, z: (target.z - this.pose.z) / d };
      }
      this.pose = stepPlayer(this.pose, input, 1 / 60);
    }
    this.moving = distance(before, this.pose) > 0.0001;
    this.near = nearestPlace(this.pose);
  }
}
