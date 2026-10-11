import type { Ders, Zorluk } from "../types";
import { filtrele } from "./index";

/** Seçilen ders(ler) ve zorluk için bankada kaç soru olduğunu döndürür. */
export function havuzSayisi(dersler: Ders[], zorluk?: Zorluk | "hepsi"): number {
  if (!dersler.length) return 0;
  return dersler.reduce(
    (t, d) => t + filtrele({ ders: d, zorluk: zorluk ?? "hepsi" }).length,
    0
  );
}
