/** Uygulama genelinde açılan modalları yöneten basit olay otobusu.
 *  Nav bileşeni bu olayı dinler; sayfa içi butonlar modalAc() ile açar. */

export type ModalTur = "rastgele" | "uret";

export const MODAL_OLAY = "ega-modal";

export function modalAc(tur: ModalTur) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ModalTur>(MODAL_OLAY, { detail: tur }));
}
