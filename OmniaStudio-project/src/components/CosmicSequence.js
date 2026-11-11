import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { pillarsState, focusOfTour, handOver } from "./pillarsState";

const URLS = [
  "/models/pillar-teal.glb",
  "/models/pillar-orange.glb",
  "/models/pillar-violet.glb",
  "/models/pillar-blue.glb",
];

const POSE = [
  [0.05, -0.22, 0.015],
  [0.04, 0.18, -0.01],
  [0.06, -0.12, 0.012],
  [0.04, 0.2, -0.012],
];

const SPACE = 0x081426;
const SPARKS = 280;
const SPARK_COLORS = [0x2ee6c8, 0xffb15a, 0xa078f0, 0xfff4e4, 0x6fb7ff];
const PAD_TOP = 0.15;
const PAD_RADIUS = 0.585;
// Installation layout: four slots on a very shallow arc, outer ones slightly further back.
const SLOTS = [-1.5, -0.5, 0.5, 1.5];
const ACCENT = [0x1ec9ad, 0xffb15a, 0xa078f0, 0x8eb4d4];
const INK = [0x00a78e, 0xff9a2a, 0x7c3aed, 0x4f86e8];

let pillarPromise;

function loadPillars() {
  if (!pillarPromise) {
    const loader = new GLTFLoader();
    pillarPromise = Promise.all(URLS.map((url) => loader.loadAsync(url).catch(() => null)));
  }
  return pillarPromise;
}

function smooth(t) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function radialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const glow = ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,0.9)");
  glow.addColorStop(0.45, "rgba(255,255,255,0.28)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function contactTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const glow = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  glow.addColorStop(0, "rgba(0,0,0,0.75)");
  glow.addColorStop(0.55, "rgba(0,0,0,0.3)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function preparePillar(scene) {
  const inner = scene.clone(true);
  inner.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    obj.material = Array.isArray(obj.material) ? obj.material.map((material) => material.clone()) : obj.material.clone();
  });
  const box = new THREE.Box3().setFromObject(inner);
  const height = box.getSize(new THREE.Vector3()).y || 1;
  inner.scale.setScalar(1 / height);
  inner.updateMatrixWorld(true);
  const fitted = new THREE.Box3().setFromObject(inner);
  const center = fitted.getCenter(new THREE.Vector3());
  inner.position.x -= center.x;
  inner.position.z -= center.z;
  inner.position.y -= fitted.min.y;
  const group = new THREE.Group();
  group.add(inner);
  group.visible = false;
  return group;
}

const FLAT_VERTEX = `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function arcMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uDraw: { value: 0 },
      uSpin: { value: 0 },
    },
    vertexShader: FLAT_VERTEX,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uDraw;
      uniform float uSpin;
      varying vec2 vPos;
      void main() {
        float a = fract(atan(vPos.y, vPos.x) / 6.2831853 + 0.5 - uSpin);
        if (a > uDraw) discard;
        float head = uDraw < 0.999 ? smoothstep(uDraw - 0.08, uDraw, a) : 0.0;
        float tail = smoothstep(0.0, 0.04, a);
        gl_FragColor = vec4(mix(uColor, vec3(1.0), head * 0.55), uOpacity * mix(0.35, 1.0, tail) * (1.0 + head * 0.8));
      }
    `,
  });
}

function shaftMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      varying float vEdge;
      void main() {
        vUv = uv;
        vec3 n = normalize(normalMatrix * normal);
        vEdge = 1.0 - abs(n.z);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vEdge;
      void main() {
        // Brightest near the platform, dissolving towards the source; soft core, slightly firmer edges.
        float fall = pow(1.0 - vUv.y, 1.4) * (1.0 - smoothstep(0.75, 1.0, vUv.y));
        float body = mix(0.35, 1.0, pow(vEdge, 2.0));
        gl_FragColor = vec4(uColor, fall * body * uOpacity);
      }
    `,
  });
}

function poolMaterial(color) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 }, uRadius: { value: 0.44 } },
    vertexShader: FLAT_VERTEX,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uRadius;
      varying vec2 vPos;
      void main() {
        float r = length(vPos) / uRadius;
        float glow = pow(1.0 - smoothstep(0.0, 1.0, r), 1.6);
        gl_FragColor = vec4(mix(uColor, vec3(1.0), glow * 0.25), glow * uOpacity);
      }
    `,
  });
}

