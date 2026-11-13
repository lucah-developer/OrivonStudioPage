import * as THREE from "three";

export const LOGO_DISSOLVE = {
  count: 42000,
  countCompact: 16000,
  influence: 0.34,
  scatter: 0.62,
  approach: 0.22,
  settle: 0.045,
  follow: 0.5,
  revealIn: 0.11,
  revealOut: 0.05,
  pixel: 3.15,
};

function readMap(map) {
  const image = map?.image;
  if (!image || !image.width || !image.height) return null;
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, image.width, image.height);
  return {
    data: context.getImageData(0, 0, image.width, image.height).data,
    width: image.width,
    height: image.height,
    flipY: Boolean(map.flipY),
  };
}

function colorAt(map, u, v, target) {
  const x = Math.min(map.width - 1, Math.max(0, Math.floor(u * (map.width - 1))));
  const yBase = map.flipY ? 1 - v : v;
  const y = Math.min(map.height - 1, Math.max(0, Math.floor(yBase * (map.height - 1))));
  const index = (y * map.width + x) * 4;
  target.setRGB(
    map.data[index] / 255,
    map.data[index + 1] / 255,
    map.data[index + 2] / 255,
    THREE.SRGBColorSpace
  );
  return target;
}

function sampleCandidates(model, pivot, pool) {
  model.updateWorldMatrix(true, true);
  const toPivot = new THREE.Matrix4().copy(pivot.matrixWorld).invert();
  const points = [];
  let totalArea = 0;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const na = new THREE.Vector3();
  const nb = new THREE.Vector3();
  const nc = new THREE.Vector3();
  const color = new THREE.Color();

  model.traverse((mesh) => {
    if (!mesh.isMesh || !mesh.geometry?.attributes.position) return;
    const geometry = mesh.geometry;
    const position = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    const normalAttr = geometry.attributes.normal;
    const index = geometry.index;
    const triangles = index ? index.count / 3 : position.count / 3;
    const prefix = new Float32Array(triangles);
    let total = 0;
    const at = (triangle, corner) => (index ? index.getX(triangle * 3 + corner) : triangle * 3 + corner);

    for (let triangle = 0; triangle < triangles; triangle += 1) {
      a.fromBufferAttribute(position, at(triangle, 0)).applyMatrix4(mesh.matrixWorld);
      b.fromBufferAttribute(position, at(triangle, 1)).applyMatrix4(mesh.matrixWorld);
      c.fromBufferAttribute(position, at(triangle, 2)).applyMatrix4(mesh.matrixWorld);
      ab.subVectors(b, a);
      ac.subVectors(c, a);
      total += ab.cross(ac).length() * 0.5;
      prefix[triangle] = total;
    }
    if (total <= 0) return;
    totalArea += total;

    const map = readMap(mesh.material?.map);
    const share = Math.round(pool * (total / total));
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
      const r1 = Math.random();
      const r2 = Math.random();
      const root = Math.sqrt(r1);
      const w0 = 1 - root;
      const w1 = root * (1 - r2);
      const w2 = root * r2;
      const point = new THREE.Vector3().copy(a).multiplyScalar(w0).addScaledVector(b, w1).addScaledVector(c, w2);
      point.applyMatrix4(toPivot);
      const normal = new THREE.Vector3();
      if (normalAttr) {
        na.fromBufferAttribute(normalAttr, i0);
        nb.fromBufferAttribute(normalAttr, i1);
        nc.fromBufferAttribute(normalAttr, i2);
        normal.copy(na).multiplyScalar(w0).addScaledVector(nb, w1).addScaledVector(nc, w2).normalize();
        normal.transformDirection(mesh.matrixWorld).transformDirection(toPivot);
      } else {
        normal.set(0, 0, 1);
      }
      if (uv && map) {
        const u = uv.getX(i0) * w0 + uv.getX(i1) * w1 + uv.getX(i2) * w2;
        const v = uv.getY(i0) * w0 + uv.getY(i1) * w1 + uv.getY(i2) * w2;
        colorAt(map, THREE.MathUtils.clamp(u, 0, 1), THREE.MathUtils.clamp(v, 0, 1), color);
      } else {
        color.setRGB(0.75, 0.75, 0.75);
      }
      points.push({
        x: point.x,
        y: point.y,
        z: point.z,
        nx: normal.x,
        ny: normal.y,
        nz: normal.z,
        r: color.r,
        g: color.g,
        b: color.b,
      });
    }
  });

  return { points, area: totalArea };
}

function dissolveMaterial(material, uniforms) {
  const list = Array.isArray(material) ? material : [material];
  list.forEach((item) => {
    if (!item || item.userData.orivonDissolve) return;
    item.userData.orivonDissolve = true;
    const previous = item.customProgramCacheKey?.bind(item);
    item.customProgramCacheKey = () => `${previous ? previous() : "mat"}-orivon-reveal`;
    item.needsUpdate = true;
    item.onBeforeCompile = (shader) => {
      shader.uniforms.uReveal = uniforms.uReveal;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uReveal;`
        )
        .replace(
          "#include <opaque_fragment>",
          `float orivonGrain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
          if (uReveal > orivonGrain) discard;
          #include <opaque_fragment>`
        );
    };
  });
}

