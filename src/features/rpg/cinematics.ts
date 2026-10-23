import { PerspectiveCamera, Vector3 } from 'three';
import type { NodeId } from '@/domain/rpg/story';
import { places, type PlaceId, type Pose, type Point } from '@/domain/rpg/world';

export type ShotIntent =
  'exploration' | 'two-shot' | 'over-shoulder' | 'speaker-close' | 'demonstration';
export interface ConversationShot {
  node: NodeId;
  speaker: 'guide' | 'engineer' | 'system';
  intent: Exclude<ShotIntent, 'exploration'>;
}
// Presentation only: these intents never emit story events or determine technical findings.
export function conversationShot(
  node: NodeId,
  speaker: ConversationShot['speaker'],
): ConversationShot {
  const intent =
    node === 'installation' || speaker === 'system'
      ? 'demonstration'
      : [
            'guide-welcome',
            'guide-expert',
            'ownership-good',
            'engineer-offer',
            'engineer-accepted',
            'engineer-reported',
          ].includes(node)
        ? 'two-shot'
        : [
              'service-question',
              'ownership-question',
              'guide-purpose',
              'engineer-brief',
              'engineer-built',
            ].includes(node)
          ? 'over-shoulder'
          : 'speaker-close';
  return { node, speaker, intent };
}
export interface ShotPlan {
  intent: ShotIntent;
  eye: Vector3;
  target: Vector3;
  playerVisible: boolean;
  speaker: 'guide' | 'engineer' | null;
  duration: number;
}
export function actorEye(point: Point) {
  return new Vector3(point.x, 1.38, point.z);
}
/** Pure bounded shot composition. safeTop is the measured top of the conversation UI. */
export function planShot(
  pose: Pose,
  conversation: PlaceId | null,
  shot: ConversationShot | null,
  width: number,
  height: number,
  safeTop = 0.63,
): ShotPlan {
  const aspect = Math.max(0.4, width / Math.max(1, height));
  const compact = width < 700;
  const splitDemo = width > 700 && height < 550;
  if (!conversation || !shot)
    return {
      intent: 'exploration',
      eye: new Vector3(pose.x, compact ? 3.6 : 3.2, pose.z + (compact ? 6.8 : 6.6)),
      target: new Vector3(pose.x, 1, pose.z - 2.4),
      playerVisible: true,
      speaker: null,
      duration: 0.55,
    };
  const speaker = shot.speaker === 'system' ? null : shot.speaker;
  const demonstration =
    shot.intent === 'demonstration' || (conversation === 'installation' && speaker === 'guide');
  const focusPlace = demonstration
    ? places[conversation === 'portal' ? 'portal' : 'installation']
    : places[speaker ?? conversation];
  const centre = actorEye(focusPlace);
  const forward = new Vector3(pose.x - focusPlace.x, 0, pose.z - focusPlace.z).normalize();
  if (forward.lengthSq() < 0.1) forward.set(0, 0, 1);
  const right = new Vector3(forward.z, 0, -forward.x);
  let intent: ShotIntent = demonstration ? 'demonstration' : shot.intent;
  // Cross-location authored explanations never show a distant player as a conversation partner.
  if (!demonstration && centre.distanceTo(actorEye(pose)) > 4) intent = 'speaker-close';
  let eye: Vector3;
  let subjectX = compact ? 0.5 : 0.38;
  let subjectY = Math.max(0.25, Math.min(0.32, safeTop * 0.5));
  if (intent === 'demonstration') {
    centre.set(focusPlace.x, conversation === 'portal' ? 3 : 1.8, focusPlace.z);
    const distance =
      conversation === 'portal'
        ? 9
        : Math.max(
            6.5,
            2.35 / aspect / Math.tan((24 * Math.PI) / 180),
            splitDemo ? 0 : 1.85 / Math.max(0.3, safeTop) / Math.tan((24 * Math.PI) / 180),
          );
    eye = centre.clone().add(new Vector3(0.6, 1.2, distance));
    subjectX = compact ? 0.5 : 0.36;
    if (splitDemo) {
      subjectX = 0.24;
      subjectY = 0.45;
    }
  } else if (intent === 'two-shot') {
    centre.lerp(actorEye(pose), 0.5);
    const span = actorEye(pose).distanceTo(actorEye(focusPlace));
    const distance = Math.max(3.8, (span * 0.65 + 0.65) / (aspect * 0.37));
    eye = centre.clone().addScaledVector(right, distance).addScaledVector(forward, 0.7);
    eye.y += 0.5;
  } else if (intent === 'over-shoulder') {
    const separation = centre.distanceTo(actorEye(pose));
    eye = centre
      .clone()
      .addScaledVector(forward, Math.max(3.3, separation + 1.5))
      .addScaledVector(right, 2);
    eye.y += compact ? 1 : 0.85;
  } else {
    eye = centre
      .clone()
      .addScaledVector(forward, compact ? 3 : 2.9)
      .addScaledVector(right, 0.36);
    eye.y += 0.18;
  }
  // Preserve physical camera height. A lower optical axis places the speaker above
  // the subtitles while keeping the near shoulder below the speaker's eye-line.
  const aim = () => {
    const view = eye.clone().sub(centre);
    const cameraRight = new Vector3(view.z, 0, -view.x).normalize();
    const cameraUp = new Vector3().crossVectors(view.clone().normalize(), cameraRight).normalize();
    const viewHeight = 2 * view.length() * Math.tan((24 * Math.PI) / 180);
    return centre
      .clone()
      .addScaledVector(cameraRight, (0.5 - subjectX) * viewHeight * aspect)
      .addScaledVector(cameraUp, (subjectY - 0.5) * viewHeight);
  };
  let target = aim();
  if (intent === 'over-shoulder') {
    // The existing stylized heads are unusually wide. Check conservative silhouettes,
    // including a north-side return approach, rather than merely separating eye points.
    const preview = new PerspectiveCamera(48, aspect, 0.1, 140);
    for (let i = 0; i < 4; i++) {
      preview.position.copy(eye);
      preview.lookAt(target);
      preview.updateMatrixWorld();
      const screenRight = new Vector3().setFromMatrixColumn(preview.matrixWorld, 0);
      const foreground = projectPoint(actorEye(pose).addScaledVector(screenRight, 0.62), preview);
      const speakerEdge = projectPoint(
        actorEye(focusPlace).addScaledVector(screenRight, -0.62),
        preview,
      );
      if (foreground.x + 0.025 < speakerEdge.x) break;
      if (i === 3)
        return planShot(
          pose,
          conversation,
          { ...shot, intent: 'speaker-close' },
          width,
          height,
          safeTop,
        );
      eye.addScaledVector(right, 0.75);
      target = aim();
    }
  }
  return {
    intent,
    eye,
    target,
    speaker,
    playerVisible: intent === 'two-shot' || intent === 'over-shoulder',
    duration: intent === 'demonstration' ? 0.7 : 0.42,
  };
}
export function projectPoint(point: Vector3, camera: PerspectiveCamera) {
  const p = point.clone().project(camera);
  return { x: (p.x + 1) / 2, y: (1 - p.y) / 2, depth: p.z };
}