function flatRing(inner, outer, material, y) {
  const mesh = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 160, 1), material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = y;
  mesh.renderOrder = 3;
  return mesh;
}

function makePlatform(color) {
  const profile = [
    [0, 0],
    [0.55, 0],
    [0.575, 0.012],
    [0.575, 0.05],
    [0.56, 0.062],
    [0.5, 0.068],
    [0.49, 0.078],
    [0.49, 0.13],
    [0.474, 0.144],
    [0.45, PAD_TOP],
    [0, PAD_TOP],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x111a27,
    roughness: 0.34,
    metalness: 0.72,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.65,
    fog: false,
  });
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 128), bodyMaterial);
  const rim = flatRing(0.436, 0.449, arcMaterial(color), PAD_TOP + 0.0015);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(0.44, 96), poolMaterial(color));
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = PAD_TOP + 0.001;
  pool.renderOrder = 3;

  const group = new THREE.Group();
  group.add(body, pool, rim);
  group.visible = false;
  return {
    group,
    body,
    rim,
    pool,
    dispose() {
      [body, rim, pool].forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    },
  };
}

function buildSparks() {
  const geometry = new THREE.BufferGeometry();
  const dirs = new Float32Array(SPARKS * 3);
  const colors = new Float32Array(SPARKS * 3);
  const extra = new Float32Array(SPARKS * 2);
  const color = new THREE.Color();
  for (let i = 0; i < SPARKS; i += 1) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    dirs[i * 3] = r * Math.cos(a);
    dirs[i * 3 + 1] = u * 0.62;
    dirs[i * 3 + 2] = r * Math.sin(a) * 0.5;
    color.setHex(SPARK_COLORS[i % SPARK_COLORS.length]);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    extra[i * 2] = 0.35 + Math.random() * 0.65;
    extra[i * 2 + 1] = 3 + Math.random() * 7;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(SPARKS * 3), 3));
  geometry.setAttribute("aDir", new THREE.BufferAttribute(dirs, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aExtra", new THREE.BufferAttribute(extra, 2));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uProgress: { value: 0 },
      uRadius: { value: 1 },
      uCenter: { value: new THREE.Vector3() },
      uScale: { value: 1 },
    },
    vertexShader: `
      attribute vec3 aDir;
      attribute vec3 aColor;
      attribute vec2 aExtra;
      uniform float uProgress;
      uniform float uRadius;
      uniform vec3 uCenter;
      uniform float uScale;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float t = clamp(uProgress, 0.0, 1.0);
        float travel = 1.0 - pow(1.0 - t, 3.0);
        vec3 p = uCenter + aDir * aExtra.x * uRadius * travel;
        p.y -= t * t * uRadius * 0.12;
        vColor = aColor;
        vAlpha = pow(1.0 - t, 1.4) * step(0.001, t);
        gl_PointSize = aExtra.y * uScale * (1.0 - t * 0.6);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d) * vAlpha);
      }
    `,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.visible = false;
  points.renderOrder = 6;
  return points;
}

function buildShockwave(color) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: 0 } },
    vertexShader: FLAT_VERTEX,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vPos;
      void main() {
        float r = length(vPos);
        float band = smoothstep(0.78, 0.97, r) * (1.0 - smoothstep(0.97, 1.0, r));
        float inner = smoothstep(0.2, 0.97, r) * 0.18;
        gl_FragColor = vec4(uColor, (band + inner) * uOpacity);
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 128), material);
  mesh.visible = false;
  mesh.renderOrder = 6;
  return mesh;
}

