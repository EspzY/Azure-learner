'use client';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import {
  Box3,
  Mesh,
  Group,
  Vector3,
  BufferAttribute,
  BufferGeometry,
  MeshStandardMaterial,
  type Material,
  type Texture,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import manifest from '../../../public/game/manifest.json';

const urls = manifest.assets.map((a) => a.file);
const Context = createContext<Map<string, GLTF>>(new Map());
export function AssetLibrary({ children }: { children: React.ReactNode }) {
  const loaded = useLoader(GLTFLoader, urls);
  const assets = useMemo(
    () =>
      new Map(loaded.map((asset, i) => [urls[i]!.split('/').at(-1)!.replace('.glb', ''), asset])),
    [loaded],
  );
  useEffect(
    () => () => {
      const geometries = new Set<Mesh['geometry']>();
      const materials = new Set<Material>();
      const textures = new Set<Texture>();
      for (const asset of loaded)
        asset.scene.traverse((o) => {
          if (o instanceof Mesh) {
            geometries.add(o.geometry);
            for (const mat of Array.isArray(o.material) ? o.material : [o.material]) {
              materials.add(mat);
              for (const value of Object.values(mat))
                if (value && typeof value === 'object' && 'isTexture' in value)
                  textures.add(value as Texture);
            }
          }
        });
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      for (const t of textures) t.dispose();
      useLoader.clear(GLTFLoader, urls);
    },
    [loaded],
  );
  return <Context.Provider value={assets}>{children}</Context.Provider>;
}
export function useAsset(name: string) {
  const asset = useContext(Context).get(name);
  if (!asset) throw new Error(`Unknown reviewed asset: ${name}`);
  return asset;
}
export interface Placement {
  name: string;
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: number;
  solid?: boolean;
}
export function StaticModels({ placements }: { placements: Placement[] }) {
  const assets = useContext(Context);
  const batches = useMemo(() => {
    const groups = new Map<string, { material: Material; parts: BufferGeometry[] }>();
    const cameraBoxes: Box3[] = [];
    for (const placement of placements) {
      const source = assets.get(placement.name)!;
      const object = source.scene.clone(true);
      const bounds = new Box3().setFromObject(object);
      const center = bounds.getCenter(new Vector3());
      object.position.set(-center.x, -bounds.min.y, -center.z);
      const parent = new Group();
      parent.add(object);
      parent.position.set(...placement.position);
      parent.rotation.y = placement.rotation ?? 0;
      const scale = placement.scale ?? 1;
      if (typeof scale === 'number') parent.scale.setScalar(scale);
      else parent.scale.set(...scale);
      parent.updateMatrixWorld(true);
      if (placement.solid) cameraBoxes.push(new Box3().setFromObject(parent));
      object.traverse((node) => {
        if (!(node instanceof Mesh)) return;
        const full = node.geometry.index ? node.geometry.toNonIndexed() : node.geometry.clone();
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        const spans = full.groups.length
          ? full.groups
          : [{ start: 0, count: full.getAttribute('position').count, materialIndex: 0 }];
        for (const span of spans) {
          const material = materials[span.materialIndex ?? 0]! as MeshStandardMaterial;
          const key = [
            material.name,
            material.color?.getHexString(),
            material.metalness,
            material.roughness,
            material.opacity,
          ].join(':');
          const part = new BufferGeometry();
          for (const attribute of ['position', 'normal']) {
            const original = full.getAttribute(attribute);
            if (original) {
              const values = original.array.slice(
                span.start * original.itemSize,
                (span.start + span.count) * original.itemSize,
              );
              part.setAttribute(
                attribute,
                new BufferAttribute(values, original.itemSize, original.normalized),
              );
            }
          }
          part.applyMatrix4(node.matrixWorld);
          const group = groups.get(key) ?? { material, parts: [] };
          group.parts.push(part);
          groups.set(key, group);
        }
        full.dispose();
      });
    }
    return {
      cameraBoxes,
      meshes: [...groups.values()].map((group) => {
        const geometry = mergeGeometries(group.parts)!;
        for (const part of group.parts) part.dispose();
        return { geometry, material: group.material };
      }),
    };
  }, [assets, placements]);
  useEffect(
    () => () => {
      for (const b of batches.meshes) b.geometry.dispose();
    },
    [batches],
  );
  return (
    <group userData={{ cameraBoxes: batches.cameraBoxes }}>
      {batches.meshes.map((batch, i) => (
        <mesh
          key={i}
          geometry={batch.geometry}
          material={batch.material}
          castShadow
          receiveShadow
          dispose={null}
        />
      ))}
    </group>
  );
}
export function Model({
  name,
  position,
  scale = 1,
  rotation = 0,
  solid = false,
}: {
  name: string;
  position: [number, number, number];
  scale?: number | [number, number, number];
  rotation?: number;
  solid?: boolean;
}) {
  const source = useAsset(name);
  const object = useMemo(() => {
    const result = source.scene.clone(true);
    const bounds = new Box3().setFromObject(result);
    const center = bounds.getCenter(new Vector3());
    result.position.set(-center.x, -bounds.min.y, -center.z);
    result.traverse((o) => {
      if (o instanceof Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.userData.cameraSolid = solid;
      }
    });
    return result;
  }, [source, solid]);
  return (
    <group position={position} scale={scale} rotation-y={rotation}>
      <primitive object={object} dispose={null} />
    </group>
  );
}
export { clone as cloneCharacter };
