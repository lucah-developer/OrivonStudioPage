import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createBeadSurface } from "./logoBeads.js";

const MODEL_URL = "/models/orivon-logo.glb";

let modelPromise;
function loadModel() {
  if (!modelPromise) modelPromise = new GLTFLoader().loadAsync(MODEL_URL);
  return modelPromise;
}

const buttonStyle = (active) => ({
  border: "1px solid #0B2C4A",
  background: active ? "#0B2C4A" : "transparent",
  color: active ? "#FAF2E8" : "#0B2C4A",
  borderRadius: 999,
  padding: "8px 16px",
  font: "500 13px Manrope, sans-serif",
  cursor: "pointer",
});

export default function BeadLab() {
  const params = new URLSearchParams(window.location.search);
  const wrapRef = useRef(null);
  const stateRef = useRef(null);
  const [mode, setMode] = useState(params.get("mode") === "solid" ? "solid" : "beads");
  const [waves, setWaves] = useState(params.get("waves") === "1");
  const [info, setInfo] = useState("Generando la superficie…");
  const settings = useRef({ mode, waves });
  settings.current = { mode, waves };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let disposed = false;
    let frame = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 800);
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0xfaf2e8, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    wrap.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04);
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.62;

    const ambient = new THREE.AmbientLight(0xfaf2e8, 0.48);
    const hemi = new THREE.HemisphereLight(0xfaf2e8, 0x071525, 1.6);
    const key = new THREE.DirectionalLight(0xfaf2e8, 3.4);
    key.position.set(-3.4, 5.2, 6.5);
    const rim = new THREE.DirectionalLight(0xfaf2e8, 2.2);
    rim.position.set(5.5, 3.5, 1.5);
    scene.add(ambient, hemi, key, rim);

    const pivot = new THREE.Group();
    pivot.rotation.set(0.02, -0.22, 0);
    scene.add(pivot);

    let radius = 1;
    let model = null;
    let surface = null;
    const clock = new THREE.Clock();

    const frameCamera = () => {
      const width = wrap.clientWidth || 1;
      const height = wrap.clientHeight || 1;
      camera.aspect = width / height;
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const zoom = Number(new URLSearchParams(window.location.search).get("zoom")) || 1;
      const dist = radius / (tan * Math.min(1, camera.aspect) * 0.86 * zoom);
      camera.position.set(radius * 0.05, radius * 0.04, dist);
      camera.lookAt(0, -radius * 0.02, 0);
      camera.near = Math.max(dist / 80, 0.05);
      camera.far = dist * 8;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const applyMode = () => {
      const { mode: current, waves: wavy } = settings.current;
      const solid = current === "solid";
      if (model) model.visible = solid;
      if (surface) {
        surface.showBeads(!solid);
        surface.setWaves(wavy);
      }
      scene.environment = solid ? env.texture : null;
      hemi.visible = !solid;
      rim.visible = !solid;
      ambient.visible = solid;
    };
    stateRef.current = { applyMode };

    const resize = new ResizeObserver(frameCamera);
    resize.observe(wrap);

    const loop = () => {
      frame = requestAnimationFrame(loop);
      surface?.update(clock.getElapsedTime(), reduced);
      renderer.render(scene, camera);
    };

    loadModel()
      .then((gltf) => {
        if (disposed) return;
        model = gltf.scene.clone(true);
        const box = new THREE.Box3().setFromObject(model);
        model.position.sub(box.getCenter(new THREE.Vector3()));
        radius = box.getBoundingSphere(new THREE.Sphere()).radius || 1;
        pivot.add(model);
        pivot.updateMatrixWorld(true);
        const started = performance.now();
        surface = createBeadSurface({ model, pivot, radius, compact: window.innerWidth < 900 });
        const ms = Math.round(performance.now() - started);
        const { count, spacing, bead, before, after } = surface.info;
        setInfo(
          `${count} esferas · separación ${spacing.toFixed(3)} · radio ${bead.toFixed(3)} · ${ms} ms · `
          + `vecina antes ${before.mean}/cv ${before.cv}/p05 ${before.p05} · después ${after.mean}/cv ${after.cv}/p05 ${after.p05}`
        );
        window.__beadLab = { ...surface.info, ms, ready: true };
        frameCamera();
        applyMode();
      })
      .catch(() => setInfo("No se pudo leer el GLB."));

    frameCamera();
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      surface?.dispose();
      resize.disconnect();
      scene.environment = null;
      env.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      stateRef.current = null;
    };
  }, []);

  useEffect(() => {
    stateRef.current?.applyMode();
  }, [mode, waves]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#FAF2E8" }}>
      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "absolute", left: 20, top: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, zIndex: 2 }}>
        <button type="button" style={buttonStyle(mode === "solid")} onClick={() => setMode("solid")}>A · GLB sólido</button>
        <button type="button" style={buttonStyle(mode === "beads")} onClick={() => setMode("beads")}>B · Esferas</button>
        <button type="button" style={buttonStyle(waves)} onClick={() => setWaves((value) => !value)}>
          Ondas {waves ? "activadas" : "desactivadas"}
        </button>
        <span style={{ color: "#0B2C4A", font: "500 13px Manrope, sans-serif", marginLeft: 6 }}>{info}</span>
      </div>
    </div>
  );
}
