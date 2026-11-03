import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL = "/models/orivon-logo.glb";

let modelPromise;

function loadModel() {
  if (!modelPromise) {
    modelPromise = new GLTFLoader().loadAsync(MODEL_URL);
  }
  return modelPromise;
}

function fitDistance(radius, fovDeg, aspect, fit) {
  const half = THREE.MathUtils.degToRad(fovDeg) / 2;
  const tan = Math.tan(half);
  const distV = radius / (tan * fit);
  const distH = radius / (tan * aspect * fit);
  return Math.max(distV, distH);
}

export default function OrivonLogo() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const wrap = document.getElementById("orivon-logo-stage");
    if (!wrap) return undefined;

    let disposed = false;
    let frame = 0;
    let model = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.domElement.className = "hero3d__gl";
    renderer.domElement.setAttribute("aria-hidden", "true");
    wrap.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04);
    scene.environment = env.texture;
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.38;

    scene.add(new THREE.AmbientLight(0xf6f0e6, 0.42));

    const key = new THREE.DirectionalLight(0xfff4e8, 2.05);
    key.position.set(3.2, 4.6, 6.4);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x7c3aed, 1.35);
    rim.position.set(-5.5, 2.4, -3.6);
    scene.add(rim);

    const teal = new THREE.DirectionalLight(0x00a78e, 0.42);
    teal.position.set(4.2, -1.6, 3.2);
    scene.add(teal);

    const spark = new THREE.PointLight(0xff9a2a, 0.28, 0, 2);
    spark.position.set(-2.4, 0.6, 3.4);
    scene.add(spark);

    const spin = new THREE.Group();
    scene.add(spin);

    let radius = 1;

    const frameCamera = () => {
      const width = wrap.clientWidth || 1;
      const height = wrap.clientHeight || 1;
      const narrow = width < 760;
      camera.aspect = width / height;
      const fit = narrow ? 0.9 : 0.86;
      const dist = fitDistance(radius, camera.fov, camera.aspect, fit);
      camera.position.set(radius * 0.015, radius * 0.03, dist);
      camera.near = Math.max(dist / 80, 0.01);
      camera.far = dist * 12;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
      renderer.setSize(width, height, false);
    };

    const resize = new ResizeObserver(frameCamera);
    resize.observe(wrap);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { active: false, lastX: 0, lastY: 0, x: 0, y: 0 };

    const onPointerMove = (event) => {
      if (drag.active) {
        drag.y = THREE.MathUtils.clamp(drag.y + (event.clientX - drag.lastX) * 0.005, -0.62, 0.62);
        drag.x = THREE.MathUtils.clamp(drag.x + (event.clientY - drag.lastY) * 0.0032, -0.26, 0.26);
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        return;
      }
      if (!finePointer || reduce) return;
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 0.16;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 0.08;
    };

    const onPointerDown = (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag.active = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      wrap.classList.add("is-dragging");
    };

    const onPointerUp = () => {
      drag.active = false;
      wrap.classList.remove("is-dragging");
    };

    const onVisibility = () => {
      if (!document.hidden) clock.getDelta();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibility);

    const clock = new THREE.Clock();

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.055;
      pointer.y += (pointer.ty - pointer.y) * 0.055;
      if (!drag.active) {
        drag.x += (0 - drag.x) * 0.012;
        drag.y += (0 - drag.y) * 0.012;
      }

      if (reduce) {
        spin.rotation.set(0.05, 0.32, 0);
        spin.position.set(0, 0, 0);
      } else {
        spin.rotation.y = Math.sin(t * 0.26) * 0.3 + pointer.x + drag.y;
        spin.rotation.x = Math.sin(t * 0.34) * 0.055 + pointer.y * 0.35 + drag.x;
        spin.rotation.z = Math.sin(t * 0.2) * 0.02;
        spin.position.y = Math.sin(t * 0.65) * radius * 0.032;
        spin.position.z = Math.sin(t * 0.42) * radius * 0.015;
      }

      renderer.render(scene, camera);
    };

    loadModel()
      .then((gltf) => {
        if (disposed) return;
        model = gltf.scene.clone(true);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        radius = sphere.radius || 1;
        spin.add(model);
        frameCamera();
        wrap.dataset.radius = radius.toFixed(2);
        wrap.dataset.status = "ready";
        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    frameCamera();
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      if (model) spin.remove(model);
      scene.environment = null;
      env.texture.dispose();
      envScene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const materials = [].concat(child.material);
          materials.forEach((material) => material.dispose?.());
        }
      });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      id="orivon-logo-stage"
      className={`hero3d__canvas${status === "ready" ? " is-ready" : ""}`}
      role="img"
      aria-label="Logotipo tridimensional de Orivon Studio"
    >
      {status === "loading" && (
        <p className="hero3d__loading" role="status">
          Preparando el logotipo
        </p>
      )}
      {status === "error" && (
        <p className="hero3d__loading" role="alert">
          No se pudo cargar el modelo 3D del logotipo.
        </p>
      )}
    </div>
  );
}
