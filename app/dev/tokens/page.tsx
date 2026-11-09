import type { Metadata } from "next";
import { notFound } from "next/navigation";
import board from "@/assets/reference/mockup-board.jpg";

// Dev-only preview of the design tokens next to the mockup. See docs/DESIGN_TOKENS.md.

export const metadata: Metadata = { title: "Tokens · FEAT dev" };

/** Screen boxes on the mockup board (px in the 1125x2000 source image). */
const SCREENS = {
  1: { x: 8, y: 663, w: 276, h: 362, name: "Page d'accès" },
  2: { x: 291, y: 663, w: 250, h: 362, name: "Vérification email" },
  3: { x: 550, y: 663, w: 324, h: 330, name: "Accueil du drop" },
  4: { x: 882, y: 663, w: 236, h: 356, name: "Fiche produit" },
  5: { x: 8, y: 1067, w: 285, h: 300, name: "Panier" },
  6: { x: 302, y: 1067, w: 274, h: 300, name: "Paiement" },
  7: { x: 584, y: 1067, w: 272, h: 300, name: "Confirmation" },
  8: { x: 864, y: 1067, w: 254, h: 300, name: "Stock temps réel" },
} as const;

type ScreenId = keyof typeof SCREENS;

function MockupScreen({ id, scale = 1.25 }: { id: ScreenId; scale?: number }) {
  const s = SCREENS[id];
  return (
    <figure className="shrink-0">
      <div
        role="img"
        aria-label={`Maquette écran ${id} : ${s.name}`}
        className="border-line border"
        style={{
          width: s.w * scale,
          height: s.h * scale,
          backgroundImage: `url(${board.src})`,
          backgroundSize: `${board.width * scale}px ${board.height * scale}px`,
          backgroundPosition: `-${s.x * scale}px -${s.y * scale}px`,
        }}
      />
      <figcaption className="text-caption text-fg-subtle mt-2 uppercase">
        {id}. {s.name}
      </figcaption>
    </figure>
  );
}

const TYPE_SCALE: {
  token: string;
  className: string;
  px: number;
  sample: string;
  screens: ScreenId[];
}[] = [
  {
    token: "display-xl",
    className: "text-display-xl",
    px: 64,
    sample: "DROP_01",
    screens: [3],
  },
  {
    token: "display-lg",
    className: "text-display-lg",
    px: 44,
    sample: "DROP_01",
    screens: [3],
  },
  { token: "display", className: "text-display", px: 30, sample: "LS-01", screens: [4] },
  {
    token: "title",
    className: "text-title",
    px: 24,
    sample: "COMMANDE CONFIRMÉE",
    screens: [7],
  },
  {
    token: "title-sm",
    className: "text-title-sm",
    px: 20,
    sample: "COMMANDE CONFIRMÉE",
    screens: [7],
  },
  {
    token: "figure",
    className: "text-figure tabular-nums",
    px: 22,
    sample: "45,00 €   02 : 14 : 36",
    screens: [3, 4],
  },
  {
    token: "heading",
    className: "text-heading",
    px: 15,
    sample: "ACCÈS PRIVÉ",
    screens: [1, 2, 5],
  },
  {
    token: "subheading",
    className: "text-subheading",
    px: 13,
    sample: "LS-01  HD-01",
    screens: [3, 5, 8],
  },
  {
    token: "body",
    className: "text-body text-fg-body",
    px: 12,
    sample: "Entrez votre adresse email pour recevoir votre lien d'accès.",
    screens: [2, 7],
  },
  {
    token: "label",
    className: "text-label",
    px: 11,
    sample: "AJOUTER AU PANIER →",
    screens: [4, 5, 6],
  },
  {
    token: "caption",
    className: "text-caption text-fg-muted",
    px: 10,
    sample: "27 / 50 EN STOCK   FIN DANS",
    screens: [3, 4, 8],
  },
  {
    token: "micro",
    className: "text-micro text-fg-muted",
    px: 9,
    sample: "T-SHIRT MANCHES LONGUES   STYLE × PERFORMANCE",
    screens: [1, 3],
  },
];

const COLORS: { token: string; className: string; note: string }[] = [
  { token: "ink", className: "bg-ink", note: "page" },
  { token: "ink-2", className: "bg-ink-2", note: "raised" },
  { token: "ink-3", className: "bg-ink-3", note: "hover" },
  { token: "line", className: "bg-line", note: "borders" },
  { token: "line-strong", className: "bg-line-strong", note: "inputs" },
  { token: "line-emphasis", className: "bg-line-emphasis", note: "outline btn" },
  { token: "gold", className: "bg-gold", note: "accent" },
  { token: "danger", className: "bg-danger", note: "fills only" },
];

