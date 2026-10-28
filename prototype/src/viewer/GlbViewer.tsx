import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Planar projection of the front/back product photos onto an untextured mesh:
 * faces looking forward sample the front photo, faces looking back sample the
 * mirrored back photo, blended on the sides. Cheap stand-in for a real texture.
 */
function projectedMaterial(box: THREE.Box3, front: string, back: string, fallback: string) {
  const loader = new THREE.TextureLoader();
  const tf = loader.load(front);
  const tb = loader.load(back);
  tf.colorSpace = tb.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, metalness: 0 });
  const size = box.getSize(new THREE.Vector3());
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uFront = { value: tf };
    sh.uniforms.uBack = { value: tb };
    sh.uniforms.uMin = { value: box.min.clone() };
    sh.uniforms.uSize = { value: size };
    sh.uniforms.uFallback = { value: new THREE.Color(fallback) };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObjPos;\nvarying vec3 vObjN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjPos = position;\nvObjN = normal;");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vObjPos;\nvarying vec3 vObjN;\nuniform sampler2D uFront;\nuniform sampler2D uBack;\nuniform vec3 uMin;\nuniform vec3 uSize;\nuniform vec3 uFallback;",
      )
      .replace(
        "#include <map_fragment>",
        `
        vec2 puv = (vObjPos.xy - uMin.xy) / uSize.xy;
        // photos have ~2.3% transparent padding around the garment
        puv = puv * 0.954 + 0.023;
        vec4 cf = texture2D(uFront, puv);
        vec4 cb = texture2D(uBack, vec2(1.0 - puv.x, puv.y));
        float w = smoothstep(-0.25, 0.25, normalize(vObjN).z);
        vec4 c = mix(cb, cf, w);
        vec3 col = mix(uFallback, c.rgb, c.a);
        diffuseColor.rgb *= col;
        `,
      );
  };
  return mat;
}

type Props = {
  src: string;
  project?: { front: string; back: string };
  /** tint used when the model has no texture (Hunyuan shape-only output) */
  fallbackColor?: string;
  autoRotate?: boolean;
  onStats?: (s: { tris: number; kb: number; ms: number }) => void;
};

/** Real 3D: a GLB from an image-to-3D model, orbitable, lit to match the podium render. */
export function GlbViewer({ src, project, fallbackColor = "#141414", autoRotate = true, onStats }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.05, 50);
    camera.position.set(0, 0.05, 4.4);

    // lighting tuned to the bg-07 render: warm slit behind/right, faint cool fill
    scene.add(new THREE.HemisphereLight(0x9aa4b0, 0x0a0806, 0.5));
    const key = new THREE.DirectionalLight(0xffd2a0, 2.4);
    key.position.set(1.6, 1.8, 1.4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc68a, 3.2);
    rim.position.set(0.6, 1.2, -2.5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x8899aa, 0.5);
    fill.position.set(-2, 0.4, 1.5);
    scene.add(fill);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 6;
    controls.minPolarAngle = Math.PI * 0.32;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;

    const t0 = performance.now();
    let disposed = false;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.arrayBuffer();
      })
      .then((buf) => {
        new GLTFLoader().parse(buf, "", (gltf) => {
          if (disposed) return;
          const root = gltf.scene;
          let tris = 0;
          root.traverse((o) => {
            const m = o as THREE.Mesh;
            if (!m.isMesh) return;
            tris += (m.geometry.index?.count ?? m.geometry.attributes.position.count) / 3;
            const old = m.material as THREE.MeshStandardMaterial;
            if (project) {
              m.geometry.computeVertexNormals();
              m.geometry.computeBoundingBox();
              m.material = projectedMaterial(m.geometry.boundingBox!, project.front, project.back, fallbackColor);
            } else if (!old.map) {
              m.material = new THREE.MeshStandardMaterial({ color: fallbackColor, roughness: 0.82, metalness: 0.0 });
              m.geometry.computeVertexNormals();
            } else {
              old.roughness = Math.max(old.roughness ?? 0.8, 0.75);
              old.metalness = 0;
            }
          });
          // normalize: 2 units high, centered
          const box = new THREE.Box3().setFromObject(root);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const s = 2 / size.y;
          root.scale.setScalar(s);
          root.position.copy(center.multiplyScalar(-s));
          const pivot = new THREE.Group();
          pivot.add(root);
          scene.add(pivot);
          setState("ready");
          onStats?.({ tris: Math.round(tris), kb: Math.round(buf.byteLength / 1024), ms: Math.round(performance.now() - t0) });
        }, () => setState("error"));
      })
      .catch(() => setState("error"));

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight, false);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    const loop = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, project?.front, project?.back, fallbackColor, autoRotate]);

  return (
    <div className="relative h-full w-full">
      <div ref={host} className="h-full w-full" />
      {state !== "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] tracking-feat-sm text-white/60">
          {state === "loading" ? "CHARGEMENT DU MODÈLE…" : "MODÈLE INDISPONIBLE"}
        </div>
      )}
    </div>
  );
}
