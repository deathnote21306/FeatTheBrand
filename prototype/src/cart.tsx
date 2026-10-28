import { createContext, ReactNode, useContext, useState } from "react";
import type { Colorway } from "./data";

export type Line = { ref: string; name: string; color: Colorway; size: string; qty: number; price: number };

const Ctx = createContext<{ lines: Line[]; count: number; add: (l: Line) => void; clear: () => void }>({
  lines: [],
  count: 0,
  add: () => {},
  clear: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const add = (l: Line) => setLines((ls) => [...ls, l]);
  const clear = () => setLines([]);
  return <Ctx.Provider value={{ lines, count: lines.reduce((n, l) => n + l.qty, 0), add, clear }}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);