const TEXT_COLORS: { token: string; className: string; ratio: string; ok: boolean }[] = [
  { token: "fg", className: "text-fg", ratio: "20.4", ok: true },
  { token: "fg-strong", className: "text-fg-strong", ratio: "16.3", ok: true },
  { token: "fg-body", className: "text-fg-body", ratio: "12.8", ok: true },
  { token: "fg-muted", className: "text-fg-muted", ratio: "7.3", ok: true },
  { token: "fg-subtle", className: "text-fg-subtle", ratio: "6.3", ok: true },
  { token: "danger-text", className: "text-danger-text", ratio: "6.0", ok: true },
  { token: "gold", className: "text-gold", ratio: "12.5", ok: true },
  { token: "fg-disabled", className: "text-fg-disabled", ratio: "3.1", ok: false },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line border-t py-10">
      <h2 className="text-heading mb-8">{title}</h2>
      {children}
    </section>
  );
}

export default function TokensPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="px-gutter md:px-gutter-md mx-auto w-full max-w-[1400px] py-12">
      <p className="text-caption text-fg-subtle">DEV · DESIGN TOKENS</p>
      <h1 className="text-display mt-3">TOKENS</h1>
      <p className="text-body text-fg-body mt-4 max-w-xl">
        Every token in <code>app/tokens.css</code>, next to the mockup screen it comes from.
        Reference: <code>docs/DESIGN_TOKENS.md</code>.
      </p>

      <Section title="TYPE SCALE">
        <div className="flex flex-col gap-12">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.token}
              className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"
            >
              <div className="min-w-0">
                <div className="text-caption text-fg-subtle mb-3">
                  text-{t.token} · {t.px}px
                </div>
                <div className={`${t.className} break-words`}>{t.sample}</div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {t.screens.map((id) => (
                  <MockupScreen key={id} id={id} scale={0.9} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="COULEURS">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {COLORS.map((c) => (
            <div key={c.token}>
              <div className={`${c.className} border-line h-16 border`} />
              <div className="text-caption mt-2">{c.token}</div>
              <div className="text-micro text-fg-subtle">{c.note}</div>
            </div>
          ))}
        </div>

        <h3 className="text-label mt-12 mb-4">TEXTE SUR INK · CONTRASTE WCAG</h3>
        <div className="flex flex-col gap-3">
          {TEXT_COLORS.map((c) => (
            <div
              key={c.token}
              className="border-line grid grid-cols-[8rem_4rem_1fr] items-baseline gap-4 border-b pb-3"
            >
              <span className={`text-body ${c.className}`}>{c.token}</span>
              <span className="text-caption text-fg-muted tabular-nums">{c.ratio}:1</span>
              <span className={`text-caption ${c.ok ? "text-fg-muted" : "text-danger-text"}`}>
                {c.ok ? "AA OK" : "PAS POUR DU TEXTE LISIBLE"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="BORDURES, ESPACES, FORMES">
        <div className="flex flex-wrap items-end gap-6">
          <div className="border-line h-control flex items-center border px-6">line</div>
          <div className="border-line-strong h-control flex items-center border px-6">
            line-strong
          </div>
          <div className="border-line-emphasis h-control text-label flex items-center border px-6">
            line-emphasis
          </div>
          <div className="text-label h-control flex items-center bg-white px-6 text-black">
            PRIMAIRE
          </div>
          <div className="glass border-line h-control flex items-center border px-6">glass</div>
          <span className="border-line-strong size-5 rounded-full border bg-black" />
          <span className="border-line-strong size-5 rounded-full border bg-white" />
        </div>
        <p className="text-body text-fg-muted mt-6">
          Tout est carré. <code>rounded-full</code> uniquement pour les pastilles couleur et les
          boutons radio. Hauteur minimale des cibles tactiles : <code>h-control</code> (44px).
        </p>
      </Section>

      <Section title="ÉCRANS DE LA MAQUETTE">
        <div className="flex flex-wrap gap-6">
          {(Object.keys(SCREENS) as unknown as ScreenId[]).map((id) => (
            <MockupScreen key={id} id={Number(id) as ScreenId} />
          ))}
        </div>
      </Section>
    </main>
  );
}
