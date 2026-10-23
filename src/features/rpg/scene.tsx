'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import {
  AnimationMixer,
  Box3,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  SkinnedMesh,
  Raycaster,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  type AnimationAction,
  type Sprite,
  type Skeleton,
} from 'three';
import { nb } from '@/content/nb';
import { layers, responsibility, type ServiceModel } from '@/domain/expedition';
import { places, type PlaceId } from '@/domain/rpg/world';
import {
  AssetLibrary,
  Model,
  StaticModels,
  type Placement,
  useAsset,
  cloneCharacter,
} from './assets';
import { PlayerRuntime } from './runtime';
import { actorSupport, groundActor } from './grounding';

function Sign({
  text,
  position,
  width = 3,
  color = '#c8efe6',
  runtime,
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
  runtime?: PlayerRuntime;
}) {
  const sprite = useRef<Sprite>(null);
  useFrame(() => {
    if (sprite.current && runtime) sprite.current.visible = !runtime.conversation;
  });
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 160;
    const c = canvas.getContext('2d')!;
    c.fillStyle = 'rgba(9,22,34,.88)';
    c.fillRect(0, 0, 1024, 160);
    c.fillStyle = color;
    c.font = '600 54px sans-serif';
    c.textAlign = 'center';
    c.fillText(text, 512, 96);
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite ref={sprite} position={position} scale={[width, width * 0.156, 1]}>
      <spriteMaterial map={texture} depthTest transparent />
    </sprite>
  );
}
function Terrain() {
  const geometry = useMemo(() => {
    const count = 42;
    const vertices: number[] = [];
    const indices: number[] = [];
    for (let z = 0; z <= count; z++)
      for (let x = 0; x <= count; x++) {
        const px = (x / count - 0.5) * 100,
          pz = (z / count - 0.5) * 110 - 7;
        const edge = Math.max(0, Math.abs(px) - 8);
        const h =
          -0.12 + edge * 0.11 + Math.sin(px * 0.31 + pz * 0.18) * Math.min(edge * 0.12, 0.7);
        vertices.push(px, h, pz);
      }
    for (let z = 0; z < count; z++)
      for (let x = 0; x < count; x++) {
        const a = z * (count + 1) + x;
        indices.push(a, a + count + 1, a + 1, a + 1, a + count + 1, a + count + 2);
      }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);
  const originalTexture = useLoader(TextureLoader, '/game/deck.svg');
  const texture = useMemo(() => {
    const t = originalTexture.clone();
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(3.5, 17);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [originalTexture]);
  useEffect(() => {
    return () => {
      geometry.dispose();
      texture.dispose();
      useLoader.clear(TextureLoader, '/game/deck.svg');
    };
  }, [texture, geometry]);
  return (
    <>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#293e55" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0, -6.5]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[9, 41]} />
        <meshStandardMaterial map={texture} color="#7f8ca8" roughness={0.85} metalness={0.15} />
      </mesh>
      {(
        [
          [-5.5, 3.5, 2, 7],
          [-5.5, -13, 2, 8],
          [4.75, -3.5, 0.5, 7],
        ] as const
      ).map(([x, z, width, depth]) => (
        <mesh key={`${x}/${z}`} position={[x, 0, z]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial map={texture} color="#7f8ca8" roughness={0.85} metalness={0.15} />
        </mesh>
      ))}
      {[-3, 3].map((x) => (
        <mesh key={x} position={[x, 0.006, -6.5]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.035, 41]} />
          <meshStandardMaterial color="#759da5" emissive="#173a48" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </>
  );
}
const staticPlacements: Placement[] = [
  {
    name: 'hangar_roundA',
    position: [-12.5, -0.08, 8],
    scale: 3.4,
    rotation: Math.PI / 2,
    solid: true,
  },
  {
    name: 'hangar_roundGlass',
    position: [12, -0.1, -11],
    scale: 3.6,
    rotation: -Math.PI / 2,
    solid: true,
  },
  { name: 'hangar_smallA', position: [-11, 0, -15], scale: 3, rotation: Math.PI / 2, solid: true },
  {
    name: 'hangar_largeA',
    position: [14, -0.1, 13],
    scale: 3.8,
    rotation: -Math.PI / 2,
    solid: true,
  },
  { name: 'satelliteDish_large', position: [-12, 0, -26], scale: 3.2 },
  { name: 'satelliteDish_detailed', position: [10, 0, -28], scale: 2.7 },
  { name: 'rover', position: [-8, 0.08, 12], scale: 2.4, rotation: 0.7 },
  { name: 'craft_cargoA', position: [15, 0.4, -32], scale: 3, rotation: -0.6 },
  { name: 'structure_detailed', position: [8, 0, -16], scale: [2, 3, 2] },
  { name: 'machine_wireless', position: [-5, 0, -15], scale: 1.4 },
  { name: 'barrels', position: [-7, 0, 1], scale: 1.4 },
  { name: 'machine_barrel', position: [7, 0, -7], scale: 1.3 },
  ...[4, -3, -13].map((z, i): Placement => ({
    name: 'platform_large',
    position: [i === 1 ? 3 : -3, -0.19, z],
    scale: [2.2, 2, 2.2],
  })),
  { name: 'stairs_short', position: [-5, -0.1, 8], scale: 1.5 },
  ...[0, 1, 2, 3, 4].flatMap((i): Placement[] => [
    { name: 'pipe_straight', position: [7, -0.15, 8 - i * 3], scale: 2.8 },
    { name: 'pipe_supportLow', position: [7, -0.1, 8 - i * 3], scale: 2.8 },
  ]),
  { name: 'pipe_cornerRound', position: [7, -0.1, -7], scale: 2.8 },
  ...Array.from({ length: 17 }, (_, i): Placement => ({
    name: i % 2 === 0 ? 'rock_largeA' : 'rock_largeB',
    position: [(i % 2 === 0 ? -1 : 1) * (20 + (i % 3) * 4), -0.7, -45 + i * 4],
    scale: [9 + (i % 4) * 2, 6 + (i % 3) * 3, 9],
    rotation: i * 1.7,
  })),
  ...[
    [-6, 12],
    [7, 5],
    [-8, -6],
    [8, -19],
    [-7, -22],
  ].flatMap(([x, z], i): Placement[] => [
    { name: 'rocks_smallA', position: [x!, 0, z!], scale: 1.8, rotation: i },
    { name: 'rock_crystals', position: [x! + 0.8, 0, z! - 0.6], scale: 1.2 },
  ]),
];
function Environment({ runtime }: { runtime: PlayerRuntime }) {
  return (
    <>
      <Terrain />
      <StaticModels placements={staticPlacements} />
      <Sign text={nb.rpg.worldSign} position={[-6, 3.3, 7]} width={4} />
      <Sign text={nb.rpg.workshopSign} position={[3, 3.7, -3]} width={3.5} />
      <Sign text={nb.rpg.portalSign} position={[0, 6.6, -24]} width={4.8} />
      <Sign text={nb.rpg.places.guide} position={[-3, 2.25, 4]} width={2.5} runtime={runtime} />
      <Sign text={nb.rpg.places.engineer} position={[-3, 2.25, -13]} width={3} runtime={runtime} />
    </>
  );
}
function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[110, 24, 16]} />
      <shaderMaterial
        side={1}
        depthWrite={false}
        vertexShader={`varying vec3 vDirection; void main(){vDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`varying vec3 vDirection;void main(){vec3 d=normalize(vDirection);float h=d.y;vec3 c=mix(vec3(.08,.13,.23),vec3(.025,.035,.085),smoothstep(-.1,.8,h));float arc=exp(-pow((h-.25+sin(d.x*4.0)*.08)*12.0,2.0));c+=vec3(.085,.035,.12)*arc;gl_FragColor=vec4(c,1.0);}`}
      />
    </mesh>
  );
}
function Character({
  name,
  runtime,
  npc,
}: {
  name: string;
  runtime: PlayerRuntime;
  npc?: 'guide' | 'engineer';
}) {
  const asset = useAsset(name);
  const rig = useMemo(() => {
    const object = cloneCharacter(asset.scene);
    object.traverse((o) => {
      if (o instanceof Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return object;
  }, [asset]);
  const rigScale = useMemo(
    () => 1.75 / new Box3().setFromObject(rig).getSize(new Vector3()).y,
    [rig],
  );
  const group = useRef<Group>(null);
  const support = useMemo(() => actorSupport(rig), [rig]);
  const mixer = useMemo(() => new AnimationMixer(rig), [rig]);
  const actions = useMemo(
    () => Object.fromEntries(asset.animations.map((clip) => [clip.name, mixer.clipAction(clip)])),
    [asset, mixer],
  );
  const current = useRef<AnimationAction | null>(null);
  useEffect(
    () => () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(rig);
      const skeletons = new Set<Skeleton>();
      rig.traverse((object) => {
        if (object instanceof SkinnedMesh) skeletons.add(object.skeleton);
      });
      for (const skeleton of skeletons) skeleton.dispose();
    },
    [mixer, rig],
  );
  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const p = npc ? places[npc] : runtime.pose;
    node.visible = !!npc || !runtime.conversation;
    node.position.set(p.x, 0, p.z);
    const interacting = npc ? runtime.conversation === npc : !!runtime.conversation;
    const targetYaw = npc
      ? Math.atan2(runtime.pose.x - p.x, runtime.pose.z - p.z)
      : interacting && runtime.conversation
        ? Math.atan2(places[runtime.conversation].x - p.x, places[runtime.conversation].z - p.z)
        : runtime.pose.yaw;
    const difference = Math.atan2(
      Math.sin(targetYaw - node.rotation.y),
      Math.cos(targetYaw - node.rotation.y),
    );
    node.rotation.y += difference * (1 - Math.exp(-12 * delta));
    const next =
      actions[!npc && runtime.moving ? 'walk' : interacting ? 'interact-right' : 'idle']!;
    if (current.current !== next) {
      current.current?.fadeOut(0.18);
      next.reset().fadeIn(0.18).play();
      current.current = next;
    }
    // Calibrated source stance velocity at 1.75 m height matches the 2.7 m/s controller.
    mixer.update(Math.min(delta, 0.25) * (runtime.moving && !npc ? 1.12 : 1));
    const feetY = groundActor(node, support);
    if (!npc && runtime.root) {
      runtime.telemetry({ animation: runtime.moving ? 'walk' : interacting ? 'interact' : 'idle' });
      runtime.telemetry({ feetY: feetY.toFixed(3) });
      const leg = rig.getObjectByName('leg-left');
      if (leg) runtime.telemetry({ legAngle: leg.quaternion.x.toFixed(4) });
    }
  });
  return (
    <group ref={group}>
      <primitive object={rig} scale={rigScale} dispose={null} />
    </group>
  );
}
function Installation({
  model,
  runtime,
  reduced,
}: {
  model: ServiceModel;
  runtime: PlayerRuntime;
  reduced: boolean;
}) {
  const layerRefs = useRef<(Group | null)[]>([]);
  useFrame((_, dt) => {
    layers.forEach((layer, i) => {
      const owner = responsibility(model, layer);
      const target = owner === 'microsoft' ? -1.05 : owner === 'customer' ? 1.05 : 0;
      const node = layerRefs.current[i];
      if (node) {
        node.position.x = reduced ? target : MathUtils.damp(node.position.x, target, 8, dt);
        if (layer === 'os') runtime.telemetry({ osPosition: node.position.x.toFixed(2) });
      }
    });
  });
  return (
    <group position={[3, 0, -3]}>
      <Model name="machine_generatorLarge" position={[0, 0, 0]} scale={1.5} />
      <Sign text={nb.rpg.owners.microsoft} position={[-1.2, 3.1, 0]} width={1.9} />
      <Sign text={nb.rpg.owners.customer} position={[1.2, 3.1, 0]} width={1.6} />
      {layers.map((layer, i) => {
        const owner = responsibility(model, layer);
        return (
          <group
            key={layer}
            ref={(node) => {
              layerRefs.current[i] = node;
            }}
            position={[0, 0.8 + i * 0.26, 0.7]}
          >
            <mesh>
              <boxGeometry args={[1.3, 0.19, 0.45]} />
              <meshStandardMaterial
                color={
                  owner === 'microsoft' ? '#418caa' : owner === 'customer' ? '#b075c6' : '#c5a276'
                }
                metalness={0.3}
                roughness={0.3}
                emissive={owner === 'microsoft' ? '#123d52' : '#3f1e4b'}
                emissiveIntensity={0.4}
              />
            </mesh>
            <Sign text={nb.expedition.layers[layer].label} position={[0, 0, 0.26]} width={1.23} />
          </group>
        );
      })}
    </group>
  );
}
function Portal({ runtime }: { runtime: PlayerRuntime }) {
  const membrane = useRef<Mesh>(null);
  const material = useRef<MeshBasicMaterial>(null);
  useFrame((_, dt) => {
    if (material.current)
      material.current.opacity = MathUtils.damp(
        material.current.opacity,
        runtime.gate ? 0.95 : 0.2,
        5,
        dt,
      );
    if (membrane.current && runtime.gate)
      membrane.current.scale.x = MathUtils.damp(membrane.current.scale.x, 1.3, 4, dt);
  });
  return (
    <group position={[0, 0, -24]}>
      <Model name="gate_complex" position={[0, 0, 0]} scale={5.8} />
      <mesh ref={membrane} position={[0, 2.65, -0.01]}>
        <planeGeometry args={[3.7, 4.9]} />
        <meshBasicMaterial
          ref={material}
          color="#6aace6"
          transparent
          opacity={0.2}
          side={2}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0, 2, 1]} color="#8365dd" intensity={9} distance={7} />
    </group>
  );
}
function Director({
  runtime,
  reduced,
  onNear,
  onSave,
  quality,
  onReady,
  onFailure,
  onAdapt,
}: {
  runtime: PlayerRuntime;
  reduced: boolean;
  onNear: (id: PlaceId | null) => void;
  onSave: () => void;
  quality: string;
  onReady: () => void;
  onFailure: () => void;
  onAdapt: () => void;
}) {
  const { camera, gl, scene, size, setDpr } = useThree();
  const desired = useMemo(() => new Vector3(), []),
    look = useMemo(() => new Vector3(), []),
    direction = useMemo(() => new Vector3(), []),
    ray = useMemo(() => new Raycaster(), []);
  const lookCurrent = useMemo(
    () => new Vector3(runtime.pose.x, 1.2, runtime.pose.z - 1),
    [runtime],
  );
  const previousNear = useRef<PlaceId | null>(null);
  const moving = useRef(false);
  const elapsed = useRef(0);
  const sampled = useRef(0);
  const times = useRef<number[]>([]);
  const autoAdapted = useRef(false);
  const solids = useRef<Box3[]>([]);
  const shadowLight = useRef<{ castShadow: boolean } | null>(null);
  const contact = useMemo(() => new Vector3(), []);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  useEffect(() => {
    solids.current = [];
    scene.traverse((o) => {
      if (Array.isArray(o.userData.cameraBoxes)) solids.current.push(...o.userData.cameraBoxes);
      if (o.type === 'DirectionalLight') shadowLight.current = o;
    });
    onReady();
  }, [scene, onReady]);
  useEffect(() => {
    camera.position.set(runtime.pose.x, 4, runtime.pose.z + 6);
  }, [camera, runtime]);
  useFrame((_, dt) => runtime.tick(dt), -1);
  useFrame((_, dt) => {
    elapsed.current += dt;
    sampled.current += dt;
    const p = runtime.pose;
    const close = runtime.conversation && places[runtime.conversation];
    if (close) {
      if (runtime.conversation === 'installation') {
        desired.set(close.x, 6, close.z + (size.width < 600 ? 16 : 13));
        look.set(close.x, -1.8, close.z);
      } else {
        const bearing = Math.atan2(p.x - close.x, p.z - close.z);
        desired.set(close.x + Math.sin(bearing) * 5.45, 2.5, close.z + Math.cos(bearing) * 5.45);
        look.set(close.x, -0.1, close.z);
      }
    } else {
      desired.set(p.x, size.width < 600 ? 3.6 : 3.2, p.z + (size.width < 600 ? 6.8 : 6.6));
      look.set(p.x, 1, p.z - 2.4);
    }
    // Authored corridor keeps solid architecture outside play zones; one ray shortens the camera if needed.
    direction.copy(desired).sub(look);
    const length = direction.length();
    ray.set(look, direction.normalize());
    ray.far = length;
    let obstruction = length;
    for (const box of solids.current) {
      if (ray.ray.intersectBox(box, contact))
        obstruction = Math.min(obstruction, look.distanceTo(contact));
    }
    if (obstruction < length)
      desired.copy(look).addScaledVector(direction, Math.max(1.5, obstruction - 0.3));
    camera.position.lerp(desired, reduced ? 1 : 1 - Math.exp(-6 * dt));
    lookCurrent.lerp(look, reduced ? 1 : 1 - Math.exp(-8 * dt));
    camera.lookAt(lookCurrent);
    runtime.telemetry({
      cameraSettled: String(
        camera.position.distanceTo(desired) < 0.04 && lookCurrent.distanceTo(look) < 0.04,
      ),
      cameraPlace: runtime.conversation ?? '',
    });
    if (previousNear.current !== runtime.near) {
      previousNear.current = runtime.near;
      onNear(runtime.near);
    }
    if ((moving.current && !runtime.moving) || elapsed.current > 2) {
      moving.current = runtime.moving;
      elapsed.current = 0;
      onSave();
    } else moving.current = runtime.moving;
    if (sampled.current > 0.15 && runtime.root) {
      sampled.current = 0;
      runtime.telemetry({
        playerX: p.x.toFixed(2),
        playerZ: p.z.toFixed(2),
        moving: String(runtime.moving),
        near: runtime.near ?? '',
      });
    }
    gl.render(scene, camera);
    if (dt > 0 && dt < 1) {
      times.current.push(dt * 1000);
      if (times.current.length > 180) times.current.shift();
    }
    const sorted = [...times.current].sort((a, b) => a - b);
    const mean = times.current.reduce((a, b) => a + b, 0) / Math.max(1, times.current.length);
    runtime.record({
      frames: runtime.measurement.frames + 1,
      fps: 1000 / Math.max(mean, 1),
      p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      adapted: autoAdapted.current,
    });
    if (quality === 'auto' && !autoAdapted.current && times.current.length >= 30 && mean > 32) {
      autoAdapted.current = true;
      setDpr(0.85);
      gl.shadowMap.enabled = false;
      onAdapt();
    }
    runtime.telemetry({
      frames: String(runtime.measurement.frames),
      dpr: gl.getPixelRatio().toFixed(2),
      shadows: String(gl.shadowMap.enabled),
      shadowLight: String(shadowLight.current?.castShadow ?? false),
    });
  }, 1);
  return null;
}
export function GameScene({
  runtime,
  model,
  reduced,
  visible,
  quality,
  onNear,
  onSave,
  onFailure,
  onReady,
}: {
  runtime: PlayerRuntime;
  model: ServiceModel;
  reduced: boolean;
  visible: boolean;
  quality: 'auto' | 'low' | 'high';
  onNear: (id: PlaceId | null) => void;
  onSave: () => void;
  onFailure: () => void;
  onReady: () => void;
}) {
  const [adapted, setAdapted] = useState(false);
  const adapt = useCallback(() => setAdapted(true), []);
  const automaticLow = quality === 'auto' && adapted;
  const low = quality === 'low' || (quality === 'auto' && window.innerWidth < 640);
  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      camera={{ fov: 48, near: 0.1, far: 140 }}
      dpr={automaticLow ? 0.85 : low ? 1 : [1, 1.5]}
      shadows={!low && !automaticLow}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(new Color('#111a31'));
        gl.toneMappingExposure = 1.25;
      }}
    >
      <fog attach="fog" args={['#182a46', 25, 85]} />
      <Atmosphere />
      <hemisphereLight args={['#91abc9', '#253040', 1.5]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-14, 23, 8]}
        color="#ffe2b2"
        intensity={3.5}
        castShadow={!low && !automaticLow}
        shadow-mapSize={[quality === 'high' ? 2048 : 1024, quality === 'high' ? 2048 : 1024]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />
      <AssetLibrary>
        <Environment runtime={runtime} />
        <Installation model={model} runtime={runtime} reduced={reduced} />
        <Portal runtime={runtime} />
        <Character name="character-female-a" runtime={runtime} />
        <Character name="character-female-d" runtime={runtime} npc="guide" />
        <Character name="character-male-f" runtime={runtime} npc="engineer" />
        <Director
          runtime={runtime}
          reduced={reduced}
          quality={quality}
          onNear={onNear}
          onSave={onSave}
          onReady={onReady}
          onFailure={onFailure}
          onAdapt={adapt}
        />
      </AssetLibrary>
    </Canvas>
  );
}
