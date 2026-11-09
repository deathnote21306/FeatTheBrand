# FEAT design tokens

Tokens live in `app/tokens.css` as a Tailwind v4 `@theme`. Every token becomes a utility (`bg-ink`, `text-heading`, `border-line`…). Live preview with the mockup next to each token: **`/dev/tokens`** (only in `pnpm dev`, 404 in production).

Sources: the mockup board (`assets/reference/mockup-board.jpg`, screens 1 to 8) and the approved prototype (`prototype/`), which was matched to the mockup screen by screen.

Tailwind's default colors and radii are **removed**, so a class like `text-gray-400` or `rounded-lg` doesn't exist. Use the tokens below.

## Colors

| Token                    | Value         | Use                                          |
| ------------------------ | ------------- | -------------------------------------------- |
| `ink`                    | `#050506`     | page background                              |
| `ink-2`                  | `#0b0b0d`     | raised surfaces: cards, inputs               |
| `ink-3`                  | `#131316`     | hover on raised surfaces, skeletons          |
| `white`, `black`         |               | primary button (white bg, black text)        |
| `line`                   | white 14%     | default 1px borders and dividers             |
| `line-strong`            | white 32%     | inputs, chips                                |
| `line-emphasis`          | white 60%     | outline buttons, selected chips              |
| `gold`                   | `#e9c58f`     | warm accent from the light slits, sparingly  |
| `danger`                 | `#d4352c`     | **fills only**: low-stock bar, error borders |
| `danger-text`            | `#ec5a4f`     | error and low-stock text                     |
| `glass` (utility)        | gradient+blur | dark panels over background renders         |

### Text colors and contrast (WCAG AA)

Ratios are against `ink`. AA needs 4.5:1 for normal text.

| Token         | Value     | Ratio  | Use                                         |
| ------------- | --------- | ------ | ------------------------------------------- |
| `fg`          | white     | 20.4:1 | titles, primary text                        |
| `fg-strong`   | white 90% | 16.3:1 | hero copy                                   |
| `fg-body`     | white 80% | 12.8:1 | paragraphs                                  |
| `fg-muted`    | white 60% | 7.3:1  | nav, secondary info, captions               |
| `fg-subtle`   | white 55% | 6.3:1  | **lowest level allowed for readable text**  |
| `danger-text` | `#ec5a4f` | 6.0:1  | errors, "épuisé", low stock (4.9:1 on ink-3) |
| `fg-disabled` | white 35% | 3.1:1  | disabled controls only, never readable text |

The prototype used white 45% for some labels and placeholders (4.5:1 is not reached: 4.46:1). Those move to `fg-subtle`.

Text over background renders: the ratios above assume the dark parts of the image. Keep text on the dark areas, or put it on a `glass` panel.

## Typography

Font: **Chakra Petch** (Google Fonts, loaded with `next/font` in `app/layout.tsx`), a placeholder for the FEAT brand font. It was picked in the prototype as the closest free match to the squared tech display in the mockup. `--font-display` and `--font-sans` are separate tokens so the brand font can replace either one alone.

Each size step sets size, line-height, letter spacing and weight in one class. Override with `tracking-*` or `font-*` only when needed.

| Class                | Size | Line | Tracking | Weight | Mockup example (screen)                      |
| -------------------- | ---- | ---- | -------- | ------ | -------------------------------------------- |
| `text-display-xl`    | 64px | 1    | 0.04em   | 700    | DROP_01 hero, desktop (3)                    |
| `text-display-lg`    | 44px | 1    | 0.04em   | 700    | DROP_01 hero, mobile (3)                     |
| `text-display`       | 30px | 1    | 0.04em   | 700    | LS-01 on the product page (4)                |
| `text-title`         | 24px | 1.2  | 0.08em   | 700    | COMMANDE CONFIRMÉE, desktop (7)              |
| `text-title-sm`      | 20px | 1.2  | 0.08em   | 700    | COMMANDE CONFIRMÉE, mobile (7)               |
| `text-figure`        | 22px | 1.2  | 0.02em   | 500    | price 45,00 € (4), countdown (3)             |
| `text-heading`       | 15px | 1.6  | 0.32em   | 600    | ACCÈS PRIVÉ (2), VOTRE PANIER (5)            |
| `text-subheading`    | 13px | 1.3  | 0.06em   | 600    | card codes LS-01, HD-01 (3, 5, 8)            |
| `text-body`          | 12px | 1.625| 0.01em   | 400    | paragraphs, card prices, form text           |
| `text-label`         | 11px | 1.2  | 0.18em   | 600    | buttons, cart count                          |
| `text-caption`       | 10px | 1.4  | 0.18em   | 500    | nav, "27 / 50 en stock", field labels        |
| `text-micro`         | 9px  | 1.4  | 0.18em   | 500    | card subtitles, footer STYLE × PERFORMANCE   |

Rules:

- 9px (`text-micro`) is the smallest size. Don't go below it.
- Small caps labels are written in uppercase in the copy (no `uppercase` needed when the copy is already caps).
- Use `tabular-nums` for prices, countdowns and stock counts so digits don't jump.
- Price format: `45,00 €` (see DECISIONS.md).

Tracking tokens for overrides: `tracking-feat` (0.32em), `tracking-feat-sm` (0.18em), `tracking-display` (0.04em).

## Spacing

Tailwind's 4px step is kept (`p-1` = 4px, `p-4` = 16px). Named values:

| Token        | Value | Use                                                         |
| ------------ | ----- | ----------------------------------------------------------- |
| `gutter`     | 20px  | page side padding on mobile: `px-gutter`                    |
| `gutter-md`  | 40px  | page side padding from `md`: `md:px-gutter-md`              |
| `control`    | 44px  | minimum height of tap targets: `h-control`, `min-h-control` |

## Radius

Everything is square. `rounded-none` is the default; `rounded-full` is only for color swatches and radio dots. No other radius tokens exist.

## Motion

- `ease-feat`: `cubic-bezier(0.2, 0.7, 0.2, 1)`, the easing for fades and reveals.
- `animate-fade-up`: 0.9s fade and 10px rise, used for hero text.
- `prefers-reduced-motion` turns off animations and transitions globally (`app/globals.css`).

## Focus

Every focusable element gets a 1px white outline with a 3px offset on `:focus-visible` (`app/globals.css`). Components can refine it but must keep a visible focus state.

## Changing a token

1. Edit `app/tokens.css`.
2. Update the table here.
3. Check `/dev/tokens` against the mockup, and recheck contrast if you touch a text color.
