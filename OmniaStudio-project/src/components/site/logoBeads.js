import * as THREE from "three";

export const BEAD_SURFACE = {
  count: 20000,
  countCompact: 9000,
  candidates: 14,
  relaxPasses: 16,
  bead: 0.5,
  segments: [10, 8],
  waveAmp: 2.4,
  waveLength: 0.36,
  waveSpeed: 1.25,
};

function sampleCandidates(model, pivot, pool) {
  model.updateWorldMatrix(true, true);
  const toPivot = new THREE.Matrix4().copy(pivot.matrixWorld).invert();
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const na = new THREE.Vector3();
  const nb = new THREE.Vector3();
  const nc = new THREE.Vector3();
  const meshes = [];
  let area = 0;

  model.traverse((mesh) => {
    if (!mesh.isMesh || !mesh.geometry?.attributes.position) return;
    const position = mesh.geometry.attributes.position;
    const index = mesh.geometry.index;
    const triangles = index ? index.count / 3 : position.count / 3;
    const at = (triangle, corner) => (index ? index.getX(triangle * 3 + corner) : triangle * 3 + corner);
    const prefix = new Float32Array(triangles);
    let total = 0;
    for (let triangle = 0; triangle < triangles; triangle += 1) {
      a.fromBufferAttribute(position, at(triangle, 0)).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(position, at(triangle, 1)).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(position, at(triangle, 2)).applyMatrix4(mesh.matrixWorld);
      total += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * 0.5;
      prefix[triangle] = total;
    }
    if (total > 0) {
      meshes.push({ mesh, position, normal: mesh.geometry.attributes.normal, at, triangles, prefix, total });
      area += total;
    }
  });

  const points = [];
  meshes.forEach(({ mesh, position, normal, at, triangles, prefix, total }) => {
    const share = Math.round(pool * (total / area));
    for (let i = 0; i < share; i += 1) {
      const pick = Math.random() * total;
      let low = 0;
      let high = triangles - 1;
      while (low < high) {
        const mid = (low + high) >> 1;
        if (prefix[mid] < pick) low = mid + 1;
        else high = mid;
      }
      const i0 = at(low, 0);
      const i1 = at(low, 1);
      const i2 = at(low, 2);
      a.fromBufferAttribute(position, i0).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(position, i1).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(position, i2).applyMatrix4(mesh.matrixWorld);
      const root = Math.sqrt(Math.random());
      const r2 = Math.random();
      const w0 = 1 - root;
      const w1 = root * (1 - r2);
      const w2 = root * r2;
      const point = new THREE.Vector3().copy(a).multiplyScalar(w0).addScaledVector(b, w1).addScaledVector(c, w2);
      point.applyMatrix4(toPivot);
      const n = new THREE.Vector3();
      if (normal) {
        na.fromBufferAttribute(normal, i0);
        nb.fromBufferAttribute(normal, i1);
        nc.fromBufferAttribute(normal, i2);
        n.copy(na).multiplyScalar(w0).addScaledVector(nb, w1).addScaledVector(nc, w2);
        n.transformDirection(mesh.matrixWorld).transformDirection(toPivot);
      } else {
        n.copy(ab.subVectors(b, a).cross(ac.subVectors(c, a))).transformDirection(mesh.matrixWorld).transformDirection(toPivot);
      }
      if (n.lengthSq() < 1e-8) n.set(0, 0, 1);
      n.normalize();
      points.push({ x: point.x, y: point.y, z: point.z, nx: n.x, ny: n.y, nz: n.z });
    }
  });

  return { points, area };
}

const cellKey = (x, y, z) => (x + 4096) * 67108864 + (y + 4096) * 8192 + (z + 4096);
const keyOf = (point, cell) => cellKey(Math.floor(point.x / cell), Math.floor(point.y / cell), Math.floor(point.z / cell));

function buildGrid(points, cell) {
  const grid = new Map();
  points.forEach((point, index) => {
    const key = keyOf(point, cell);
    const bucket = grid.get(key);
    if (bucket) bucket.push(index);
    else grid.set(key, [index]);
  });
  return grid;
}

function forNeighbors(grid, cell, point, visit) {
  const cx = Math.floor(point.x / cell);
  const cy = Math.floor(point.y / cell);
  const cz = Math.floor(point.z / cell);
  for (let x = cx - 1; x <= cx + 1; x += 1) {
    for (let y = cy - 1; y <= cy + 1; y += 1) {
      for (let z = cz - 1; z <= cz + 1; z += 1) {
        const bucket = grid.get(cellKey(x, y, z));
        if (bucket) for (let i = 0; i < bucket.length; i += 1) visit(bucket[i]);
      }
    }
  }
}

