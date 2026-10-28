import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PAGES = [
  ["/", "1 · Accès"],
  ["/drop", "3 · Drop"],
  ["/produit/ls-01", "4 · Produit (relief photo)"],
  ["/produit/ls-01?viewer=glb", "4b · Produit (modèle IA)"],
  ["/comparer", "Comparer les 2 viewers"],
  ["/confirmation", "7 · Confirmation"],
] as const;

/** Prototype-only navigator, not part of the design. */
export function ProtoNav() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  return (
    <div className="fixed right-0 top-[38%] z-50 flex flex-col items-end font-sans text-[10px]">
      {open && (
        <div className="absolute right-full top-0 mr-1 flex w-max flex-col border border-amber-300/40 bg-black/90 p-1">
          {PAGES.map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className={`px-3 py-1.5 tracking-wider hover:bg-white/10 ${loc.pathname + loc.search === to ? "text-amber-200" : "text-white/80"}`}>
              {label}
            </Link>
          ))}
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} className="border border-r-0 border-amber-300/40 bg-black/80 px-1 py-2.5 tracking-[0.2em] text-amber-200/90 [writing-mode:vertical-rl]">
        PROTO {open ? "×" : "≡"}
      </button>
    </div>
  );
}
