import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PROJECTS } from "./projectReelData";
import "./projectReel.css";

const WIDTH = 2.38;
const HEIGHT = 1.5771;
const FOV = 65.7;

const vertexShader = `
  uniform float uBend;
  uniform float uTime;
  uniform float uRipple;
  varying vec2 vUv;
  varying float vCurve;
  void main() {
    vUv = uv;
    float halfWidth = 1.19;
    float bend = max(uBend, 0.001);
    float angle = (position.x / halfWidth) * bend;
    float radius = halfWidth / bend;
    vec3 displaced = position;
    displaced.x = sin(angle) * radius;
    displaced.z = position.z + (cos(angle) - 1.0) * radius;
    displaced.y += sin(uv.x * 6.28318 + uTime * 0.4) * uRipple;
    vCurve = abs(position.x / halfWidth);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying float vCurve;
  void main() {
    vec2 p = vUv - 0.5;
    float radius = 0.034;
    vec2 q = abs(p) - vec2(0.5) + radius;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    float mask = 1.0 - smoothstep(0.0, max(fwidth(dist) * 1.35, 0.0008), dist);
    if (mask < 0.01) discard;
    vec4 tex = texture2D(uMap, vUv);
    float shade = 1.0 - vCurve * vCurve * 0.2;
    float rim = smoothstep(-0.028, -0.004, dist);
    vec3 rgb = mix(tex.rgb * shade, vec3(0.14, 0.11, 0.09), rim * 0.82);
    gl_FragColor = vec4(rgb, tex.a * mask);
  }
`;

const shadowFragment = `
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float radius = 0.05;
    vec2 q = abs(p) - vec2(0.5) + radius;
    float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    float mask = 1.0 - smoothstep(0.0, 0.09, dist);
    gl_FragColor = vec4(0.11, 0.08, 0.06, mask * 0.34);
  }
`;

function relativeIndex(index, phase, count) {
  let delta = index - phase;
  delta -= count * Math.round(delta / count);
  return delta;
}

function fitTrack(width, height) {
  const aspect = width / Math.max(height, 1);
  const narrow = width < 760;
  const fraction = narrow ? 0.77 : 0.37;
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const distance = WIDTH / (2 * tanHalf * fraction * aspect);
  const trackRadius = narrow ? Math.max(2.15, aspect * 3.1) : Math.max(3.35, aspect * 1.55);
  const trackDepth = narrow ? 1.35 : 1.85;
  const groupZ = 8.1 - distance - (trackDepth - 0.28);
  return { trackDepth, trackRadius, pitch: 0.52, groupZ };
}

function coverTexture(texture) {
  const image = texture.image;
  if (!image?.width || !image?.height) return;
  const imageAspect = image.width / image.height;
  const planeAspect = WIDTH / HEIGHT;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  if (imageAspect > planeAspect) {
    const repeat = planeAspect / imageAspect;
    texture.repeat.set(repeat, 1);
    texture.offset.set((1 - repeat) / 2, 0);
  } else {
    const repeat = imageAspect / planeAspect;
    texture.repeat.set(1, repeat);
    texture.offset.set(0, (1 - repeat) / 2);
  }
  texture.needsUpdate = true;
}