function buildStars() {
  const rings = [
    { radius: 1.1, tilt: 0.34, speed: 1.15, count: 10, color: [1, 0.97, 0.9], size: 1.35 },
    { radius: 1.65, tilt: 0.95, speed: 0.78, count: 8, color: [0.55, 0.86, 1], size: 1.05 },
    { radius: 2.2, tilt: 0.18, speed: -0.62, count: 7, color: [0.78, 0.58, 1], size: 0.9 },
  ];
  const count = rings.reduce((sum, ring) => sum + ring.count, 0);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const layout = [];
  let cursor = 0;
  rings.forEach((ring) => {
    for (let i = 0; i < ring.count; i += 1) {
      colors[cursor * 3] = ring.color[0];
      colors[cursor * 3 + 1] = ring.color[1];
      colors[cursor * 3 + 2] = ring.color[2];
      layout.push({ ring, base: (i / ring.count) * Math.PI * 2, index: cursor, size: ring.size });
      cursor += 1;
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(layout.map((item) => item.size)), 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: `
      attribute vec3 color;
      attribute float aSize;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * clamp(240.0 / -mv.z, 1.4, 8.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(vColor, smoothstep(0.5, 0.05, d) * uOpacity);
      }
    `,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.visible = false;
  return { points, layout };
}

function flashTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const glow = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.16, "rgba(255,250,240,0.92)");
  glow.addColorStop(0.4, "rgba(186,156,255,0.32)");
  glow.addColorStop(0.7, "rgba(46,230,200,0.08)");
  glow.addColorStop(1, "rgba(124,58,237,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function setGroupOpacity(root, value) {
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    [].concat(obj.material).forEach((material) => {
      if (!material) return;
      if (material.userData.baseOpacity == null) {
        material.userData.baseOpacity = material.opacity;
        material.userData.baseTransparent = material.transparent;
        material.userData.baseDepthWrite = material.depthWrite;
      }
      const shown = THREE.MathUtils.clamp(value, 0, 1);
      const transparent = shown < 0.999 || material.userData.baseTransparent;
      material.opacity = material.userData.baseOpacity * shown;
      material.depthWrite = shown > 0.2 && material.userData.baseDepthWrite !== false;
      if (material.transparent !== transparent) {
        material.transparent = transparent;
        material.needsUpdate = true;
      }
    });
  });
}

