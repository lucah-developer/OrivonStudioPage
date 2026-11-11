import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL = "/models/orivon-logo.glb";

let modelPromise;

function loadModel() {
  if (!modelPromise) modelPromise = new GLTFLoader().loadAsync(MODEL_URL);
  return modelPromise;
}

export default function HeroLogo() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let disposed = false;
    let frame = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 799px)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 800);
    const renderer = new THREE.WebGLRenderer({
      antialias: !small,
      alpha: true,
      powerPreference: small ? "low-power" : "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    wrap.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const env = pmrem.fromScene(envScene, 0.04);
    scene.environment = env.texture;
    if ("environmentIntensity" in scene) scene.environmentIntensity = 0.62;

    scene.add(new THREE.AmbientLight(0xfaf2e8, 0.48));
    const key = new THREE.DirectionalLight(0xfff4e6, 2.6);
    key.position.set(-3.4, 5.2, 6.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xd7c8b4, 0.7);
    fill.position.set(4.5, 0.4, 3.2);
    scene.add(fill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    let radius = 1;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const clock = new THREE.Clock();

    const frameCamera = () => {
      const width = wrap.clientWidth || 1;
      const height = wrap.clientHeight || 1;
      const narrow = width < 800;
      camera.aspect = width / height;
      const fit = narrow ? 0.9 : 1.05;
      const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      const dist = radius / (tan * fit);
      const shift = narrow ? 0 : radius * 0.1;
      camera.position.set(radius * 0.05, radius * 0.04, dist);
      camera.lookAt(shift, -radius * 0.04, 0);
      camera.near = Math.max(dist / 80, 0.05);
      camera.far = dist * 10;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resize = new ResizeObserver(frameCamera);
    resize.observe(wrap);

    const onMove = (event) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 0.1;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 0.05;
    };
    if (!reduce && !coarse) window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const t = clock.getElapsedTime();
      const bob = Math.sin(t * 0.42) * 0.7 + Math.sin(t * 0.23) * 0.3;
      pivot.position.y = reduce ? 0 : bob * radius * 0.07;
      pivot.rotation.y = -0.22 + pointer.x;
      pivot.rotation.x = 0.02 + pointer.y * 0.12;
      pivot.rotation.z = 0;
      renderer.render(scene, camera);
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (document.hidden || !visible) return;
      draw();
    };

    loadModel()
      .then((gltf) => {
        if (disposed) return;
        const model = gltf.scene.clone(true);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        radius = box.getBoundingSphere(new THREE.Sphere()).radius || 1;
        pivot.add(model);
        frameCamera();
        draw();
      })
      .catch(() => {});

    frameCamera();
    if (reduce) draw();
    else loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.environment = null;
      env.texture.dispose();
      envScene.traverse((child) => {
        child.geometry?.dispose();
        const materials = child.material ? [].concat(child.material) : [];
        materials.forEach((material) => material.dispose?.());
      });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="orivon-hero__logo" ref={wrapRef} />;
}