function poisson(points, target, area) {
  const spacing = Math.sqrt((2 * area) / (Math.sqrt(3) * target));
  const minDist = spacing * 0.74;
  const cell = minDist;
  const grid = new Map();
  const accepted = [];
  const order = points.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  for (let k = 0; k < order.length && accepted.length < target; k += 1) {
    const point = points[order[k]];
    let crowded = false;
    forNeighbors(grid, cell, point, (index) => {
      if (crowded) return;
      const other = accepted[index];
      const dx = other.x - point.x;
      const dy = other.y - point.y;
      const dz = other.z - point.z;
      if (dx * dx + dy * dy + dz * dz < minDist * minDist) crowded = true;
    });
    if (crowded) continue;
    const id = accepted.length;
    accepted.push(point);
    const key = keyOf(point, cell);
    const bucket = grid.get(key);
    if (bucket) bucket.push(id);
    else grid.set(key, [id]);
  }

  return { accepted, spacing: Math.sqrt((2 * area) / (Math.sqrt(3) * Math.max(accepted.length, 1))) };
}

function relax(points, spacing, candidates, passes) {
  const surfaceCell = spacing * 0.6;
  const surface = buildGrid(candidates, surfaceCell);
  const count = points.length;
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  points.forEach((point, i) => {
    pos[i * 3] = point.x;
    pos[i * 3 + 1] = point.y;
    pos[i * 3 + 2] = point.z;
    nor[i * 3] = point.nx;
    nor[i * 3 + 1] = point.ny;
    nor[i * 3 + 2] = point.nz;
  });
  const next = new Float32Array(count * 3);
  const reach = spacing * 1.08;
  const probe = { x: 0, y: 0, z: 0 };

  const project = (i) => {
    probe.x = pos[i * 3];
    probe.y = pos[i * 3 + 1];
    probe.z = pos[i * 3 + 2];
    const nx = nor[i * 3];
    const ny = nor[i * 3 + 1];
    const nz = nor[i * 3 + 2];
    let best = -1;
    let bestDist = Infinity;
    forNeighbors(surface, surfaceCell, probe, (index) => {
      const candidate = candidates[index];
      if (candidate.nx * nx + candidate.ny * ny + candidate.nz * nz < 0.5) return;
      const dx = candidate.x - probe.x;
      const dy = candidate.y - probe.y;
      const dz = candidate.z - probe.z;
      const dist = dx * dx + dy * dy + dz * dz;
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });
    if (best < 0) return;
    const c = candidates[best];
    const offset = (probe.x - c.x) * c.nx + (probe.y - c.y) * c.ny + (probe.z - c.z) * c.nz;
    pos[i * 3] = probe.x - c.nx * offset;
    pos[i * 3 + 1] = probe.y - c.ny * offset;
    pos[i * 3 + 2] = probe.z - c.nz * offset;
    nor[i * 3] = c.nx;
    nor[i * 3 + 1] = c.ny;
    nor[i * 3 + 2] = c.nz;
  };

  const view = { x: 0, y: 0, z: 0 };
  for (let pass = 0; pass < passes; pass += 1) {
    const grid = new Map();
    for (let i = 0; i < count; i += 1) {
      view.x = pos[i * 3];
      view.y = pos[i * 3 + 1];
      view.z = pos[i * 3 + 2];
      const key = keyOf(view, reach);
      const bucket = grid.get(key);
      if (bucket) bucket.push(i);
      else grid.set(key, [i]);
    }
    const strength = pass < passes * 0.6 ? 0.5 : 0.32;
    for (let i = 0; i < count; i += 1) {
      const px = pos[i * 3];
      const py = pos[i * 3 + 1];
      const pz = pos[i * 3 + 2];
      const nx = nor[i * 3];
      const ny = nor[i * 3 + 1];
      const nz = nor[i * 3 + 2];
      let ox = 0;
      let oy = 0;
      let oz = 0;
      view.x = px;
      view.y = py;
      view.z = pz;
      forNeighbors(grid, reach, view, (j) => {
        if (j === i) return;
        if (nor[j * 3] * nx + nor[j * 3 + 1] * ny + nor[j * 3 + 2] * nz < 0.3) return;
        const dx = px - pos[j * 3];
        const dy = py - pos[j * 3 + 1];
        const dz = pz - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist >= reach) return;
        if (dist < 1e-6) {
          ox += (Math.random() - 0.5) * spacing * 0.2;
          oy += (Math.random() - 0.5) * spacing * 0.2;
          return;
        }
        const overlap = (reach - dist) / reach;
        ox += (dx / dist) * overlap * overlap * spacing;
        oy += (dy / dist) * overlap * overlap * spacing;
        oz += (dz / dist) * overlap * overlap * spacing;
      });
      const along = ox * nx + oy * ny + oz * nz;
      ox -= nx * along;
      oy -= ny * along;
      oz -= nz * along;
      const length = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const limit = spacing * 0.35;
      const scale = length * strength > limit ? limit / length : strength;
      next[i * 3] = px + ox * scale;
      next[i * 3 + 1] = py + oy * scale;
      next[i * 3 + 2] = pz + oz * scale;
    }
    pos.set(next);
    for (let i = 0; i < count; i += 1) project(i);
  }

  const result = new Array(count);
  for (let i = 0; i < count; i += 1) {
    result[i] = {
      x: pos[i * 3],
      y: pos[i * 3 + 1],
      z: pos[i * 3 + 2],
      nx: nor[i * 3],
      ny: nor[i * 3 + 1],
      nz: nor[i * 3 + 2],
    };
  }
  return result;
}

