# FEAT V2 visual prototype: notes

Throwaway prototype. The goal is to check how closely we can match the mockup board and to test the product "3D" before the real build. This is not production code, and it doesn't include Supabase, Stripe or real auth.

## Run it

```bash
cd prototype && npm install && npm run dev
```

Open http://localhost:5174. The `feat-prototype` entry in `/.claude/launch.json` starts the same server from the repo root. A small amber **PROTO** tab on the right edge of every page jumps between screens. It's a prototype tool, not part of the design.

| Route | Mockup screen |
|---|---|
| `/` | 1. Page d'accès (code + email link; the email path also shows screen 2) |
| `/drop` | 3. Page d'accueil du drop |
| `/produit/ls-01` | 4. Fiche produit, viewer A "relief photo" |
| `/produit/ls-01?viewer=glb` | 4b. Same page, viewer B "modèle IA" (GLB) |
| `/comparer` | A and B side by side on the same podium |
| `/confirmation` | 7. Commande confirmée |

Add `?still=1` to any URL to force the reduced-motion mode without changing OS settings.

Stack: Vite + React 18 + TypeScript + Tailwind 4 + three.js. I picked Vite over Next.js because it starts in one command and is lighter for a throwaway. The components (`Stage`, `Ambient`, `DepthViewer`, `GlbViewer`, `MobileGallery`) are plain React and port to Next.js as client components unchanged.

Screenshots: `screenshots/` (desktop 1440x900, mobile 390x844 @2x, taken with headless Chrome).

## What matches the mockup

