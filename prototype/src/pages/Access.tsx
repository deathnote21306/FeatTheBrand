import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stage } from "../components/Stage";
import { Arrow, MailIcon, Wordmark } from "../components/ui";

// bg-01: corridor, slits measured at x 77% and 96% of the render
const SLITS = [
  { x: 77.2, y: 15, w: 2.2, h: 50 },
  { x: 96.2, y: 3, w: 2.4, h: 45 },
];

export function Access() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"code" | "email" | "sent">("code");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) return setErr("Code invalide.");
    nav("/drop");
  };
  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Adresse email invalide.");
    setMode("sent");
  };

  return (
    <Stage src="/bg/bg-01.jpg" w={1080} h={720} fx={0.82} slits={SLITS} fog={1.1} dim={0.12}>
      <div className="relative z-10 flex min-h-full flex-col px-6 py-6 md:px-12 md:py-8">
        <header className="flex items-center justify-between">
          <Wordmark />
          <span className="text-[9px] font-medium tracking-feat text-white/70">PRIVATE ACCESS</span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center pb-10">
          {mode === "code" && (
            <>
              <h1 className="fade-up mb-14 text-center text-[13px] font-medium leading-[2.1] tracking-feat text-white/90 md:text-[15px]">
                STEP BY STEP.
                <br />
                FEAT BY FEAT.
              </h1>
              <form onSubmit={submitCode} className="fade-up flex w-full max-w-[380px] border border-white/45 bg-black/35 backdrop-blur-sm" style={{ animationDelay: ".15s" }}>
                <input
                  value={code}
                  onChange={(e) => (setCode(e.target.value.toUpperCase()), setErr(""))}
                  placeholder="CODE D'ACCÈS"
                  aria-label="Code d'accès"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[11px] tracking-feat-sm outline-none"
                  autoComplete="off"
                />
                <button aria-label="Valider" className="flex w-14 items-center justify-center border-l border-white/45 transition hover:bg-white hover:text-black">
                  <Arrow />
                </button>
              </form>
              <p className="mt-2 h-4 text-[10px] text-danger">{err}</p>
              <span className="my-3 text-[10px] text-white/55">ou</span>
              <button
                onClick={() => (setMode("email"), setErr(""))}
                className="fade-up flex w-full max-w-[300px] items-center justify-between border border-white/45 bg-black/35 px-4 py-3 text-[11px] text-white/90 backdrop-blur-sm transition hover:border-white"
                style={{ animationDelay: ".3s" }}
              >
                <span className="flex items-center gap-3">
                  <MailIcon /> Accéder avec votre email
                </span>
                <Arrow />
              </button>
              <p className="mt-6 text-[9px] tracking-wider text-white/35">Démo : n'importe quel code de 4 caractères</p>
            </>
          )}

          {mode === "email" && (
            <div className="fade-up flex w-full max-w-[380px] flex-col items-center">
              <h1 className="mb-5 text-[15px] font-semibold tracking-feat">ACCÈS PRIVÉ</h1>
              <p className="mb-8 max-w-[300px] text-center text-[12px] leading-relaxed text-white/80">Entrez votre adresse email pour recevoir votre lien d'accès.</p>
              <form onSubmit={submitEmail} className="flex w-full border border-white/45 bg-black/35 backdrop-blur-sm">
                <span className="flex items-center pl-4 text-white/70">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => (setEmail(e.target.value), setErr(""))}
                  placeholder="Votre adresse email"
                  aria-label="Adresse email"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-[11px] outline-none"
                />
                <button aria-label="Recevoir le lien" className="flex w-14 items-center justify-center border-l border-white/45 transition hover:bg-white hover:text-black">
                  <Arrow />
                </button>
              </form>
              <p className="mt-2 h-4 text-[10px] text-danger">{err}</p>
              <label className="flex items-center gap-2.5 self-start text-[10px] text-white/75">
                <input type="checkbox" className="h-3 w-3 appearance-none border border-white/60 checked:bg-white" /> Me tenir informé des prochains drops.
              </label>
              <button onClick={() => setMode("code")} className="mt-8 text-[10px] tracking-feat-sm text-white/50 hover:text-white">
                RETOUR AU CODE
              </button>
            </div>
          )}

          {mode === "sent" && (
            <div className="fade-up flex max-w-[340px] flex-col items-center text-center">
              <h1 className="mb-5 text-[15px] font-semibold tracking-feat">LIEN ENVOYÉ</h1>
              <p className="text-[12px] leading-relaxed text-white/80">
                Si {email} est inscrit, un lien d'accès vient d'être envoyé. Pensez à vérifier vos spams.
              </p>
              <button onClick={() => nav("/drop")} className="mt-8 text-[10px] tracking-feat-sm text-white/60 hover:text-white">
                (DÉMO) OUVRIR LE DROP →
              </button>
            </div>
          )}
        </main>

        <footer className="flex justify-between text-[8px] font-medium tracking-feat text-white/55">
          <span>STYLE × PERFORMANCE</span>
          <span>PARIS · LIBREVILLE</span>
        </footer>
      </div>
    </Stage>
  );
}