function spacingStats(points, spacing) {
  const grid = buildGrid(points, spacing * 1.5);
  const nearest = [];
  points.forEach((point, i) => {
    let best = Infinity;
    forNeighbors(grid, spacing * 1.5, point, (j) => {
      if (j === i) return;
      const other = points[j];
      if (other.nx * point.nx + other.ny * point.ny + other.nz * point.nz < 0.3) return;
      const dx = other.x - point.x;
      const dy = other.y - point.y;
      const dz = other.z - point.z;
      best = Math.min(best, Math.sqrt(dx * dx + dy * dy + dz * dz));
    });
    if (Number.isFinite(best)) nearest.push(best / spacing);
  });
  nearest.sort((a, b) => a - b);
  const mean = nearest.reduce((sum, value) => sum + value, 0) / Math.max(nearest.length, 1);
  const deviation = Math.sqrt(nearest.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(nearest.length, 1));
  return {
    mean: Number(mean.toFixed(3)),
    cv: Number((deviation / mean).toFixed(3)),
    p05: Number((nearest[Math.floor(nearest.length * 0.05)] || 0).toFixed(3)),
    min: Number((nearest[0] || 0).toFixed(3)),
  };
}

function beadMaterial(uniforms) {
  const material = new THREE.MeshStandardMaterial({
    color: "#0B2C4A",
    roughness: 0.28,
    metalness: 0.05,
  });
  material.customProgramCacheKey = () => "orivon-bead-surface-v3";
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uBead = uniforms.uBead;
    shader.uniforms.uWave = uniforms.uWave;
    shader.uniforms.uWaveAmp = uniforms.uWaveAmp;
    shader.uniforms.uWaveLength = uniforms.uWaveLength;
    shader.uniforms.uWaveSpeed = uniforms.uWaveSpeed;
    shader.uniforms.uSpan = uniforms.uSpan;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute vec3 aRest;
        attribute vec3 aSurfaceNormal;
        uniform float uTime;
        uniform float uBead;
        uniform float uWave;
        uniform float uWaveAmp;
        uniform float uWaveLength;
        uniform float uWaveSpeed;
        uniform float uSpan;
        varying float vMacro;`
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 orivonNormal = normalize(aSurfaceNormal);
        float orivonK = 6.2831853 / (uSpan * uWaveLength);
        vec2 orivonFlat = aRest.xy;
        float orivonRing = length(orivonFlat - vec2(-0.18, 0.22) * uSpan);
        float orivonPhaseA = orivonRing * orivonK - uTime * uWaveSpeed * 2.0;
        float orivonPhaseB = dot(orivonFlat, normalize(vec2(0.82, -0.57))) * orivonK * 0.62 - uTime * uWaveSpeed * 1.3;
        float orivonPhaseC = dot(orivonFlat, normalize(vec2(-0.31, 0.95))) * orivonK * 1.35 + uTime * uWaveSpeed * 0.9;
        float orivonFade = 0.6 + 0.4 * sin(uTime * 0.37 + orivonRing / uSpan * 2.4);
        float orivonWave = (sin(orivonPhaseA) * 0.55 + sin(orivonPhaseB) * 0.3 + sin(orivonPhaseC) * 0.15) * orivonFade;
        float orivonSlope = (cos(orivonPhaseA) * 0.55 + cos(orivonPhaseB) * 0.19 + cos(orivonPhaseC) * 0.2) * orivonFade;
        float orivonLift = (orivonWave * 0.5 + 0.5) * uWaveAmp * uWave;
        vec3 transformed = aRest + orivonNormal * (uBead * 0.55 + orivonLift) + position * uBead;
        vec3 orivonWorldNormal = normalize(mat3(modelMatrix) * orivonNormal);
        float orivonLight = dot(orivonWorldNormal, normalize(vec3(-0.42, 0.62, 0.66)));
        orivonLight += orivonSlope * uWave * 0.78 + orivonWave * uWave * 0.18;
        vMacro = mix(0.4, 1.6, smoothstep(-0.3, 1.0, orivonLight));`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vMacro;")
      .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= vMacro;");
  };
  return material;
}

