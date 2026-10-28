import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Ambient, Slit } from "./Ambient";
import { useReducedMotion } from "../hooks";

type Props = {
  src: string;
  /** natural size of the background image */
  w: number;
  h: number;
  /** focal point used when cropping to cover, 0..1 */
  fx?: number;
  fy?: number;
  /** light slits for the flicker, in % of the image */
  slits?: Slit[];
  fog?: number;
  dim?: number;
  /** content positioned in image-% coordinates (moves with the crop) */
  anchored?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** extra zoom on top of cover, to re-frame the render */
  zoom?: number;
};

/**
 * Full-bleed background that behaves like object-fit: cover, but exposes the
 * covered box so overlays (glow, garment, podium shadow) stay pinned to the
 * same spot of the render at every viewport size.
 */
export function Stage({ src, w, h, fx = 0.5, fy = 0.5, slits = [], fog = 1, dim = 0, anchored, children, className = "fixed inset-0", zoom = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const still = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current!;
    const update = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const s = Math.max(W / w, H / h) * zoom;
      const bw = w * s;
      const bh = h * s;
      setBox({ left: (W - bw) * fx, top: (H - bh) * fy, width: bw, height: bh });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, fx, fy, zoom]);

  return (
    <div ref={ref} className={`grain overflow-clip bg-ink ${className}`}>
      <div className="absolute" style={box}>
        <div className={`absolute inset-0 ${still ? "" : "kenburns"}`} style={{ transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
          <img src={src} alt="" className="absolute inset-0 h-full w-full select-none" draggable={false} />
          <Ambient slits={slits} fog={fog} still={still} />
        </div>
        {anchored}
      </div>
      {dim > 0 && <div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
      {children}
    </div>
  );
}
