import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export type DepthViewerHandle = { flipTo: (side: "front" | "back") => void; flip: (dir?: 1 | -1) => void };

type Props = {
  front: string;
  back: string;
  depthFront: string;
  depthBack: string;
  normalFront: string;
  normalBack: string;
  /** garment colorway affects lighting response */
  light?: "dark" | "light";
  onSide?: (side: "front" | "back") => void;
  /** live tilt for the podium shadow (-1..1) */
  onTilt?: (x: number, y: number) => void;
};

const vert = /* glsl */ `
  uniform sampler2D uDepthF;
  uniform sampler2D uDepthB;
  uniform float uAmount;
  uniform float uSide;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float d = uSide < 0.5 ? texture2D(uDepthF, uv).r : -texture2D(uDepthB, vec2(1.0 - uv.x, uv.y)).r;
    p.z += d * uAmount;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform sampler2D uColF;
  uniform sampler2D uColB;
  uniform sampler2D uNormF;
  uniform sampler2D uNormB;
  uniform float uSide;
  uniform vec3 uLight;      // light direction, view space
  uniform mat3 uNormalMat;
  uniform float uDark;      // 1 = black garment (needs stronger sheen to read)
  varying vec2 vUv;

  void main() {
    vec2 uvB = vec2(1.0 - vUv.x, vUv.y);
    vec4 c = uSide < 0.5 ? texture2D(uColF, vUv) : texture2D(uColB, uvB);
    if (c.a < 0.04) discard;

    // baked normal maps (smooth, no 8-bit banding); back side is mirrored + faces -z
    vec3 n;
    if (uSide < 0.5) {
      n = texture2D(uNormF, vUv).xyz * 2.0 - 1.0;
    } else {
      vec3 nb = texture2D(uNormB, uvB).xyz * 2.0 - 1.0;
      n = vec3(-nb.x, nb.y, -nb.z);
    }
    n = normalize(uNormalMat * n);

    vec3 L = normalize(uLight);
    float diff = max(dot(n, L), 0.0);
    vec3 V = vec3(0.0, 0.0, 1.0);
    float spec = pow(max(dot(reflect(-L, n), V), 0.0), 18.0);
    float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.5);

    vec3 warm = vec3(1.0, 0.82, 0.6);
    vec3 base = c.rgb;
    vec3 col = base * mix(0.5 + 0.5 * diff, 0.42 + 0.8 * diff, uDark);
    col += warm * spec * mix(0.04, 0.09, uDark);
    col += warm * rim * mix(0.06, 0.2, uDark);
    // keep the black garment black: lift only the shading, never the base
    gl_FragColor = vec4(col, c.a);
    #include <colorspace_fragment>
  }
`;

/**
 * Fake 3D for a flat product photo: cutout + depth map displaced on a dense
 * plane, normals rebuilt from the depth for live lighting, mouse tilt and a
 * front/back card flip (click, drag or imperative).
 */
