import { useRef, useState } from "react";

/** Mobile: no motion, no WebGL. Swipe (scroll-snap) between front, back, detail. */
export function MobileGallery({ front, back }: { front: string; back: string }) {
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const slides = [
    { key: "Face", el: <img src={front} alt="Vue de face" className="h-full w-full object-contain [filter:drop-shadow(0_0_14px_rgba(255,200,140,0.16))]" draggable={false} /> },
    { key: "Dos", el: <img src={back} alt="Vue de dos" className="h-full w-full object-contain [filter:drop-shadow(0_0_14px_rgba(255,200,140,0.16))]" draggable={false} /> },
    {
      key: "Détail",
      el: (
        <div
          role="img"
          aria-label="Détail du col"
          className="h-full w-full border border-white/10"
          style={{ backgroundImage: `url(${front})`, backgroundSize: "260%", backgroundPosition: "50% 4%", backgroundRepeat: "no-repeat" }}
        />
      ),
    },
  ];
  return (
    <div className="relative h-full w-full">
      <div
        ref={track}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
        onScroll={(e) => {
          const t = e.currentTarget;
          setI(Math.round(t.scrollLeft / t.clientWidth));
        }}
      >
        {slides.map((s) => (
          <div key={s.key} className="h-full w-full shrink-0 snap-center px-[22%] py-1">
            {s.el}
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 -bottom-[18%] flex justify-center gap-4">
        {slides.map((s, k) => (
          <button
            key={s.key}
            onClick={() => track.current?.scrollTo({ left: k * track.current.clientWidth, behavior: "smooth" })}
            className={`text-[9px] tracking-feat-sm ${k === i ? "text-white" : "text-white/40"}`}
          >
            {s.key.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
