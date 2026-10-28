import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Stage } from "../components/Stage";
import { Arrow, Header, OutlineButton, StockBar } from "../components/ui";
import { DepthViewer, DepthViewerHandle } from "../viewer/DepthViewer";
import { GlbViewer } from "../viewer/GlbViewer";
import { MobileGallery } from "../viewer/MobileGallery";
import { COLOR_LABEL, Colorway, PRODUCTS, eur } from "../data";
import { useCountdown, useIsMobile, useReducedMotion } from "../hooks";
import { useCart } from "../cart";
import { MODELS } from "../models";

// bg-07: glowing podium; slit at ~x 57%
const SLITS = [{ x: 56.9, y: 0, w: 3.5, h: 58 }];

export function Product() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const p = PRODUCTS.find((x) => x.slug === slug) ?? PRODUCTS[0];
  const mobile = useIsMobile();
  const still = useReducedMotion();
  const mode = params.get("viewer") === "glb" ? "glb" : "photo";
  const modelId = params.get("model") ?? MODELS[0]?.id;
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

  const [color, setColor] = useState<Colorway>("black");
  const [size, setSize] = useState<string | null>(null);
  const [side, setSide] = useState<"front" | "back">("front");
  const [zoom, setZoom] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const viewer = useRef<DepthViewerHandle>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const nav = useNavigate();
  const [h, m, s] = useCountdown();

  const imgs = p.viewer!.images[color];
  const depth = p.viewer!.depth;

  const onTilt = (x: number) => {
    if (shadow.current) shadow.current.style.transform = `translateX(${-x * 14}%) scaleX(${1 - Math.abs(x) * 0.12})`;
  };

  const addToCart = () => {
    if (!size) return setNeedSize(true);
    add({ ref: p.ref, name: p.name, color, size, qty: 1, price: p.price });
    setAdded(true);
  };

  const setMode = (m: "photo" | "glb") => {
    const next = new URLSearchParams(params);
    if (m === "glb") next.set("viewer", "glb");
    else next.delete("viewer");
    setParams(next, { replace: true });
  };

  // ---------- viewer (desktop) ----------
  const thumbs = [
    { key: "front", label: "Face", src: imgs.front, pos: "50% 50%", size: "contain" },
    { key: "back", label: "Dos", src: imgs.back, pos: "50% 50%", size: "contain" },
    { key: "collar", label: "Col", src: imgs.front, pos: "50% 3%", size: "300%" },
    { key: "cuff", label: "Poignet", src: imgs.front, pos: "6% 96%", size: "320%" },
  ];

  const desktopViewer =
    mode === "glb" && model ? (
      <GlbViewer src={model.src} project={model.project} autoRotate={!still} />
    ) : still ? (
      <img src={side === "front" ? imgs.front : imgs.back} alt={p.name} className="h-full w-full object-contain" />
    ) : (
      <DepthViewer
        ref={viewer}
        front={imgs.front}
        back={imgs.back}
        depthFront={depth.front}
        depthBack={depth.back}
        normalFront={p.viewer!.normal.front}
        normalBack={p.viewer!.normal.back}
        light={color === "black" ? "dark" : "light"}
        onSide={setSide}
        onTilt={onTilt}
      />
    );

  const info = (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[30px] font-bold leading-none tracking-[0.04em]">{p.ref}</h1>
          <p className="mt-2 text-[9px] uppercase tracking-feat-sm text-white/65">{p.name}</p>
          <p className="mt-5 text-[22px] font-medium">{eur(p.price)}</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div>
            <div className="mb-2 text-[9px] text-white/60">Couleur</div>
            <div className="flex gap-3">
              {p.colors.map((c) => (
                <button
                  key={c}
                  aria-label={COLOR_LABEL[c]}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full border transition ${c === "black" ? "bg-black" : "bg-[#e9e9e9]"} ${color === c ? "border-white ring-1 ring-white/70 ring-offset-2 ring-offset-black" : "border-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className={`mb-2 text-[9px] ${needSize ? "text-danger" : "text-white/60"}`}>{needSize ? "Choisissez une taille" : "Taille"}</div>
        <div className="flex gap-2.5">
          {p.sizes.map((sz) => (
            <button
              key={sz}
              onClick={() => (setSize(sz), setNeedSize(false))}
              aria-pressed={size === sz}
              className={`h-10 w-12 border text-[11px] font-medium transition ${size === sz ? "border-white bg-white text-black" : "border-white/35 hover:border-white"}`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {p.cap && <StockBar left={p.cap.left} total={p.cap.total} />}

      {added ? (
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-white/70">
            Ajouté au panier : {p.ref} · {COLOR_LABEL[color]} · {size}
          </div>
          <button onClick={() => nav("/confirmation")} className="flex items-center justify-center gap-3 bg-white py-3.5 text-[11px] font-semibold tracking-feat-sm text-black transition hover:bg-white/85">
            PROCÉDER AU PAIEMENT (DÉMO) <Arrow />
          </button>
        </div>
      ) : (
        <OutlineButton onClick={addToCart} className="w-full">
          AJOUTER AU PANIER <Arrow />
        </OutlineButton>
      )}

      <div className="border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/55">
        Coton épais, coupe droite, bord-côte aux poignets (texte démo).
        <br />
        Fermeture du drop dans {h}:{m}:{s} · Livraison estimée 4 à 6 semaines après fermeture.
      </div>
    </div>
  );

  const modeToggle = (
    <div className="flex items-center gap-0 border border-amber-300/40 bg-black/70 text-[9px] tracking-feat-sm backdrop-blur-sm">
      <span className="px-2 text-amber-200/80">PROTO</span>
      {(["photo", "glb"] as const).map((m) => (
        <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 ${mode === m ? "bg-white text-black" : "text-white/70 hover:text-white"}`}>
          {m === "photo" ? "RELIEF PHOTO" : "MODÈLE IA"}
        </button>
      ))}
    </div>
  );

  // ---------- mobile ----------
  if (mobile) {
    return (
      <div className="min-h-full bg-ink">
        <div className="relative h-[60vh] min-h-[420px]">
          <Stage src="/bg/bg-07.jpg" w={1080} h={608} fx={0.5} fy={0.6} slits={SLITS} fog={0.8} className="absolute inset-0">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
          </Stage>
          <div className="absolute inset-x-0 top-0 z-10">
            <Header />
          </div>
          <div className="absolute inset-x-0 bottom-[25%] top-[17%] z-10">
            {mode === "glb" && model ? <GlbViewer src={model.src} project={model.project} autoRotate={false} /> : <MobileGallery front={imgs.front} back={imgs.back} />}
          </div>
        </div>
        <div className="px-5 pb-16 pt-2">
          <div className="mb-6 flex justify-center">{modeToggle}</div>
          {info}
        </div>
      </div>
    );
  }

  // ---------- desktop ----------
  return (
    <Stage
      src="/bg/bg-07.jpg"
      w={1080}
      h={608}
      fx={0.5}
      fy={0.62}
      slits={SLITS}
      fog={1}
      anchored={
        <>
          {/* contact shadow on the podium, slides opposite to the tilt */}
          <div className="pointer-events-none absolute" style={{ left: "32%", top: "59%", width: "20%", height: "5.5%" }}>
            <div ref={shadow} className="h-full w-full rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.4)_45%,transparent_72%)] blur-[2px] transition-transform duration-100" />
          </div>
          <div className="absolute" style={{ left: "25%", top: "14.5%", width: "34%", height: "46%" }}>
            {desktopViewer}
          </div>
        {/* arrows flip front/back */}
        {mode === "photo" && (
          <>
            <button aria-label="Vue précédente" onClick={() => (still ? setSide(side === "front" ? "back" : "front") : viewer.current?.flip(-1))} className="absolute p-3 text-white/70 transition hover:text-white" style={{ left: "21%", top: "32%" }}>
              <Arrow className="h-6 w-6 rotate-180" />
            </button>
            <button aria-label="Vue suivante" onClick={() => (still ? setSide(side === "front" ? "back" : "front") : viewer.current?.flip(1))} className="absolute p-3 text-white/70 transition hover:text-white" style={{ left: "60%", top: "32%" }}>
              <Arrow className="h-6 w-6" />
            </button>
          </>
        )}

        </>
      }
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[46%] bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
        <div className="pointer-events-auto">
          <Header nav />
        </div>

        {/* thumbnails */}
        <div className="pointer-events-auto absolute left-8 top-1/2 flex -translate-y-1/2 flex-col gap-3 lg:left-12">
          {thumbs.map((t) => {
            const active = mode === "photo" && (t.key === side || t.key === zoom);
            return (
              <button
                key={t.key}
                aria-label={t.label}
                onClick={() => {
                  if (mode !== "photo") setMode("photo");
                  if (t.key === "front" || t.key === "back") {
                    setZoom(null);
                    if (still) setSide(t.key);
                    else viewer.current?.flipTo(t.key);
                  } else setZoom(t.key);
                }}
                className={`h-[68px] w-[60px] border bg-black/50 backdrop-blur-sm transition ${active ? "border-white/90" : "border-white/25 hover:border-white/60"}`}
                style={{ backgroundImage: `url(${t.src})`, backgroundSize: t.size, backgroundPosition: t.pos, backgroundRepeat: "no-repeat" }}
              />
            );
          })}
        </div>

        <div className="pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[9px] tracking-feat-sm text-white/45">
            {mode === "photo" ? (still ? "MOUVEMENT RÉDUIT · UTILISEZ LES VIGNETTES" : "BOUGEZ LA SOURIS · CLIQUEZ OU GLISSEZ POUR RETOURNER") : "GLISSEZ POUR TOURNER · MOLETTE POUR ZOOMER"}
          </span>
          {modeToggle}
        </div>

        {/* info panel */}
        <aside className="pointer-events-auto absolute right-8 top-1/2 w-[360px] -translate-y-1/2 border border-white/12 bg-black/55 p-7 backdrop-blur-md lg:right-12">
          {info}
        </aside>
      </div>

      {/* detail zoom overlay */}
      {zoom && (
        <button onClick={() => setZoom(null)} className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm" aria-label="Fermer le détail">
          <div
            className="h-[70vh] w-[56vh] border border-white/20"
            style={{
              backgroundImage: `url(${imgs.front})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: zoom === "collar" ? "260%" : "300%",
              backgroundPosition: zoom === "collar" ? "50% 2%" : "4% 97%",
            }}
          />
          <span className="absolute bottom-8 text-[9px] tracking-feat-sm text-white/50">DÉTAIL · CLIQUER POUR FERMER</span>
        </button>
      )}
    </Stage>
  );
}
