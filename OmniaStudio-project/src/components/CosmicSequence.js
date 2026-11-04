import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const URLS = [
  "/models/pillar-teal.glb",
  "/models/pillar-orange.glb",
  "/models/pillar-violet.glb",
  "/models/pillar-blue.glb",
];

const BURST = [
  new THREE.Vector3(-0.42, 0.28, 0.22),
  new THREE.Vector3(0.46, 0.34, -0.12),
  new THREE.Vector3(-0.16, 0.46, 0.3),
  new THREE.Vector3(0.28, 0.18, 0.16),
];

const SPIN = [
  new THREE.Vector3(0.7, 1.4, 0.25),
  new THREE.Vector3(-0.45, -1.6, 0.35),
  new THREE.Vector3(0.9, 1.1, -0.3),
  new THREE.Vector3(-0.55, 1.25, 0.2),
];

const DESKTOP_TIMING = [
  { delay: 0, expand: 0.07, fall: 0.16 },
  { delay: 0.04, expand: 0.08, fall: 0.2 },
  { delay: 0.018, expand: 0.065, fall: 0.15 },
  { delay: 0.055, expand: 0.085, fall: 0.18 },
];

const ORBITS = [
  { radius: 1.35, tilt: 0.55, speed: 1, count: 14, color: [0.98, 0.95, 0.91], size: 1 },
  { radius: 1.85, tilt: 1.15, speed: -1.25, count: 12, color: [0, 0.65, 0.56], size: 0.85 },
  { radius: 2.35, tilt: 0.28, speed: 1.55, count: 16, color: [0.49, 0.23, 0.93], size: 0.75 },
  { radius: 1.6, tilt: 1.55, speed: -0.85, count: 10, color: [1, 0.6, 0.16], size: 0.9 },
];

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

function radialTexture(inner, outer) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const glow = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
  glow.addColorStop(0, inner);
  glow.addColorStop(1, outer);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function preparePillar(scene) {
  const inner = scene.clone(true);
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

function buildStars(mobile) {
  const orbits = mobile ? ORBITS.slice(0, 2) : ORBITS;
  const trail = 4;
  let count = 0;
  orbits.forEach((orbit) => {
    count += orbit.count * trail;
  });
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const alphas = new Float32Array(count);
  const sizes = new Float32Array(count);
  let cursor = 0;
  const layout = [];
  orbits.forEach((orbit) => {
    for (let i = 0; i < orbit.count; i += 1) {
      const base = (i / orbit.count) * Math.PI * 2;
      for (let step = 0; step < trail; step += 1) {
        colors[cursor * 3] = orbit.color[0];
        colors[cursor * 3 + 1] = orbit.color[1];
        colors[cursor * 3 + 2] = orbit.color[2];
        sizes[cursor] = orbit.size * (1 - step * 0.18);
        layout.push({ orbit, base, step, index: cursor });
        cursor += 1;
      }
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: `
      attribute vec3 color;
      attribute float aAlpha;
      attribute float aSize;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = color;
        vAlpha = aAlpha;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * clamp(220.0 / -mv.z, 1.2, 7.5);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float glow = smoothstep(0.5, 0.05, d);
        gl_FragColor = vec4(vColor, glow * vAlpha * uOpacity);
      }
    `,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.visible = false;
  return { points, layout, alphas };
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
      material.opacity = material.userData.baseOpacity * shown;
      material.transparent = shown < 0.999 || material.userData.baseTransparent;
      material.depthWrite = shown > 0.2 && material.userData.baseDepthWrite !== false;
      material.needsUpdate = true;
    });
  });
}

const PRE = 0.34;
const BLAST_SECONDS = 2.75;

function blastEase(t) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return 1 - (1 - x) ** 1.35;
}

