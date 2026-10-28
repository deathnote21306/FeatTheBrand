import { useState } from "react";
import { Header } from "../components/ui";
import { DepthViewer } from "../viewer/DepthViewer";
import { GlbViewer } from "../viewer/GlbViewer";
import { PRODUCTS } from "../data";
import { MODELS } from "../models";

/** Side by side on the same podium render: fake 3D (photo + depth) vs AI GLB. */
export function Compare() {
  const p = PRODUCTS[0].viewer!;
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [stats, setStats] = useState<{ tris: number; kb: number; ms: number } | null>(null);
  const model = MODELS.find((m) => m.id === modelId)!;

  const pane = (title: string, sub: string, el: React.ReactNode, extra?: React.ReactNode) => (
    <section className="relative flex min-h-[70vh] flex-col overflow-hidden border border-white/12">
      <img src="/bg/bg-07.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 62%" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
      <div className="relative z-10 flex items-start justify-between p-4">
        <div>
          <h2 className="text-[12px] font-semibold tracking-feat-sm">{title}</h2>
          <p className="mt-1 max-w-[320px] text-[10px] leading-relaxed text-white/60">{sub}</p>
        </div>
        {extra}
      </div>
      <div className="relative z-10 mx-auto mt-auto mb-[13%] h-[44vh] w-[min(100%,40vh)]">{el}</div>
    </section>
  );

  return (
    <div className="min-h-full bg-ink">
      <Header />
      <main className="grid gap-4 p-5 md:grid-cols-2 md:p-10">
        {pane(
          "A · RELIEF PHOTO",
          "Photo détourée + carte de profondeur (Depth Anything V2), inclinaison souris, lumière dynamique, retournement face/dos. ~2,4 Mo d'images.",
          <DepthViewer front={p.images.black.front} back={p.images.black.back} depthFront={p.depth.front} depthBack={p.depth.back} normalFront={p.normal.front} normalBack={p.normal.back} />,
        )}
        {pane(
          "B · MODÈLE IA (GLB)",
          `Hunyuan3D-2 depuis la photo de face. ${stats ? `${stats.tris.toLocaleString("fr-FR")} triangles · ${stats.kb} Ko · chargé en ${stats.ms} ms.` : ""}`,
          <GlbViewer key={model.id} src={model.src} project={model.project} onStats={setStats} />,
          <select value={modelId} onChange={(e) => setModelId(e.target.value)} className="border border-white/25 bg-black/70 px-2 py-1 text-[10px]" aria-label="Variante du modèle">
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>,
        )}
      </main>
    </div>
  );
}