export function createSequence({ scene, camera, renderer, spin, lights, wrap }) {
  const shadowMap = radialTexture();
  const shadows = URLS.map(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: shadowMap,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    mesh.renderOrder = 2;
    scene.add(mesh);
    return mesh;
  });

  const platforms = INK.map((color) => {
    const platform = makePlatform(color);
    scene.add(platform.group);
    return platform;
  });
  const contactMap = contactTexture();
  const contacts = URLS.map(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: contactMap, transparent: true, depthWrite: false, opacity: 0 }),
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    mesh.renderOrder = 1;
    scene.add(mesh);
    return mesh;
  });
  shadows.forEach((mesh, index) => mesh.material.color.setHex(INK[index]));
  // Spotlight treatment for the selected pillar: a coloured glow behind it, a soft light shaft
  // from above and a real spot light that follows the focus.
  const backGlows = INK.map((color) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: shadowMap,
        color,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
        opacity: 0,
      }),
    );
    sprite.visible = false;
    sprite.renderOrder = 0;
    scene.add(sprite);
    return sprite;
  });
  const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.5, 1, 48, 1, true);
  shaftGeometry.translate(0, 0.5, 0);
  const shafts = INK.map((color) => {
    const mesh = new THREE.Mesh(shaftGeometry, shaftMaterial(color));
    mesh.visible = false;
    mesh.renderOrder = 4;
    scene.add(mesh);
    return mesh;
  });
  const spot = new THREE.SpotLight(0xffffff, 0, 0, 0.42, 0.9, 0);
  scene.add(spot);
  scene.add(spot.target);
  const uplights = ACCENT.map((color) => {
    const light = new THREE.PointLight(color, 0, 4, 2);
    scene.add(light);
    return light;
  });
  const sparks = buildSparks();
  scene.add(sparks);
  const waves = [buildShockwave(0xfff1dc), buildShockwave(0x9b6bff)];
  waves.forEach((wave) => scene.add(wave));
  const fog = new THREE.Fog(SPACE, 1, 2);

  const fill = new THREE.DirectionalLight(0xfff6ee, 0);
  fill.position.set(-2.2, 4.4, 6);
  scene.add(fill);
  const accent = new THREE.PointLight(ACCENT[0], 0, 8, 2);
  scene.add(accent);
  const stars = buildStars();
  scene.add(stars.points);
  const lightA = new THREE.Color();
  const lightB = new THREE.Color();
  const flareMap = flashTexture();
  const flare = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: flareMap,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    }),
  );
  flare.renderOrder = 10;
  flare.visible = false;
  scene.add(flare);

  const pillars = [];
  let disposed = false;
  let rest = null;
  let active = false;
  let loading = false;
  let playhead = 0;
  let lastNow = 0;

  const preload = () => {
    if (loading || disposed) return;
    loading = true;
    loadPillars().then((models) => {
      if (disposed) return;
      models.forEach((gltf, index) => {
        if (!gltf) {
          pillars[index] = null;
          return;
        }
        const group = preparePillar(gltf.scene);
        scene.add(group);
        pillars[index] = group;
      });
    });
  };

  const placeCanvas = (host) => {
    if (!host || renderer.domElement.parentElement === host) return;
    host.appendChild(renderer.domElement);
  };

  const restoreHero = () => {
    placeCanvas(wrap);
    renderer.domElement.classList.remove("is-sequence");
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const width = Math.max(wrap.clientWidth, 1);
    const height = Math.max(wrap.clientHeight, 1);
    renderer.setSize(width, height, false);
    spin.position.set(0, 0, 0);
    spin.scale.set(1, 1, 1);
    spin.rotation.z = 0;
    setGroupOpacity(spin, 1);
    shadows.forEach((shadow) => {
      shadow.visible = false;
    });
    platforms.forEach((platform) => {
      platform.group.visible = false;
    });
    contacts.forEach((contact) => {
      contact.visible = false;
    });
    if (scene.fog === fog) scene.fog = null;
    pillars.forEach((group) => {
      if (group) group.visible = false;
    });
    fill.intensity = 0;
    accent.intensity = 0;
    stars.points.visible = false;
    flare.visible = false;
    sparks.visible = false;
    waves.forEach((wave) => {
      wave.visible = false;
    });
    uplights.forEach((light) => {
      light.intensity = 0;
    });
    backGlows.forEach((sprite) => {
      sprite.visible = false;
    });
    shafts.forEach((mesh) => {
      mesh.visible = false;
    });
    spot.intensity = 0;
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.38;
    wrap.dataset.journey = "0";
    wrap.dataset.phase = "0";
    playhead = 0;
    rest = null;
    active = false;
  };

  const update = (progress) => {
    const now = performance.now();
    const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016);
    lastNow = now;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const section = document.getElementById("pillars");

    if (reduce) {
      const rect = section?.getBoundingClientRect();
      const shown = Boolean(rect && rect.top < window.innerHeight * 0.86 && rect.bottom > 40);
      playhead = shown ? 1 : 0;
    } else {
      playhead = THREE.MathUtils.clamp(progress, 0, 1);
    }

    wrap.dataset.phase = playhead.toFixed(4);
    wrap.dataset.journey = playhead.toFixed(4);
    const mode = playhead > 0.0008;

    if (!mode) {
      if (active) restoreHero();
      return false;
    }

    const phase = playhead;
    const host = mobile || reduce ? section : wrap.closest(".journey");
    if (!host) return false;

    if (!rest) {
      rest = {
        dist: Math.max(camera.position.z, 0.1),
        height: Math.max(wrap.getBoundingClientRect().height, 1),
        rotY: spin.rotation.y,
      };
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.25));
    }

    placeCanvas(host);
    renderer.domElement.classList.add("is-sequence");
    active = true;

    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    const dist = rest.dist * (height / rest.height);
    camera.aspect = width / height;
    camera.position.set(0, 0, dist);
    camera.near = Math.max(dist / 80, 0.01);
    camera.far = dist * 20;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist;
    const halfW = halfH * camera.aspect;
    const view = host.getBoundingClientRect();
    const stageBox = wrap.getBoundingClientRect();
    const toWorld = (x, y, z = 0) => {
      const nx = ((x - view.left) / view.width) * 2 - 1;
      const ny = -(((y - view.top) / view.height) * 2 - 1);
      return new THREE.Vector3(nx * halfW, ny * halfH, z);
    };

    const stageCenter = toWorld(stageBox.left + stageBox.width / 2, stageBox.top + stageBox.height / 2);
    const center = new THREE.Vector3(0, halfH * 0.04, 0);
    const arrive = smooth(phase / 0.16);
    const spinUp = smooth((phase - 0.16) / 0.28);
    const compress = smooth((phase - 0.44) / 0.06);
    const gone = smooth((phase - 0.494) / 0.022);
    spin.position.lerpVectors(stageCenter, center, arrive);
    const pulse = 1 + Math.sin(spinUp * Math.PI) * 0.08;
    const tremor = compress * (1 - gone) * Math.sin(now * 0.09) * 0.012;
    spin.scale.setScalar(Math.max(1.28 * pulse * (1 - compress * 0.3 + tremor) * (1 + gone * 0.5), 0.0001));
    setGroupOpacity(spin, 1 - gone);
    spin.visible = gone < 0.98;
    spin.rotation.y = rest.rotY + arrive * 0.35 + spinUp * spinUp * Math.PI * 2.4 + compress * Math.PI * 1.6;
    spin.rotation.x = THREE.MathUtils.lerp(0.12, 0.02, arrive);
    spin.rotation.z = spinUp * 0.08;

    const stagelight = smooth((phase - 0.56) / 0.2);
    const blast = phase < 0.5 ? smooth((phase - 0.47) / 0.03) : 1 - smooth((phase - 0.5) / 0.075);
    const burst = THREE.MathUtils.clamp((phase - 0.497) / 0.13, 0, 1);
    const starOpacity = smooth((phase - 0.14) / 0.08) * (1 - smooth((phase - 0.56) / 0.08));
    stars.points.visible = starOpacity > 0.02;
    stars.points.position.copy(spin.position);
    stars.points.material.uniforms.uOpacity.value = starOpacity;
    const positionAttr = stars.points.geometry.getAttribute("position");
    const gather = smooth((phase - 0.4) / 0.14);
    const arm = halfH * 0.34;
    stars.layout.forEach((item) => {
      const theta = item.base + spinUp * spinUp * Math.PI * 3.1 * item.ring.speed;
      const ring = item.ring.radius * (1 - gather * 0.72);
      const x = Math.cos(theta) * arm * ring;
      const y = Math.sin(theta) * arm * ring * Math.cos(item.ring.tilt);
      const z = Math.sin(theta) * arm * ring * Math.sin(item.ring.tilt) * 0.7;
      positionAttr.setXYZ(item.index, x, y, z);
    });
    positionAttr.needsUpdate = true;
    flare.visible = blast > 0.01;
    flare.position.copy(center);
    flare.scale.setScalar(halfH * (0.6 + blast * 3));
    flare.material.opacity = Math.min(1, blast * 1.1);

    // Shockwaves: one facing the camera, one flat like a nova disc.
    waves.forEach((wave, k) => {
      const t = THREE.MathUtils.clamp((phase - 0.497 - k * 0.01) / 0.08, 0, 1);
      wave.visible = t > 0 && t < 1;
      if (!wave.visible) return;
      const grow = 1 - Math.pow(1 - t, 3);
      wave.position.copy(center);
      wave.scale.setScalar(Math.max(halfH * (k === 0 ? 0.55 : 0.85) * grow, 0.0001));
      wave.rotation.set(k === 0 ? 0 : -1.22, 0, 0);
      wave.material.uniforms.uOpacity.value = Math.pow(1 - t, 1.8) * (k === 0 ? 0.45 : 0.6);
    });
    sparks.visible = burst > 0 && burst < 1;
    sparks.material.uniforms.uProgress.value = burst;
    sparks.material.uniforms.uRadius.value = halfW * 0.7;
    sparks.material.uniforms.uCenter.value.copy(center);
    sparks.material.uniforms.uScale.value = renderer.getPixelRatio();

    lights.rim.intensity = THREE.MathUtils.lerp(1.35, 1.6, stagelight) + blast * 2.2 + compress * (1 - gone) * 1.2;
    lights.teal.intensity = THREE.MathUtils.lerp(0.42, 0.55, stagelight);
    lights.spark.intensity = THREE.MathUtils.lerp(0.28, 0.35, stagelight) + blast * 2.4;
    lights.key.intensity = THREE.MathUtils.lerp(2.05, 1.45, stagelight) + blast * 2;
    fill.intensity = stagelight * 0.7;
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.38 + stagelight * 0.22;

    const slots = section ? [...section.querySelectorAll("[data-slot]")] : [];
    const worldPerPx = (halfH * 2) / height;
    const exhibitBox = section?.querySelector("[data-exhibit]")?.getBoundingClientRect();
    const installation = !mobile && Boolean(exhibitBox && exhibitBox.width > 2);

    // Scroll-driven state (written by the single ScrollTrigger timeline in Pillars.jsx).
    // Each discipline holds the stage, then hands over within the middle of the boundary.
    const turn = handOver(focusOfTour(pillarsState.tour), 0.15, 0.85);
    let focusT = turn.from + turn.mix;
    if (mobile) {
      const picked = Number(section?.dataset.focus);
      focusT = Number.isFinite(picked) ? picked : 0;
    }
    const exit = installation ? pillarsState.exit : 0;
    const dim = 1 - exit * 0.6;

    // The four pillars are revealed together as one composition (tiny left-to-right offset).
    const revealPhase = mobile ? 0.5 + ((phase - 0.5) / 0.24) * 0.5 : phase;

    let spacing = 1;
    let floorX = 0;
    let floorY = 0;
    let installFit = 1;
    if (installation) {
      spacing = (exhibitBox.width * worldPerPx) / 4;
      const floor = toWorld(exhibitBox.left + exhibitBox.width / 2, exhibitBox.bottom - exhibitBox.height * 0.22);
      floorX = floor.x;
      floorY = floor.y;
      installFit = Math.min(exhibitBox.height * worldPerPx * 0.5, spacing * 1.42);
      if (phase > 0.5) {
        scene.fog = fog;
        fog.near = dist + installFit * 0.3;
        fog.far = dist + installFit * 6;
      }
    } else if (scene.fog === fog) {
      scene.fog = null;
    }

    let accentWeightSum = 0;
    accent.position.set(0, 0, 0);
    lightA.setRGB(0, 0, 0);

    pillars.forEach((group, index) => {
      const platform = platforms[index];
      const halo = shadows[index];
      const contact = contacts[index];
      if (!platform) return;

      let footX;
      let footY;
      let footZ = 0;
      let fit;
      let span;
      let yaw = 0;
      if (installation) {
        const slot = SLOTS[index];
        fit = installFit;
        span = Math.min(spacing * 0.74, fit * 0.74);
        footX = floorX + slot * spacing;
        footY = floorY;
        footZ = -((slot * slot) / 2.25) * fit * 0.5;
        yaw = -slot * 0.12;
      } else {
        const box = slots[index]?.getBoundingClientRect();
        if (!box || box.width < 2 || box.height < 2) return;
        const foot = toWorld(box.left + box.width / 2, box.bottom, 0);
        fit = Math.min(box.height * 0.76, box.width * 0.92) * worldPerPx;
        footX = foot.x;
        footY = foot.y + fit * 0.03;
        span = Math.min(box.width * worldPerPx * 0.95, fit * 0.86);
      }

      const lag = index * 0.025;
      const rise = smooth((revealPhase - 0.55 - lag) / 0.26);
      const edge = smooth((revealPhase - 0.62 - lag) / 0.22);
      const shape = smooth((revealPhase - 0.66 - lag) / 0.26);
      const weight = smooth(1 - Math.abs(focusT - index)) * shape;

      // Active pillar: slightly larger and a touch forward. Exit: the whole installation pulls back.
      footZ += weight * fit * 0.2 - exit * fit * 0.9;
      const unit = span / (PAD_RADIUS * 2);
      const top = footY + PAD_TOP * unit;

      platform.group.visible = rise > 0.01;
      platform.group.position.set(footX, footY - (1 - rise) * unit * 0.25, footZ);
      platform.group.scale.setScalar(Math.max(unit * (0.92 + 0.08 * rise), 0.0001));
      platform.group.rotation.y = index * 0.7;
      setGroupOpacity(platform.body, rise);
      if (scene.environment && platform.body.material.envMap !== scene.environment) {
        platform.body.material.envMap = scene.environment;
        platform.body.material.needsUpdate = true;
      }
      platform.rim.material.uniforms.uDraw.value = edge;
      platform.rim.material.uniforms.uOpacity.value = Math.min(1, (0.45 + 0.75 * weight) * dim);
      platform.pool.material.uniforms.uOpacity.value = edge * (0.18 + 0.85 * weight) * dim;

      halo.visible = edge > 0.02;
      halo.position.set(footX, footY + 0.003, footZ);
      halo.scale.set(span * (1.8 + weight * 0.5), span * (0.9 + weight * 0.25), 1);
      halo.material.opacity = edge * (0.1 + 0.5 * weight) * dim;

      contact.visible = rise > 0.02;
      contact.position.set(footX, footY + 0.002, footZ);
      contact.scale.set(span * 1.35, span * 0.6, 1);
      contact.material.opacity = rise * 0.55;

      const uplight = uplights[index];
      uplight.position.set(footX, top + fit * 0.16, footZ + span * 0.55);
      uplight.distance = fit * 2.2;
      uplight.intensity = edge * (0.5 + 7.5 * weight) * dim;

      const glow = backGlows[index];
      glow.visible = edge > 0.02;
      glow.position.set(footX, top + fit * 0.48, footZ - fit * 0.45);
      glow.scale.set(fit * (1.5 + weight * 0.9), fit * (1.9 + weight * 0.9), 1);
      glow.material.opacity = edge * (0.05 + 0.5 * weight) * dim;

      const shaft = shafts[index];
      const shaftHeight = fit * 2.6;
      shaft.visible = installation && weight > 0.02;
      shaft.position.set(footX, top, footZ);
      shaft.scale.set(span * 1.2, shaftHeight, span * 1.2);
      shaft.material.uniforms.uOpacity.value = weight * 0.16 * dim;

      if (!group) return;
      const motion = group.userData.motion || (group.userData.motion = { hot: 0, nx: 0, ny: 0 });
      const card = slots[index]?.closest(".pillar");
      const hovering = mobile && phase >= 0.72 && card?.classList.contains("is-hot") ? 1 : 0;
      motion.hot = THREE.MathUtils.damp(motion.hot, hovering, 6, dt);
      motion.nx = THREE.MathUtils.damp(motion.nx, hovering ? Number(card?.style.getPropertyValue("--px") || 0) : 0, 7, dt);
      motion.ny = THREE.MathUtils.damp(motion.ny, hovering ? Number(card?.style.getPropertyValue("--py") || 0) : 0, 7, dt);

      const settle = 1 - shape;
      group.visible = shape > 0.01;
      group.position.set(footX, top + fit * 0.03 + settle * fit * 0.08 + motion.hot * fit * 0.04, footZ);
      const scale = installation ? 0.95 + 0.12 * weight : 0.96 + 0.06 * motion.hot;
      group.scale.setScalar(Math.max(fit * scale * (0.96 + 0.04 * shape), 0.0001));
      setGroupOpacity(group, shape);
      const pose = POSE[index];
      group.rotation.set(pose[0] + motion.ny * 0.16, pose[1] + yaw + motion.nx * 0.2, pose[2]);

      if (weight > 0.001) {
        lightB.setHex(ACCENT[index]).multiplyScalar(weight);
        lightA.add(lightB);
        accent.position.x += footX * weight;
        accent.position.y += (top + fit * 0.45) * weight;
        accent.position.z += (footZ + fit * 0.6) * weight;
        accentWeightSum += weight;
      }
    });

    // One key light follows the focus continuously, tinted by whichever discipline is active.
    if (accentWeightSum > 0.001) {
      accent.position.multiplyScalar(1 / accentWeightSum);
      accent.color.copy(lightA).multiplyScalar(1 / accentWeightSum);
      accent.intensity = 6 * Math.min(1, accentWeightSum) * dim;
      accent.distance = Math.max(halfW * 0.9, 1);
      spot.color.copy(accent.color).lerp(lightB.setRGB(1, 1, 1), 0.55);
      spot.position.set(accent.position.x, accent.position.y + installFit * 2.6, accent.position.z + installFit * 0.4);
      spot.target.position.set(accent.position.x, accent.position.y - installFit * 0.4, accent.position.z - installFit * 0.6);
      spot.target.updateMatrixWorld();
      spot.intensity = (installation ? 3.2 : 0) * Math.min(1, accentWeightSum) * dim;
    } else {
      accent.intensity = 0;
      spot.intensity = 0;
    }

    return true;
  };

  return {
    preload,
    update,
    dispose() {
      disposed = true;
      shadowMap.dispose();
      shadows.forEach((shadow) => {
        shadow.geometry.dispose();
        shadow.material.dispose();
        scene.remove(shadow);
      });
      platforms.forEach((platform) => {
        platform.dispose();
        scene.remove(platform.group);
      });
      contactMap.dispose();
      contacts.forEach((contact) => {
        contact.geometry.dispose();
        contact.material.dispose();
        scene.remove(contact);
      });
      pillars.forEach((group) => {
        if (!group) return;
        group.traverse((obj) => {
          if (!obj.isMesh) return;
          [].concat(obj.material).forEach((material) => material?.dispose?.());
        });
        scene.remove(group);
      });
      scene.remove(fill);
      scene.remove(accent);
      stars.points.geometry.dispose();
      stars.points.material.dispose();
      scene.remove(stars.points);
      sparks.geometry.dispose();
      sparks.material.dispose();
      scene.remove(sparks);
      waves.forEach((wave) => {
        wave.geometry.dispose();
        wave.material.dispose();
        scene.remove(wave);
      });
      uplights.forEach((light) => scene.remove(light));
      backGlows.forEach((sprite) => {
        sprite.material.dispose();
        scene.remove(sprite);
      });
      shaftGeometry.dispose();
      shafts.forEach((mesh) => {
        mesh.material.dispose();
        scene.remove(mesh);
      });
      scene.remove(spot.target);
      scene.remove(spot);
      flareMap.dispose();
      flare.material.dispose();
      scene.remove(flare);
      restoreHero();
    },
  };
}