export function createSequence({ scene, camera, renderer, spin, lights, getRadius, wrap }) {
  const stars = buildStars(window.matchMedia("(max-width: 900px)").matches);
  scene.add(stars.points);

  const flash = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture("rgba(255,246,234,0.95)", "rgba(124,58,237,0)"),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
      color: 0xfff6ea,
    }),
  );
  flash.scale.setScalar(1);
  flash.visible = false;
  scene.add(flash);
  const fill = new THREE.DirectionalLight(0xfff4e8, 0);
  fill.position.set(-1.4, 3.2, 5.2);
  scene.add(fill);

  const shadowMap = radialTexture("rgba(7,21,37,0.45)", "rgba(7,21,37,0)");
  const shadows = URLS.map(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 0.22),
      new THREE.MeshBasicMaterial({
        map: shadowMap,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    mesh.visible = false;
    mesh.renderOrder = 1;
    scene.add(mesh);
    return mesh;
  });

  const pillars = [];
  let disposed = false;
  let rest = null;
  let active = false;
  let loading = false;
  let playhead = 0;
  let autoT = 0;
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
    stars.points.visible = false;
    flash.visible = false;
    shadows.forEach((shadow) => {
      shadow.visible = false;
    });
    pillars.forEach((group) => {
      if (group) group.visible = false;
    });
    fill.intensity = 0;
    document.querySelectorAll("[data-slot]").forEach((slot) => slot.style.setProperty("--drop", "0"));
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.38;
    wrap.dataset.journey = "0";
    wrap.dataset.phase = "0";
    playhead = 0;
    autoT = 0;
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
    const flag = wrap.dataset.play || "0";
    let mode = progress > 0.0008 || flag === "1" || flag === "done";

    if (reduce) {
      const rect = section?.getBoundingClientRect();
      mode = Boolean(rect && rect.top < window.innerHeight * 0.82 && rect.bottom > 40);
      playhead = mode ? 1 : 0;
      autoT = mode ? 1 : 0;
    } else if (flag === "1") {
      autoT = Math.min(1, autoT + dt / BLAST_SECONDS);
      playhead = THREE.MathUtils.lerp(PRE, 1, blastEase(autoT));
      if (autoT >= 1) wrap.dataset.play = "done";
    } else if (flag === "done" && progress > 0.2) {
      playhead = 1;
      autoT = 1;
    } else {
      const target = THREE.MathUtils.clamp(progress, 0, 1) * PRE;
      playhead = playhead > target + 0.02 ? THREE.MathUtils.damp(playhead, target, 5, dt) : target;
      if (playhead <= target + 0.02) autoT = 0;
      mode = playhead > 0.01 || progress > 0.0008;
    }

    wrap.dataset.phase = playhead.toFixed(4);
    wrap.dataset.journey = playhead.toFixed(4);

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
    const stage = wrap.getBoundingClientRect();
    const toWorld = (x, y, z = 0) => {
      const nx = ((x - view.left) / view.width) * 2 - 1;
      const ny = -(((y - view.top) / view.height) * 2 - 1);
      return new THREE.Vector3(nx * halfW, ny * halfH, z);
    };

    const stageCenter = toWorld(stage.left + stage.width / 2, stage.top + stage.height / 2);
    const center = new THREE.Vector3(0, halfH * 0.04, 0);
    const move = mobile ? smooth(phase / 0.2) : smooth(phase / 0.2);
    spin.position.lerpVectors(stageCenter, center, move);
    const dip = Math.sin(THREE.MathUtils.clamp((phase - 0.34) / 0.09, 0, 1) * Math.PI);
    const fade = 1 - smooth((phase - 0.44) / 0.1);
    const presence = 1 + move * 0.14;
    spin.scale.set(1, 1, 1);
    spin.scale.multiplyScalar(Math.max(fade, 0.0001) * presence * (1 - dip * 0.16));
    setGroupOpacity(spin, THREE.MathUtils.clamp(fade, 0, 1));
    const starTurn = smooth((phase - 0.08) / 0.26);
    const angle = starTurn * starTurn * Math.PI * (mobile ? 2.2 : 5.2);
    spin.rotation.y = THREE.MathUtils.lerp(rest.rotY, 0.22, move) + angle * 0.04;
    spin.rotation.x = 0.05 * (1 - move);
    spin.rotation.z = 0;

    lights.rim.intensity = 1.35 + starTurn * 0.85 + dip * 1.3;
    lights.teal.intensity = 0.42 + starTurn * 0.45;
    lights.spark.intensity = 0.28 + dip * 1.6 + starTurn * 0.35;
    lights.key.intensity = phase > 0.7 ? 2.85 : 2.05 + dip * 2.6;
    fill.intensity = phase > 0.68 ? 1.15 : dip * 0.4;

    const radius = getRadius();
    const starOpacity = (mobile ? 0.5 : 1) * smooth((phase - 0.1) / 0.1) * (1 - smooth((phase - 0.46) / 0.12));
    stars.points.visible = starOpacity > 0.02;
    stars.points.position.copy(spin.position);
    stars.points.material.uniforms.uOpacity.value = starOpacity;
    const positionAttr = stars.points.geometry.getAttribute("position");
    const alphaAttr = stars.points.geometry.getAttribute("aAlpha");
    stars.layout.forEach((item) => {
      const lag = item.step * 0.11;
      const theta = item.base + (angle - lag) * item.orbit.speed;
      const r = radius * item.orbit.radius;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r * Math.cos(item.orbit.tilt);
      const z = Math.sin(theta) * r * Math.sin(item.orbit.tilt) * 0.65;
      positionAttr.setXYZ(item.index, x, y, z);
      alphaAttr.setX(item.index, (1 - item.step * 0.22) * (item.step === 0 ? 1 : 0.45));
    });
    positionAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;

    flash.visible = dip > 0.02;
    flash.position.copy(spin.position);
    flash.scale.setScalar(radius * (3.2 + dip * 5));
    flash.material.opacity = dip * 0.75;

    const birthBase = 0.46;
    const slots = section ? [...section.querySelectorAll("[data-slot]")] : [];
    const worldPerPx = (halfH * 2) / height;
    const seconds = now / 1000;

    pillars.forEach((group, index) => {
      const slot = slots[index];
      const shadow = shadows[index];
      if (!group || !slot) return;
      const box = slot.getBoundingClientRect();
      const home = toWorld(box.left + box.width / 2, box.top + box.height * 0.98, 0);
      const fit = box.height * (mobile ? 0.98 : 1.08) * worldPerPx;
      const timing = DESKTOP_TIMING[index];
      const delay = mobile ? index * 0.055 : timing.delay;
      const expand = mobile ? 0.07 : timing.expand;
      const fall = mobile ? 0.12 : timing.fall;
      const t0 = birthBase + delay;
      const t1 = t0 + expand;
      const t2 = t1 + fall;
      const t3 = t2 + 0.06;
      const spread = mobile ? halfW * 0.16 : halfW * 0.34;
      const burst = spin.position.clone().add(BURST[index].clone().multiplyScalar(spread));
      let pos = spin.position.clone();
      let scale = 0.0001;
      let settle = 0;
      let impact = 0;

      if (phase >= t3) {
        pos = home.clone();
        scale = fit;
        settle = 1;
      } else if (phase < t0) {
        scale = 0.0001;
      } else if (phase < t1) {
        const t = smooth((phase - t0) / expand);
        pos = spin.position.clone().lerp(burst, t);
        scale = fit * (0.16 + 0.84 * t);
      } else if (phase < t2) {
        const t = THREE.MathUtils.clamp((phase - t1) / fall, 0, 1);
        pos = new THREE.Vector3(
          THREE.MathUtils.lerp(burst.x, home.x, smooth(t)),
          THREE.MathUtils.lerp(burst.y, home.y, t * t),
          THREE.MathUtils.lerp(burst.z, home.z, t),
        );
        scale = fit;
        settle = smooth(t);
      } else {
        const t = (phase - t2) / 0.06;
        pos = home.clone();
        pos.y += Math.sin(t * Math.PI) * fit * 0.1;
        scale = fit;
        settle = 1;
        impact = Math.sin(t * Math.PI);
      }

      const card = slot.closest(".pillar");
      const motion = group.userData.motion || (group.userData.motion = { lift: 0, nx: 0, ny: 0, kick: 0, kickVel: 0, seen: "" });
      const hot = settle > 0.9 && card?.classList.contains("is-hot") ? 1 : 0;
      motion.lift = THREE.MathUtils.damp(motion.lift, hot, 7, dt);
      motion.nx = THREE.MathUtils.damp(motion.nx, hot ? Number(card.style.getPropertyValue("--px") || 0) : 0, 7, dt);
      motion.ny = THREE.MathUtils.damp(motion.ny, hot ? Number(card.style.getPropertyValue("--py") || 0) : 0, 7, dt);
      const kickId = card?.dataset.kick || "";
      if (kickId && kickId !== motion.seen) {
        motion.seen = kickId;
        motion.kickVel = 6;
      }
      motion.kickVel *= Math.exp(-dt * 4.2);
      motion.kick += motion.kickVel * dt;

      if (settle > 0.85) {
        pos.y += Math.sin(seconds * 1.45 + index * 1.2) * fit * 0.045 * settle + motion.lift * fit * 0.16;
        scale *= 1 + motion.lift * 0.08;
      }

      group.visible = scale > 0.001;
      group.position.copy(pos);
      group.scale.set(scale, scale * (1 - impact * 0.06), scale);
      const tumble = 1 - settle;
      group.rotation.set(
        SPIN[index].x * tumble + motion.ny * 0.4,
        SPIN[index].y * tumble + motion.nx * 0.55 + motion.kick,
        SPIN[index].z * tumble + Math.sin(seconds * 0.8 + index) * 0.03 * settle,
      );

      shadow.visible = settle > 0.35;
      shadow.position.set(home.x, home.y - fit * 0.16, home.z + 0.02);
      shadow.scale.set(fit * 0.62, fit * 0.62, 1);
      shadow.material.opacity = (settle > 0.35 ? smooth((settle - 0.35) / 0.65) : 0) * 0.42;

      const dropped = phase >= t2 ? 1 : phase > t1 ? smooth((phase - t1) / fall) : 0;
      slot.style.setProperty("--drop", dropped.toFixed(3));
    });

    if ("environmentIntensity" in scene) {
      scene.environmentIntensity = phase > 0.62 ? 1.05 : 0.38 + starTurn * 0.2;
    }

    return true;
  };

  return {
    preload,
    update,
    dispose() {
      disposed = true;
      stars.points.geometry.dispose();
      stars.points.material.dispose();
      flash.material.map?.dispose();
      flash.material.dispose();
      shadowMap.dispose();
      shadows.forEach((shadow) => {
        shadow.geometry.dispose();
        shadow.material.dispose();
      });
      pillars.forEach((group) => {
        if (group) scene.remove(group);
      });
      scene.remove(stars.points);
      scene.remove(flash);
      scene.remove(fill);
      restoreHero();
    },
  };
}