export const DepthViewer = forwardRef<DepthViewerHandle, Props>(function DepthViewer(
  { front, back, depthFront, depthBack, normalFront, normalBack, light = "dark", onSide, onTilt },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const flipTarget = useRef(0); // radians, multiples of PI when settled
  const api = useRef<DepthViewerHandle>({ flipTo: () => {}, flip: () => {} });
  useImperativeHandle(ref, () => ({ flipTo: (s) => api.current.flipTo(s), flip: (d) => api.current.flip(d) }));
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);
  const loader = useRef(new THREE.TextureLoader());

  // swap colorway textures without rebuilding the scene
  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    const l = loader.current;
    l.load(front, (t) => ((t.colorSpace = THREE.SRGBColorSpace), (u.uColF.value = t)));
    l.load(back, (t) => ((t.colorSpace = THREE.SRGBColorSpace), (u.uColB.value = t)));
    u.uDark.value = light === "dark" ? 1 : 0;
  }, [front, back, light]);

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    camera.position.set(0, 0, 4.2);

    const l = loader.current;
    const tex = (src: string, srgb = true) => {
      const t = l.load(src);
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    };
    const uniforms: Record<string, THREE.IUniform> = {
      uColF: { value: tex(front) },
      uColB: { value: tex(back) },
      uDepthF: { value: tex(depthFront, false) },
      uDepthB: { value: tex(depthBack, false) },
      uAmount: { value: 0.34 },
      uSide: { value: 0 },
      uNormF: { value: tex(normalFront, false) },
      uNormB: { value: tex(normalBack, false) },
      uLight: { value: new THREE.Vector3(0.3, 0.4, 1) },
      uNormalMat: { value: new THREE.Matrix3() },
      uDark: { value: light === "dark" ? 1 : 0 },
    };
    uniformsRef.current = uniforms;

    // aspect of the source cutout, plane sized to fit 2 units high
    const aspect = 1062 / 1172;
    const geo = new THREE.PlaneGeometry(2 * aspect, 2, 220, 240);
    const mat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    const pivot = new THREE.Group();
    pivot.add(mesh);
    scene.add(pivot);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // keep the garment fitting vertically
      camera.position.z = 2.15 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / 2 + 0.25;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // input
    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      // track over the whole window, normalized around the garment centre
      mouse.x = THREE.MathUtils.clamp(((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)) * 1.4, -1, 1);
      mouse.y = THREE.MathUtils.clamp(((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)) * 1.4, -1, 1);
    };
    window.addEventListener("pointermove", onMove);

    let drag: { x: number; start: number; moved: boolean } | null = null;
    let dragOffset = 0;
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, start: flipTarget.current, moved: false };
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const onDrag = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      dragOffset = (dx / el.clientWidth) * Math.PI * 1.6;
    };
    const onUp = () => {
      if (!drag) return;
      if (!drag.moved) flipTarget.current += Math.PI;
      else flipTarget.current = Math.round((drag.start + dragOffset) / Math.PI) * Math.PI;
      dragOffset = 0;
      drag = null;
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onDrag);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointercancel", onUp);

    api.current = {
      flip: (d = 1) => (flipTarget.current += Math.PI * d),
      flipTo: (s) => {
        const k = Math.round(flipTarget.current / Math.PI);
        const isBack = Math.abs(k % 2) === 1;
        if ((s === "back") !== isBack) flipTarget.current += Math.PI;
      },
    };

    let raf = 0;
    let rotY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let lastSide: "front" | "back" = "front";
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      tiltX += (mouse.y * 0.16 - tiltX) * 0.06;
      tiltY += (mouse.x * 0.3 - tiltY) * 0.06;
      const target = flipTarget.current + dragOffset;
      rotY += (target - rotY) * (drag ? 0.35 : 0.09);

      pivot.rotation.set(tiltX, rotY + tiltY, 0);
      pivot.position.y = Math.sin(t * 1.1) * 0.025;

      const side = Math.cos(rotY) < 0 ? "back" : "front";
      uniforms.uSide.value = side === "back" ? 1 : 0;
      if (side !== lastSide) {
        lastSide = side;
        onSide?.(side);
      }
      // light follows the cursor (key light "held" by the visitor)
      uniforms.uLight.value.set(0.25 + mouse.x * 0.9, 0.45 - mouse.y * 0.7, 0.85);
      mesh.updateMatrixWorld();
      uniforms.uNormalMat.value.getNormalMatrix(new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, mesh.matrixWorld));
      onTilt?.(tiltY / 0.3, tiltX / 0.16);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      Object.values(uniforms).forEach((u) => u.value instanceof THREE.Texture && u.value.dispose());
      el.removeChild(renderer.domElement);
      uniformsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depthFront, depthBack, normalFront, normalBack]);

  return <div ref={host} className="h-full w-full" aria-label="Vue produit interactive : cliquer ou glisser pour retourner" role="img" />;
});
