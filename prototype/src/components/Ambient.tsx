import { useEffect, useRef } from "react";

export type Slit = { x: number; y: number; w: number; h: number };

/** Smooth value-noise texture, generated once and tiled (no image asset). */
function makeFogTexture(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const img = g.createImageData(size, size);
  const grid = 8;
  const rnd: number[] = [];
  for (let i = 0; i < grid * grid; i++) rnd.push(Math.random());
  const at = (x: number, y: number) => rnd[((y + grid) % grid) * grid + ((x + grid) % grid)];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      let amp = 0.6;
      let freq = 1;
      for (let o = 0; o < 3; o++) {
        const gx = ((x / size) * grid * freq) % grid;
        const gy = ((y / size) * grid * freq) % grid;
        const x0 = Math.floor(gx);
        const y0 = Math.floor(gy);
        const tx = smooth(gx - x0);
        const ty = smooth(gy - y0);
        const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
        const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
        v += (a + (b - a) * ty) * amp;
        amp *= 0.5;
        freq *= 2;
      }
      const i = (y * size + x) * 4;
      const a = Math.max(0, v - 0.45) * 2.2;
      img.data[i] = 235;
      img.data[i + 1] = 214;
      img.data[i + 2] = 182;
      img.data[i + 3] = Math.min(255, a * 255);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

/**
 * Fog drift (canvas) + light-slit flicker (CSS gradient) over a still render.
 * Renders nothing animated when `still` (prefers-reduced-motion).
 */
export function Ambient({ slits, fog, still }: { slits: Slit[]; fog: number; still: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const glows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (still) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const tex = makeFogTexture();
    const pattern = ctx.createPattern(tex, "repeat")!;
    // fog is soft: render at a fraction of the CSS size and let the browser upscale
    const scale = 0.35;
    const resize = () => {
      cv.width = Math.max(1, Math.round(cv.clientWidth * scale));
      cv.height = Math.max(1, Math.round(cv.clientHeight * scale));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const { width: W, height: H } = cv;
      ctx.clearRect(0, 0, W, H);
      // two layers drifting in opposite directions, lower band denser
      for (const [speed, alpha, zoom, dir] of [
        [9, 0.22, 2.2, 1],
        [5, 0.16, 3.4, -1],
      ] as const) {
        ctx.save();
        ctx.globalAlpha = alpha * fog;
        const s = (zoom * Math.max(W, H)) / 256;
        ctx.scale(s, s * 0.55);
        ctx.translate(((t * speed * dir) / s) % 256, (Math.sin(t * 0.07) * 6) / s);
        ctx.fillStyle = pattern;
        ctx.fillRect(-512, -512, 2048, 2048);
        ctx.restore();
      }
      // keep fog mostly near the floor
      ctx.globalCompositeOperation = "destination-in";
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(0,0,0,0.15)");
      grad.addColorStop(0.55, "rgba(0,0,0,0.6)");
      grad.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      // flicker: slow breathing plus rare quick dips, like a faulty light source
      glows.current.forEach((el, i) => {
        if (!el) return;
        const n = Math.sin(t * 1.3 + i) * 0.5 + Math.sin(t * 3.7 + i * 2) * 0.25 + Math.sin(t * 17 + i) * 0.08;
        const dip = Math.sin(t * 0.9 + i * 5) > 0.985 ? 0.45 : 0;
        el.style.opacity = String(Math.max(0, 0.55 + n * 0.3 - dip));
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [still, fog]);

  if (still) return null;
  return (
    <>
      {slits.map((s, i) => (
        <div
          key={i}
          ref={(el) => (glows.current[i] = el)}
          className="pointer-events-none absolute mix-blend-screen"
          style={{
            left: `${s.x - s.w * 2}%`,
            top: `${s.y - s.h * 0.1}%`,
            width: `${s.w * 5}%`,
            height: `${s.h * 1.2}%`,
            background: "radial-gradient(ellipse at center, rgba(255,214,160,0.55) 0%, rgba(255,190,120,0.18) 35%, transparent 70%)",
          }}
        />
      ))}
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />
    </>
  );
}