- **Layout and tone**: near-black base, thin low-opacity 1px borders, glass panels, wide tracking on small caps labels, white outline buttons with a hover-to-solid invert. The access page, drop home and confirmation sit very close to screens 1, 3 and 7.
- **Font**: [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (Google Fonts) for everything. It is the closest free match to the squared tech display in the mockup (DROP_01, LS-01, COMMANDE CONFIRMÉE). Michroma is wider and has only one weight. Rajdhani reads too condensed at small sizes.
- **Backgrounds**: the provided renders, used as full-bleed `cover` with a focal point per page. A `Stage` component exposes the covered box, so the glow, the garment and the podium shadow stay pinned to the same spot of the render at any viewport size.
- **Ambient motion** (no video): a slow Ken Burns zoom (38 s), two canvas fog layers drifting along the floor (procedural noise, no asset), and a flicker on each light slit. The slits were located by measuring pixel brightness in each render, not by eye. All motion is off under `prefers-reduced-motion` (no canvas, no animation).
- **Product rules from DECISIONS.md**: stock bar only when the variant is capped (LS-01 27/50, HD-01 4/30 shown in red as low stock, PT-01 and BN-01 unlimited so no bar), color chips, size squares, "choisissez une taille" validation, cart counter in the header, live countdown, drop closing time and estimated delivery on the product page, and an order summary with "PAYÉE" on the confirmation page (PRD 02: the confirmation must show product, variant, amount and status).
- **French copy** throughout, with no em dashes. Prices use the French format (`45,00 €`). The mockup shows `€45`; that needs a decision (see the end).

## What doesn't match (yet)

- **Logo**: a typed "FEAT" in Chakra Petch bold italic with a "LOGO TEMP" tag. It is **not** the real logo and must be replaced by FEAT's official SVG. The engraved "FEAT" on the confirmation cube comes from FEAT's own render (bg-05), so I left it untouched.
- **Background sharpness**: the renders are WhatsApp-compressed at 1080 px wide. On a 1440 px screen, and more so on the drop page where I zoom 1.3x to re-frame the door, they look soft. Full-res renders will fix this.
- **Product photos**: only LS-01 has a real cutout. HD-01, PT-01 and BN-01 cards use 75 px crops from the mockup board, upscaled and blurry, and are tagged "VISUEL MAQUETTE". The LS-01 garment is a placeholder (source below).
- **Detail thumbnails**: "Col" and "Poignet" are zoomed crops of the front photo. Real detail shots will look much better.
- **Desktop vs mobile composition**: the mockup screens are portrait. On desktop I put the product info in a glass panel on the right and the garment over the podium in the center-left. That's my own adaptation of screen 4.
- **Not built**: screens 2 (as a separate page; it is inline on `/`), 5 cart, 6 payment, 8 live stock. Those were out of scope for this pass.

## Product viewer: which approach looks better

**A. Relief photo (fake 3D)**: cutout photo, AI depth map, WebGL.
- Depth map: **Depth Anything V2 Small** (`depth-anything/Depth-Anything-V2-Small-hf`, Apache-2.0), run locally on this Mac through `transformers` (`scripts/make_depth.py`). I blended it 60/40 with a distance-to-edge dome so the silhouette rolls off smoothly. The normal maps are baked offline (`scripts/make_normals.py`), because normals rebuilt in the shader from an 8-bit depth texture showed visible contour-line banding.
- Rendering: a 220x240-segment plane displaced by the depth. Lighting comes from the normal maps, and the key light follows the cursor. The garment tilts toward the mouse (about ±17° horizontally and ±9° vertically) and bobs gently. A contact shadow on the podium slides opposite to the tilt. Front/back flip happens on click, drag, the arrows or the thumbnails.
- Mobile (<768 px): no WebGL and no motion. It's a static image with a scroll-snap swipe between Face / Dos / Détail.

**B. AI image-to-3D (GLB)**: Hunyuan3D-2 on the same podium, orbit + zoom, auto-rotate.
- Generated from the black front photo on the free public Hugging Face Space `tencent/Hunyuan3D-2`, with no account and no credits. The raw mesh had 668k faces (12 MB). I decimated it to 60k faces (1.05 MB GLB, `public/models/ls01-hunyuan-shape.glb`).
- The Space returns the shape only: its texture endpoint failed with a server-side `NameError`. So the "photo projetée" variant projects the front and back photos onto the mesh at runtime (front-facing triangles take the front photo, back-facing ones take the mirrored back photo). "Forme brute" shows the bare mesh in a dark fabric material.
- Other services tried: TRELLIS (front + back multi-view) and Stable Fast 3D, both on free HF Spaces. Both were refused once the anonymous ZeroGPU quota ran out ("exceeded your ZeroGPU quota… authenticate with a Hugging Face token"). I didn't try Meshy or Tripo: they need an account, and creating accounts is Williams's call.

**Verdict: A, relief photo, for V1.**
- From the front, at the angles a shopper actually uses, A looks like the real product photo, because it *is* the photo. Folds, fabric texture and the future chest logo stay exactly as shot. It feels "3D enough" thanks to the light and parallax. It works with the photos FEAT already has (front, back, detail) and needs no 3D skill.
- B looks fine from the front, but from the side the single-photo reconstruction gives a slab or cape: the sleeves merge into the body and the garment has no real thickness. Expect AI-invented details on logos and prints. It also needs a per-product generation and cleanup step: decimating, checking, maybe fixing in Blender. That's exactly what we want to avoid, given nobody on the team is comfortable with Blender.
- B could become worth it with a multi-view model (TRELLIS or Hunyuan multi-view using front + back + side photos) and textured output. That needs an HF token (free account) or paid credits on Meshy or Tripo. It's worth one more test once FEAT sends real photos, but it shouldn't block V1. The viewer contract stays as decided: the product accepts either an image set or a GLB.

## Performance

Measured in headless Chrome on this Mac (Apple Silicon GPU):

| Page | Desktop 1440x900 | Mobile 390x844 @2x, CPU throttled 4x |
|---|---|---|
| Accès, Drop, Confirmation (fog + flicker + Ken Burns) | 60 fps, p95 17 ms | 60 fps, p95 17 ms |
| Produit A (relief WebGL desktop; static swipe on mobile) | 60 fps | 60 fps (no WebGL on mobile) |
| Produit B (GLB, 60k triangles) | 60 fps | 60 fps |

Caveats:
- The CPU throttle doesn't throttle the GPU, so these numbers say little about a low-end Android GPU. Test on a real mid-range Android before deciding on mobile ambient motion. The fog canvas already renders at 35% resolution and stops entirely under reduced motion.
- **Weight matters more than fps on mobile.**
  - Viewer A desktop loads about 1.75 MB of PNG: color 0.7 + 0.35 MB, depth 0.22 MB, normals 0.49 MB. Mobile only loads the two color PNGs. WebP/AVIF should cut that by about 4x.
  - Viewer B adds 1.05 MB of GLB plus the photos.
  - The JS bundle is 218 KB gzipped, most of it three.js. In the real build, `DepthViewer`/`GlbViewer` should be dynamically imported on desktop only, so mobile never downloads three.js.

## Assets still needed from FEAT

1. **Logo**: official SVG, white version for dark backgrounds (PRD 06: never redrawn).
2. **Font**: if FEAT has a brand typeface, the file and license. Otherwise we confirm Chakra Petch.
3. **Backgrounds in full resolution**: at least 2560 px wide, uncompressed, for bg-01, 04/05, 06 and 07. Ideally also a version of bg-07 (podium) without anything above it, plus separate layers for fog and light if the 3D artist has them, for a richer parallax.
4. **Product photos per colorway**: front, back and 2 to 3 details. Shot flat or on an invisible mannequin, on a plain light grey background (easy, clean cutouts), soft even light, same framing and distance for front and back, at least 2000 px. The relief viewer and any future image-to-3D both depend on this.
5. **Product data**: final names, descriptions, materials and fit, prices, sizes, caps per variant, drop dates, delivery delay.
6. **Decision**: price format `45,00 €` (French standard, what's in the prototype now) or `€45` as in the mockup.

## Sources and licenses of placeholder assets

- LS-01 garment: "Wiki Loves Monuments 2021 in India Men's long sleeve T-shirt", front and reverse, by User:Bodhisattwa, **CC BY-SA 4.0**, Wikimedia Commons ([front](https://commons.wikimedia.org/wiki/File:Wiki_Loves_Monuments_2021_in_India_Men%27s_long_sleeve_T-shirt_-_front_side.png), [back](https://commons.wikimedia.org/wiki/File:Wiki_Loves_Monuments_2021_in_India_Men%27s_long_sleeve_T-shirt_-_reverse_side.png)). Modified: background removed, prints inpainted, recolored to black (`scripts/prepare_garments.py`). Placeholder only. Remove it before anything goes public, or keep the attribution.
- HD-01 / PT-01 / BN-01 cards: crops of FEAT's own mockup board.
- Backgrounds: FEAT's provided renders (`assets/backgrounds`).
- Depth model: Depth Anything V2 Small (Apache-2.0). 3D model: Hunyuan3D-2 (Tencent Hunyuan community license; check the terms before any commercial use of its output).

## Files

- `src/components/Stage.tsx`: cover background with pinned overlays. `Ambient.tsx`: fog and flicker.
- `src/viewer/DepthViewer.tsx`: viewer A. `GlbViewer.tsx`: viewer B (with photo projection). `MobileGallery.tsx`: mobile swipe gallery.
- `scripts/`: asset pipeline (cutout, depth, normals). The scripts need `opencv-python-headless`, `scipy`, `pillow`, and `transformers` + `torch` for depth.
