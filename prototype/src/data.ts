// Demo data from docs/DECISIONS.md (mockup products). Not real FEAT data.

export type Colorway = "black" | "white";

export type Product = {
  id: string;
  slug: string;
  ref: string;
  name: string;
  price: number;
  sizes: string[];
  colors: Colorway[];
  /** null = unlimited pre-order, no stock bar shown */
  cap: { left: number; total: number } | null;
  card: string;
  /** only LS-01 has a real cutout + depth map in the prototype */
  viewer?: {
    images: Record<Colorway, { front: string; back: string }>;
    depth: { front: string; back: string };
    normal: { front: string; back: string };
  };
};

export const PRODUCTS: Product[] = [
  {
    id: "ls01",
    slug: "ls-01",
    ref: "LS-01",
    name: "T-shirt manches longues",
    price: 45,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white"],
    cap: { left: 27, total: 50 },
    card: "/garments/ls01-black-front.png",
    viewer: {
      images: {
        black: { front: "/garments/ls01-black-front.png", back: "/garments/ls01-black-back.png" },
        white: { front: "/garments/ls01-white-front.png", back: "/garments/ls01-white-back.png" },
      },
      depth: { front: "/garments/ls01-depth-front.png", back: "/garments/ls01-depth-back.png" },
      normal: { front: "/garments/ls01-normal-front.png", back: "/garments/ls01-normal-back.png" },
    },
  },
  {
    id: "hd01",
    slug: "hd-01",
    ref: "HD-01",
    name: "Hoodie",
    price: 70,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "white"],
    cap: { left: 4, total: 30 },
    card: "/mock/hd01.jpg",
  },
  {
    id: "pt01",
    slug: "pt-01",
    ref: "PT-01",
    name: "Pantalon",
    price: 65,
    sizes: ["S", "M", "L", "XL"],
    colors: ["black"],
    cap: null,
    card: "/mock/pt01.jpg",
  },
  {
    id: "bn01",
    slug: "bn-01",
    ref: "BN-01",
    name: "Bonnet",
    price: 25,
    sizes: ["TU"],
    colors: ["black"],
    cap: null,
    card: "/mock/bn01.jpg",
  },
];

export const eur = (n: number, decimals = true) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(n);

export const COLOR_LABEL: Record<Colorway, string> = { black: "Noir", white: "Blanc" };
