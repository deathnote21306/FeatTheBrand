import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../cart";

/** PLACEHOLDER wordmark: typed text, NOT the real FEAT logo (logo SVG not received yet). */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link to="/drop" className={`group relative inline-flex items-end gap-1.5 ${className}`} title="Logo provisoire (texte), à remplacer par le SVG officiel FEAT">
      <span className="font-display text-[22px] font-bold italic leading-none tracking-[0.02em]">FEAT</span>
      <span className="mb-[1px] border border-white/25 px-1 text-[7px] font-medium leading-[10px] tracking-[0.15em] text-white/45">LOGO TEMP</span>
    </Link>
  );
}

export const Arrow = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

export const MailIcon = () => (
  <svg viewBox="0 0 20 16" className="h-3.5 w-4" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="1" y="1" width="18" height="14" rx="1" />
    <path d="m1.5 2 8.5 7 8.5-7" />
  </svg>
);

export const BagIcon = () => (
  <svg viewBox="0 0 18 20" className="h-[18px] w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M2 6h14l-1 13H3L2 6Z" />
    <path d="M6 8V4a3 3 0 0 1 6 0v4" />
  </svg>
);

export function Header({ nav = false }: { nav?: boolean }) {
  const { count } = useCart();
  return (
    <header className="relative z-20 flex items-center justify-between px-5 pt-5 md:px-10 md:pt-7">
      <Wordmark />
      {nav && (
        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-10 text-[10px] font-medium tracking-feat-sm text-white/60 md:flex">
          <NavLink to="/drop" className="relative pb-2 text-white">
            DROP_01
            <span className="absolute bottom-0 left-1/2 h-px w-5 -translate-x-1/2 bg-white" />
          </NavLink>
          <span className="cursor-not-allowed pb-2 text-white/35">02</span>
          <span className="cursor-not-allowed pb-2 text-white/35">03</span>
        </nav>
      )}
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2 text-[11px] font-medium text-white/85" aria-label={`Panier: ${count}`}>
          <BagIcon /> ({count})
        </span>
        {nav && (
          <span className="flex w-5 flex-col gap-[5px]" aria-hidden>
            <i className="h-px bg-white/80" />
            <i className="h-px bg-white/80" />
            <i className="h-px bg-white/80" />
          </span>
        )}
      </div>
    </header>
  );
}

export function OutlineButton({ children, onClick, className = "", type = "button" }: { children: ReactNode; onClick?: () => void; className?: string; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-3 border border-white/60 bg-black/40 px-6 py-3.5 text-[11px] font-semibold tracking-feat-sm text-white transition hover:border-white hover:bg-white hover:text-black ${className}`}
    >
      {children}
    </button>
  );
}

export function SolidButton({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-3 bg-white px-6 py-3.5 text-[11px] font-semibold tracking-feat-sm text-black transition hover:bg-white/85 ${className}`}>
      {children}
    </button>
  );
}

export function StockBar({ left, total }: { left: number; total: number }) {
  const ratio = left / total;
  const low = ratio <= 0.15;
  return (
    <div>
      <div className="mb-2 text-[10px] text-white/70">
        {left} / {total} en stock
      </div>
      <div className="h-[3px] w-full bg-white/10">
        <div className={`h-full ${low ? "bg-danger" : "bg-white"}`} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