export default function ProjectReel() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const [webgl, setWebgl] = useState(true);
  const preview = new URLSearchParams(window.location.search).has("gallery");

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = PROJECTS.length;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebgl(false);
      return undefined;
    }
    if (!renderer.getContext()) {
      setWebgl(false);
      renderer.dispose();
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.25 : 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 40);
    camera.position.set(0, 0, 8.1);
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 48, 24);
    const loader = new THREE.TextureLoader();
    const cards = PROJECTS.map((project) => {
      const uniforms = {
        uMap: { value: null },
        uBend: { value: 0.3 },
        uTime: { value: 0 },
        uRipple: { value: reduce ? 0 : 0.006 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      });
      const shadowMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader: shadowFragment,
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const shadow = new THREE.Mesh(geometry, shadowMaterial);
      shadow.position.set(0.02, -0.045, -0.05);
      shadow.scale.set(1.045, 1.06, 1);
      shadow.frustumCulled = false;
      mesh.add(shadow);
      mesh.frustumCulled = false;
      scene.add(mesh);
      loader.load(project.cover, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        coverTexture(texture);
        material.uniforms.uMap.value = texture;
        material.needsUpdate = true;
      });
      return { mesh, material, shadowMaterial, project };
    });

    let disposed = false;
    let raf = 0;
    let running = true;
    let onScreen = true;
    let active = !preview;
    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let lastY = 0;
    let phase = 0;
    let target = 0;
    let velocity = 0;
    let previousPhase = 0;
    let layout = fitTrack(root.clientWidth, root.clientHeight);
    const normal = new THREE.Vector3();
    const toward = new THREE.Vector3();

    const resize = () => {
      const width = Math.max(root.clientWidth, 1);
      const height = Math.max(root.clientHeight, 1);
      layout = fitTrack(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    const visibility = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    visibility.observe(root);

    const describe = () => {
      const index = ((Math.round(phase) % count) + count) % count;
      const project = PROJECTS[index];
      canvas.setAttribute(
        "aria-label",
        `${project.name}. ${project.category}. ${project.description}`,
      );
    };

    const filled = () => {
      const rect = root.getBoundingClientRect();
      return rect.top <= 16 && rect.bottom >= window.innerHeight - 16;
    };

    const onWheel = (event) => {
      if (!onScreen || !filled() || dragging) return;
      const line = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const delta = event.deltaY * line;
      if (!delta) return;
      const atStart = delta < 0 && phase < 0.08 && target <= 0.02;
      const atEnd = delta > 0 && phase > count - 1.08 && target >= count - 1.02;
      if (atStart || atEnd) return;
      event.preventDefault();
      const impulse = Math.max(-0.34, Math.min(0.34, delta * 0.00115));
      target = Math.max(0, Math.min(count - 1, target + (reduce ? Math.sign(impulse) : impulse)));
      if (reduce) phase = target;
    };

    const onKey = (event) => {
      const field = event.target?.closest?.("input, textarea, select, [contenteditable='true']");
      if (field || !filled()) return;
      if (event.key === "Home") target = 0;
      else if (event.key === "ArrowRight" || event.key === "ArrowDown") target = Math.min(count - 1, Math.round(phase) + 1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = Math.max(0, Math.round(phase) - 1);
      else return;
      event.preventDefault();
      if (reduce) phase = target;
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      target += -dx * 0.0034 + dy * 0.0042;
      if (target < 0) {
        window.scrollBy(0, target * 160);
        target = 0;
      } else if (target > count - 1) {
        window.scrollBy(0, (target - (count - 1)) * 160);
        target = count - 1;
      }
      if (reduce) phase = target;
    };

    const endDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      pointerId = null;
      target = Math.max(0, Math.min(count - 1, Math.round(target)));
      if (reduce) phase = target;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };

    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "still-active" || data.type === "preview") active = data.active !== false;
      if (data.active === false) active = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("message", onMessage);

    if (preview && window.parent !== window) {
      window.parent.postMessage({ type: "website-ready" }, window.location.origin);
    }

    const shouldRun = () => running && onScreen && !document.hidden && (!preview || active);

    const loop = (now) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!shouldRun()) {
        loop.then = now;
        return;
      }
      const dt = Math.min((now - (loop.then || now)) / 1000, 0.05);
      loop.then = now;
      if (preview && active && !reduce && !dragging) {
        target += dt * 0.08;
        if (target > count) target = 0;
      }
      const previous = phase;
      if (reduce) phase = target;
      else phase += (target - phase) * (1 - Math.exp(-13 * dt));
      velocity = dt > 0 ? (phase - previous) / dt : 0;
      const bend = reduce ? 0.3 : Math.min(0.42, 0.3 + Math.min(Math.abs(velocity) * 0.035, 0.12));
      const lean = reduce ? 0 : Math.max(-0.08, Math.min(0.08, velocity * -0.012));

      cards.forEach((card, index) => {
        const relative = relativeIndex(index, phase, count);
        const theta = relative * 0.73;
        const { mesh } = card;
        mesh.position.set(
          Math.sin(theta) * layout.trackRadius,
          relative * layout.pitch,
          Math.cos(theta) * layout.trackDepth - 0.28 + layout.groupZ,
        );
        mesh.rotation.set(relative * -0.01 + lean, Math.atan2(layout.trackDepth * Math.sin(theta), layout.trackRadius * Math.cos(theta)), 0);
        mesh.updateMatrixWorld();
        normal.set(0, 0, 1).applyQuaternion(mesh.quaternion);
        toward.copy(camera.position).sub(mesh.position).normalize();
        mesh.visible = normal.dot(toward) > 0.08 && Math.abs(relative) < count / 2;
        card.material.uniforms.uBend.value = bend;
        card.material.uniforms.uTime.value = reduce ? 0 : now * 0.001;
      });

      const ordered = [...cards].sort((a, b) => a.mesh.position.z - b.mesh.position.z);
      ordered.forEach((card, order) => {
        card.mesh.renderOrder = order * 2 + 1;
        card.mesh.children[0].renderOrder = order * 2;
      });
      if (Math.abs(phase - previousPhase) > 0.02) {
        previousPhase = phase;
        describe();
      }
      renderer.render(scene, camera);
    };

    const start = () => {
      if (raf || disposed) return;
      loop.then = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onHide = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onHide);
    describe();
    start();

    return () => {
      disposed = true;
      running = false;
      stop();
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onHide);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("message", onMessage);
      cards.forEach((card) => {
        card.material.uniforms.uMap.value?.dispose();
        card.material.dispose();
        card.shadowMaterial.dispose();
        scene.remove(card.mesh);
      });
      geometry.dispose();
      renderer.dispose();
    };
  }, [preview]);

  return (
    <section
      id="proyectos"
      ref={rootRef}
      className="reel"
      aria-labelledby="reel-title"
      data-gallery={preview ? "" : undefined}
    >
      <div className="reel__grain" aria-hidden="true" />
      <div className="reel__light" aria-hidden="true" />
      <h2 id="reel-title" className="reel__title">
        Good work.
        <br />
        Different perspectives.
      </h2>
      {webgl ? (
        <canvas ref={canvasRef} className="reel__canvas" role="img" aria-label="Proyectos de Orivon Studios" />
      ) : (
        <ul className="reel__fallback">
          {PROJECTS.map((project) => (
            <li key={project.name}>
              <img src={project.cover} alt={`${project.name}. ${project.category}. ${project.description}`} />
            </li>
          ))}
        </ul>
      )}
      {webgl && <p className="reel__hint">Scroll or drag to explore</p>}
    </section>
  );
}
