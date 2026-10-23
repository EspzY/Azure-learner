import { Box3, SkinnedMesh, Vector3, type Object3D } from 'three';

interface Support {
  mesh: SkinnedMesh;
  indices: number[];
}
const point = new Vector3();
function update(root: Object3D, supports: Support[]) {
  root.updateMatrixWorld(true);
  for (const { mesh } of supports) mesh.skeleton.update();
}
export function actorSupport(root: Object3D): Support[] {
  root.updateMatrixWorld(true);
  const meshes: SkinnedMesh[] = [];
  root.traverse((object) => {
    if (object instanceof SkinnedMesh) {
      object.skeleton.update();
      meshes.push(object);
    }
  });
  const bounds = new Box3().setFromObject(root, true);
  // Retain actual shoe/lower-leg vertices, including corners that become lowest during rotation.
  const threshold = bounds.min.y + (bounds.max.y - bounds.min.y) * 0.2;
  return meshes
    .map((mesh) => {
      const indices: number[] = [];
      for (let i = 0; i < mesh.geometry.getAttribute('position').count; i++) {
        mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld);
        if (point.y <= threshold) indices.push(i);
      }
      return { mesh, indices };
    })
    .filter((support) => support.indices.length > 0);
}
export function supportHeight(supports: Support[]) {
  let min = Infinity;
  for (const { mesh, indices } of supports)
    for (const index of indices) {
      mesh.getVertexPosition(index, point).applyMatrix4(mesh.matrixWorld);
      min = Math.min(min, point.y);
    }
  return min;
}
export function groundActor(root: Object3D, supports: Support[], floor = 0.012) {
  root.position.y = 0;
  update(root, supports);
  const lowest = supportHeight(supports);
  if (Number.isFinite(lowest)) root.position.y = floor - lowest;
  update(root, supports);
  return supportHeight(supports);
}
