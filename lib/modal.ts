/** Uygulama genelinde açılan modalları yöneten olay otobüsü.
 *  Nav bileşeni bu olayı dinler; sayfa içi butonlar veya misafir koruma katmanı modalAc() ile açar. */

export type ModalTur = "rastgele" | "uret" | "giris" | "kayit";

export interface ModalDetay {
  tur: ModalTur;
  uyari?: string;
}

export const MODAL_OLAY = "ega-modal";

export function modalAc(tur: ModalTur, uyari?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ModalDetay>(MODAL_OLAY, { detail: { tur, uyari } })
  );
}