export function createBeadSurface({ model, pivot, radius, compact = false }) {
  const target = compact ? BEAD_SURFACE.countCompact : BEAD_SURFACE.count;
  const { points: candidates, area } = sampleCandidates(model, pivot, target * BEAD_SURFACE.candidates);
  const packed = poisson(candidates, target, area);
  const spacing = packed.spacing;
  const before = spacingStats(packed.accepted, spacing);
  const placed = relax(packed.accepted, spacing, candidates, BEAD_SURFACE.relaxPasses);
  const after = spacingStats(placed, spacing);
  const total = placed.length;

  const rest = new Float32Array(total * 3);
  const normals = new Float32Array(total * 3);
  placed.forEach((point, i) => {
    rest[i * 3] = point.x;
    rest[i * 3 + 1] = point.y;
    rest[i * 3 + 2] = point.z;
    normals[i * 3] = point.nx;
    normals[i * 3 + 1] = point.ny;
    normals[i * 3 + 2] = point.nz;
  });

  const uniforms = {
    uTime: { value: 0 },
    uBead: { value: spacing * after.mean * BEAD_SURFACE.bead },
    uWave: { value: 0 },
    uWaveAmp: { value: spacing * BEAD_SURFACE.waveAmp },
    uWaveLength: { value: BEAD_SURFACE.waveLength },
    uWaveSpeed: { value: BEAD_SURFACE.waveSpeed },
    uSpan: { value: radius },
  };

  const [widthSegments, heightSegments] = BEAD_SURFACE.segments;
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  geometry.setAttribute("aRest", new THREE.InstancedBufferAttribute(rest, 3));
  geometry.setAttribute("aSurfaceNormal", new THREE.InstancedBufferAttribute(normals, 3));
  const material = beadMaterial(uniforms);
  const beads = new THREE.InstancedMesh(geometry, material, total);
  beads.frustumCulled = false;
  beads.renderOrder = 1;
  const identity = new THREE.Matrix4();
  for (let i = 0; i < total; i += 1) beads.setMatrixAt(i, identity);
  beads.instanceMatrix.needsUpdate = true;
  pivot.add(beads);

  const occluderMaterial = new THREE.MeshBasicMaterial({ color: "#071525" });
  const occluder = new THREE.Group();
  model.updateWorldMatrix(true, true);
  const toPivot = new THREE.Matrix4().copy(pivot.matrixWorld).invert();
  model.traverse((child) => {
    if (!child.isMesh) return;
    const shell = new THREE.Mesh(child.geometry, occluderMaterial);
    shell.matrixAutoUpdate = false;
    shell.matrix.multiplyMatrices(toPivot, child.matrixWorld);
    shell.renderOrder = 0;
    occluder.add(shell);
  });
  occluder.visible = beads.visible;
  pivot.add(occluder);
  const showBeads = (on) => {
    beads.visible = on;
    occluder.visible = on;
  };

  let wave = 0;
  let waveTarget = 0;

  return {
    beads,
    showBeads,
    info: { count: total, spacing, bead: uniforms.uBead.value, before, after },
    setWaves(on) {
      waveTarget = on ? 1 : 0;
    },
    update(time, reduced = false) {
      uniforms.uTime.value = time;
      wave += ((reduced ? 0 : waveTarget) - wave) * 0.06;
      uniforms.uWave.value = wave;
    },
    dispose() {
      pivot.remove(beads);
      pivot.remove(occluder);
      geometry.dispose();
      material.dispose();
      occluderMaterial.dispose();
    },
  };
}
