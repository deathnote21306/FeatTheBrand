import { useNavigate } from "react-router-dom";
import { Stage } from "../components/Stage";
import { Arrow, Header } from "../components/ui";
import { useCart } from "../cart";
import { COLOR_LABEL, eur } from "../data";

// bg-05: FEAT cube, slit right of the cube at ~x 72%
const SLITS = [{ x: 70.7, y: 0, w: 1.9, h: 26 }];

export function Confirmation() {
  const nav = useNavigate();
  const { lines, clear } = useCart();
  const order = lines.length ? lines : [{ ref: "LS-01", name: "T-shirt manches longues", color: "black" as const, size: "M", qty: 1, price: 45 }];
  const total = order.reduce((n, l) => n + l.qty * l.price, 0);

  return (
    <Stage src="/bg/bg-05.jpg" w={1080} h={608} fx={0.45} fy={0.35} slits={SLITS} fog={1.2}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/90" />
      <div className="relative z-10 flex h-full flex-col">
        <Header />
        <main className="mt-auto flex flex-col items-center px-6 pb-[9vh] text-center">
          <div className="fade-up mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/80">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h1 className="fade-up text-[20px] font-bold tracking-[0.08em] md:text-[24px]" style={{ animationDelay: ".1s" }}>
            COMMANDE CONFIRMÉE
          </h1>
          <p className="fade-up mt-4 max-w-[340px] text-[12px] leading-relaxed text-white/85" style={{ animationDelay: ".2s" }}>
            Merci pour votre confiance.
            <br />
            Vous recevrez un email avec les détails de votre commande.
          </p>
          <div className="fade-up mt-6 w-full max-w-[340px] border-y border-white/12 py-3 text-left text-[10px] text-white/70" style={{ animationDelay: ".3s" }}>
            {order.map((l, i) => (
              <div key={i} className="flex justify-between py-0.5">
                <span>
                  {l.ref} · {COLOR_LABEL[l.color]} · {l.size} · ×{l.qty}
                </span>
                <span>{eur(l.price * l.qty)}</span>
              </div>
            ))}
            <div className="mt-1.5 flex justify-between text-white">
              <span className="tracking-wider">PAYÉE</span>
              <span>{eur(total)}</span>
            </div>
          </div>
          <button
            onClick={() => (clear(), nav("/drop"))}
            className="fade-up mt-7 flex items-center gap-3 border border-white/60 bg-black/40 px-8 py-3.5 text-[11px] font-semibold tracking-feat-sm transition hover:bg-white hover:text-black"
            style={{ animationDelay: ".4s" }}
          >
            RETOURNER AU DROP <Arrow />
          </button>
        </main>
      </div>
    </Stage>
  );
}