function pointMaterial(uniforms) {
  return new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    vertexShader: `
      attribute vec3 aNormal;
      attribute vec3 aColor;
      attribute float aSeed;
      uniform vec3 uHit;
      uniform float uRadius;
      uniform float uScatter;
      uniform float uForce;
      uniform float uReveal;
      uniform float uPixel;
      varying vec3 vColor;
      void main() {
        vec3 n = normalize(mat3(modelMatrix) * aNormal);
        vec3 viewDir = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
        float facing = smoothstep(-0.25, 0.2, dot(n, viewDir));
        vec3 away = position - uHit;
        float dist = length(away);
        vec3 dir = dist > 0.0001 ? away / dist : aNormal;
        float kick = (1.0 - smoothstep(uRadius * 0.02, uRadius, dist)) * uForce;
        float varied = 0.28 + 0.72 * fract(sin(aSeed * 17.13) * 43758.5);
        vec3 side = normalize(cross(dir, abs(dir.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
        float spin = fract(aSeed * 9.17) * 6.2831853;
        vec3 offset = (dir * 0.72 + aNormal * 0.55) * uScatter * kick * varied;
        offset += side * cos(spin) * uScatter * kick * 0.38;
        vec4 mv = modelViewMatrix * vec4(position + offset, 1.0);
        mv.z += 1.4;
        float twinkle = 0.78 + 0.22 * fract(sin(aSeed * 91.7) * 43758.5);
        gl_PointSize = uPixel * uReveal * facing * twinkle * (1.0 + kick * 2.4);
        gl_Position = projectionMatrix * mv;
        vColor = mix(aColor, vec3(1.0), kick * 0.78);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        if (dot(uv, uv) > 1.0) discard;
        gl_FragColor = vec4(vColor, 1.0);
      }
    `,
  });
}

export function createLogoField({ model, pivot, radius, compact }) {
  const count = compact ? LOGO_DISSOLVE.countCompact : LOGO_DISSOLVE.count;
  const { points } = sampleCandidates(model, pivot, count);
  const total = points.length;
  const positions = new Float32Array(total * 3);
  const normals = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const seeds = new Float32Array(total);
  const linear = new THREE.Color();
  const display = new THREE.Color();

  for (let i = 0; i < total; i += 1) {
    const point = points[i];
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
    normals[i * 3] = point.nx;
    normals[i * 3 + 1] = point.ny;
    normals[i * 3 + 2] = point.nz;
    linear.setRGB(point.r, point.g, point.b);
    linear.getRGB(display, THREE.SRGBColorSpace);
    colors[i * 3] = display.r;
    colors[i * 3 + 1] = display.g;
    colors[i * 3 + 2] = display.b;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aNormal", new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uHit: { value: new THREE.Vector3() },
    uRadius: { value: radius * LOGO_DISSOLVE.influence },
    uScatter: { value: radius * LOGO_DISSOLVE.scatter },
    uForce: { value: 0 },
    uReveal: { value: 0 },
    uPixel: { value: compact ? LOGO_DISSOLVE.pixel * 0.85 : LOGO_DISSOLVE.pixel },
  };
  const material = pointMaterial(uniforms);
  const cloud = new THREE.Points(geometry, material);
  cloud.frustumCulled = false;
  cloud.renderOrder = 2;
  pivot.add(cloud);

  const meshes = [];
  model.traverse((child) => {
    if (!child.isMesh) return;
    meshes.push(child);
    dissolveMaterial(child.material, uniforms);
  });

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hitLocal = new THREE.Vector3();
  let force = 0;
  let reveal = 0;
  let primed = false;
  const pointer = { inside: false };

  const pointerFromEvent = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    pointer.inside = event.clientX >= rect.left && event.clientX <= rect.right
      && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!pointer.inside || rect.width === 0 || rect.height === 0) return;
    ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const update = ({ camera, intro }) => {
    let hovering = false;
    if (!intro && pointer.inside) {
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length) {
        hovering = true;
        hitLocal.copy(hits[0].point);
        pivot.worldToLocal(hitLocal);
        if (!primed) {
          uniforms.uHit.value.copy(hitLocal);
          primed = true;
        } else {
          uniforms.uHit.value.lerp(hitLocal, LOGO_DISSOLVE.follow);
        }
      }
    }
    force += ((hovering ? 1 : 0) - force) * (hovering ? LOGO_DISSOLVE.approach : LOGO_DISSOLVE.settle);
    const wantReveal = hovering || force > 0.045 ? 1 : 0;
    reveal += (wantReveal - reveal) * (wantReveal ? LOGO_DISSOLVE.revealIn : LOGO_DISSOLVE.revealOut);
    uniforms.uForce.value = force;
    uniforms.uReveal.value = reveal;
  };

  const dispose = () => {
    pivot.remove(cloud);
    geometry.dispose();
    material.dispose();
  };

  return { pointerFromEvent, update, dispose };
}
