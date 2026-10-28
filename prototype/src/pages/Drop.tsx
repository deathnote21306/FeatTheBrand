import { Link } from "react-router-dom";
import { Stage } from "../components/Stage";
import { Header } from "../components/ui";
import { PRODUCTS, eur } from "../data";
import { useCountdown, useIsMobile } from "../hooks";

// bg-06: doorway, slit at ~x 51.5% of the render
const SLITS = [{ x: 51.5, y: 16, w: 2.5, h: 52 }];

export function Drop() {
  const [h, m, s] = useCountdown();
  const mobile = useIsMobile();
  return (
    <div className="relative min-h-full">
      <Stage src="/bg/bg-06.jpg" w={1080} h={608} fx={mobile ? 0.45 : 0.12} fy={0.3} zoom={mobile ? 1 : 1.3} slits={SLITS} fog={1} className="fixed inset-0" />
      <div className="pointer-events-none fixed inset-y-0 left-0 w-[55%] bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header nav />

        <section className="mx-auto w-full max-w-[1280px] px-6 pt-[7vh] md:px-10 md:pt-[8vh]">
          <h1 className="fade-up text-[44px] font-bold leading-none tracking-[0.04em] md:text-[64px]">DROP_01</h1>
          <p className="fade-up mt-4 text-[12px] font-medium tracking-feat text-white/85 md:text-[14px]" style={{ animationDelay: ".1s" }}>
            PRIVATE ACCESS
          </p>
          <p className="fade-up mt-8 text-[10px] font-medium leading-[1.9] tracking-feat-sm text-white/75" style={{ animationDelay: ".2s" }}>
            PIÈCES LIMITÉES.
            <br />
            PREMIER ARRIVÉ.
            <br />
            PREMIER SERVI.
          </p>
          <div className="fade-up mt-9 inline-block border border-white/25 bg-black/40 px-5 py-3 backdrop-blur-sm" style={{ animationDelay: ".3s" }}>
            <div className="text-[8px] tracking-feat-sm text-white/55">FIN DANS</div>
            <div className="mt-1 text-[22px] font-medium tabular-nums tracking-[0.12em]" aria-live="off">
              {h} : {m} : {s}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-auto grid w-full max-w-[1180px] grid-cols-2 gap-3 px-6 pb-10 md:grid-cols-4 md:gap-4 md:px-10">
          {PRODUCTS.map((p, i) => {
            const card = (
              <article
                className="fade-up group flex h-full flex-col border border-white/12 bg-ink-2/80 backdrop-blur-sm transition hover:border-white/40"
                style={{ animationDelay: `${0.35 + i * 0.07}s` }}
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,#2a2a2e_0%,#0d0d0f_70%)]">
                  {p.viewer ? (
                    <img src={p.card} alt={p.name} className="absolute inset-[10%] h-[80%] w-[80%] object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.6)] transition duration-700 group-hover:scale-[1.04]" />
                  ) : (
                    <img src={p.card} alt={p.name} className="h-full w-full object-cover opacity-90 blur-[0.4px] transition duration-700 group-hover:scale-[1.04]" />
                  )}
                  {!p.viewer && <span className="absolute right-2 top-2 border border-white/20 bg-black/50 px-1.5 py-0.5 text-[7px] tracking-wider text-white/50">VISUEL MAQUETTE</span>}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3.5 md:p-4">
                  <h2 className="text-[13px] font-semibold tracking-[0.06em]">{p.ref}</h2>
                  <p className="text-[8px] uppercase tracking-feat-sm text-white/55">{p.name}</p>
                  <p className="mt-1 text-[12px]">{eur(p.price, false)}</p>
                  {p.cap && (
                    <div className="mt-2 h-[2px] w-full bg-white/10">
                      <div className={`h-full ${p.cap.left / p.cap.total <= 0.15 ? "bg-danger" : "bg-white/80"}`} style={{ width: `${(p.cap.left / p.cap.total) * 100}%` }} />
                    </div>
                  )}
                </div>
              </article>
            );
            return p.viewer ? (
              <Link key={p.id} to={`/produit/${p.slug}`} className="block">
                {card}
              </Link>
            ) : (
              <div key={p.id} title="Fiche non prototypée">
                {card}
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
