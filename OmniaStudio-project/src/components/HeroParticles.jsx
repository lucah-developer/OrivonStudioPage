import { useEffect, useRef } from "react";

const COLORS = ["#FAF2E8", "#7C3AED", "#00A78E", "#FF9A2A"];

const VERT = `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;
varying vec4 vRandom;
varying vec3 vColor;
void main() {
  vRandom = random;
  vColor = color;
  vec3 pos = position * uSpread;
  pos.z *= 10.0;
  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
  vec4 mvPos = viewMatrix * mPos;
  if (uSizeRandomness == 0.0) {
    gl_PointSize = uBaseSize;
  } else {
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  }
  gl_Position = projectionMatrix * mvPos;
}
`;

const FRAG = `
precision highp float;
uniform float uTime;
varying vec4 vRandom;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
}
`;

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const int = parseInt(value, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function identity(out) {
  out.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  return out;
}

function perspective(out, fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  out.set([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, (2 * far * near) * nf, 0,
  ]);
  return out;
}

function translate(out, x, y, z) {
  out[12] = out[0] * x + out[4] * y + out[8] * z + out[12];
  out[13] = out[1] * x + out[5] * y + out[9] * z + out[13];
  out[14] = out[2] * x + out[6] * y + out[10] * z + out[14];
  out[15] = out[3] * x + out[7] * y + out[11] * z + out[15];
  return out;
}

function rotateX(out, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a10 = out[4];
  const a11 = out[5];
  const a12 = out[6];
  const a13 = out[7];
  const a20 = out[8];
  const a21 = out[9];
  const a22 = out[10];
  const a23 = out[11];
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

function rotateY(out, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a00 = out[0];
  const a01 = out[1];
  const a02 = out[2];
  const a03 = out[3];
  const a20 = out[8];
  const a21 = out[9];
  const a22 = out[10];
  const a23 = out[11];
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

function rotateZ(out, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const a00 = out[0];
  const a01 = out[1];
  const a02 = out[2];
  const a03 = out[3];
  const a10 = out[4];
  const a11 = out[5];
  const a12 = out[6];
  const a13 = out[7];
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

export default function HeroParticles() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!host || reduce) return undefined;

    const canvas = document.createElement("canvas");
    canvas.className = "hero3d__particles-canvas";
    host.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return undefined;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!vertex || !fragment || !gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const count = 200;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      let x;
      let y;
      let z;
      let len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const radius = Math.cbrt(Math.random());
      positions.set([x * radius, y * radius, z * radius], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      colors.set(hexToRgb(COLORS[i % COLORS.length]), i * 3);
    }

    const bind = (name, data, size) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    };
    bind("position", positions, 3);
    bind("random", randoms, 4);
    bind("color", colors, 3);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uModel = gl.getUniformLocation(program, "modelMatrix");
    const uView = gl.getUniformLocation(program, "viewMatrix");
    const uProj = gl.getUniformLocation(program, "projectionMatrix");
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    gl.uniform1f(gl.getUniformLocation(program, "uSpread"), 10);
    gl.uniform1f(gl.getUniformLocation(program, "uBaseSize"), 100 * pixelRatio);
    gl.uniform1f(gl.getUniformLocation(program, "uSizeRandomness"), 1);

    const model = new Float32Array(16);
    const view = new Float32Array(16);
    const proj = new Float32Array(16);
    const mouse = { x: 0, y: 0 };
    let frame = 0;
    let rotZ = 0;
    let last = performance.now();
    let elapsed = 0;

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      perspective(proj, (15 * Math.PI) / 180, canvas.width / canvas.height, 0.1, 1000);
      gl.uniformMatrix4fv(uProj, false, proj);
    };

    const onMove = (event) => {
      const rect = host.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden) {
        last = now;
        return;
      }
      const speed = 0.1;
      elapsed += (now - last) * speed;
      last = now;
      gl.uniform1f(uTime, elapsed * 0.001);
      rotZ += 0.01 * speed;
      identity(model);
      translate(model, -mouse.x, -mouse.y, 0);
      rotateX(model, Math.sin(elapsed * 0.0002) * 0.1);
      rotateY(model, Math.cos(elapsed * 0.0005) * 0.15);
      rotateZ(model, rotZ);
      gl.uniformMatrix4fv(uModel, false, model);
      identity(view);
      translate(view, 0, 0, -20);
      gl.uniformMatrix4fv(uView, false, view);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener("pointermove", onMove);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={hostRef} className="hero3d__particles" />;
}
