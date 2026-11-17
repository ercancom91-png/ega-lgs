"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MODAL_OLAY, ModalDetay, ModalTur } from "@/lib/modal";
import { kullaniciCikisYap, useVeri } from "@/lib/store";
import { aktifOturumAl } from "@/lib/supabase";
import RastgeleModal from "./RastgeleModal";
import DenemeUretModal from "./DenemeUretModal";
import GirisKayitModal from "./GirisKayitModal";

const LINKLER = [
  { href: "/dersler/", ad: "Dersler" },
  { href: "/banka/", ad: "Test Çöz" },
  { href: "/meb/", ad: "MEB Çalışma Kitapları" },
];

export default function Nav() {
  const yol = usePathname();
  const [modal, setModal] = useState<ModalTur | null>(null);
  const [modalUyari, setModalUyari] = useState<string | undefined>(undefined);
  const [mobilAcik, setMobilAcik] = useState(false);
  const [kuruldu, setKuruldu] = useState(false);
  const veri = useVeri();
  const [oturumVar, setOturumVar] = useState(false);

  useEffect(() => {
    setKuruldu(true);
    setOturumVar(Boolean(aktifOturumAl()));
  }, [yol, veri.profil.eposta, veri.profil.ad]);

  const basHarf = kuruldu
    ? (veri.profil.ad || "Ö").trim().slice(0, 1).toUpperCase()
    : "Ö";
  const profilFoto = kuruldu ? veri.profil.foto : undefined;
  const kisaAd =
    kuruldu && oturumVar && veri.profil.ad && veri.profil.ad !== "Öğrenci"
      ? veri.profil.ad
      : "Profil";

  useEffect(() => {
    const dinle = (e: Event) => {
      const ev = e as CustomEvent<ModalDetay | ModalTur>;
      const det =
        typeof ev.detail === "string"
          ? { tur: ev.detail }
          : ev.detail || { tur: "giris" };
      if (!aktifOturumAl() && (det.tur === "rastgele" || det.tur === "uret")) {
        setModalUyari(
          "Rastgele soru çözmek veya özel deneme üretmek için lütfen giriş yapın veya ücretsiz kayıt olun."
        );
        setModal("giris");
        return;
      }
      setModalUyari(det.uyari);
      setModal(det.tur);
    };
    window.addEventListener(MODAL_OLAY, dinle);
    return () => window.removeEventListener(MODAL_OLAY, dinle);
  }, []);

  /**
   * Misafir (kayıt olmamış / giriş yapmamış) kullanıcı koruma katmanı:
   * Kullanıcı yalnızca mevcut sayfayı görüntüleyebilir; herhangi bir içeriğe,
   * derse, konuya, teste, denemeye veya ayarlara tıkladığında bulunduğu sayfa
   * değişmeden Giriş / Kayıt modal penceresi açılır.
   */
  useEffect(() => {
    const yakala = (e: MouseEvent) => {
      if (aktifOturumAl()) return;
      const hedef = e.target as HTMLElement | null;
      if (!hedef) return;

      // Giriş modalının kendi içindeki tıklamalara veya /giris sayfasındaki formlara izin ver
      if (
        hedef.closest(".giris-modal-kapsam") ||
        hedef.closest(".auth-form-kutu") ||
        hedef.closest(".nav-burger")
      ) {
        return;
      }

      // Anasayfa vitrin slider okları yalnızca görsel slayt geçişi yapar -> izin ver
      if (hedef.closest(".slider-arrow") || hedef.closest(".slider-nav")) {
        return;
      }

      // Üst menüdeki sekme gezintisine sadece sayfaları "görüntülemek" için izin ver,
      // ancak içerik / sınav / ders detay / aksiyon tıklamalarını yakala ve modal aç
      const aksiyonElemani = hedef.closest(
        "button, a, input, select, .ders-card, .konu-card, .tile, .opt, .hedef-chip, .hedef-step"
      ) as HTMLElement | null;

      if (!aksiyonElemani) return;

      // Sadece ana görünüm sekmelerine (Ana sayfa, Dersler, Test Çöz, MEB, Denemeler, Profil)
      // geçiş yapılmasına izin ver ki kullanıcı sayfaları görüntüleyebilsin;
      // ancak /sinav/ veya /dersler/[ders] gibi içerik detaylarına ve sayfa içi tüm butonlara basıldığında
      // sayfa değişmeden modal aç!
      if (aksiyonElemani.tagName === "A") {
        const href = aksiyonElemani.getAttribute("href") || "";
        const saltGoruntulemeRotalari = new Set([
          "/",
          "/dersler",
          "/dersler/",
          "/banka",
          "/banka/",
          "/meb",
          "/meb/",
          "/denemeler",
          "/denemeler/",
          "/profil",
          "/profil/",
          "/istatistik",
          "/istatistik/",
        ]);
        const ustMenuLinkiMi = Boolean(
          aksiyonElemani.closest(".brand, .nav-links, .nav-profil, .nav-mobil-links")
        );
        if (ustMenuLinkiMi && saltGoruntulemeRotalari.has(href)) {
          return;
        }
      }

      // Bunun dışındaki TÜM içerik, test, soru, deneme ve ayar etkileşimlerini durdur -> sayfa değişmeden modal aç!
      e.preventDefault();
      e.stopPropagation();
      setModalUyari(
        "Bu içeriğe erişmek ve işlem yapmak için giriş yapmanız veya kayıt olmanız gerekmektedir. Kayıt olmayan kullanıcılar yalnızca sayfaları görüntüleyebilir."
      );
      setModal("giris");
    };

    document.addEventListener("click", yakala, true);
    return () => document.removeEventListener("click", yakala, true);
  }, []);

  useEffect(() => {
    setMobilAcik(false);
  }, [yol]);

  const modalOnAc = (tur: ModalTur, uyari?: string) => {
    if (!aktifOturumAl() && (tur === "rastgele" || tur === "uret")) {
      setModalUyari(
        "Rastgele soru çözmek veya özel deneme üretmek için lütfen giriş yapın veya ücretsiz kayıt olun."
      );
      setModal("giris");
      return;
    }
    setModalUyari(uyari);
    setModal(tur);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-in">
          <Link href="/" className="brand" title="Ana sayfa">
            <span className="brand-mark">E</span>
            <span className="brand-txt">
              <strong>EGA</strong>
              <span>LGS Hazırlık</span>
            </span>
          </Link>

          <div className="nav-links">
            {LINKLER.map((l) => {
              const aktif = yol.startsWith(l.href.replace(/\/$/, ""));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-link ${aktif ? "active" : ""}`}
                >
                  {l.ad}
                </Link>
              );
            })}
          </div>

          <div className="nav-buton">
            <button
              className="nav-btn nav-hide-sm"
              onClick={() => modalOnAc("rastgele")}
            >
              🎲 Rastgele Soru
            </button>
            <button
              className="nav-btn nav-hide-sm"
              onClick={() => modalOnAc("uret")}
            >
              Deneme Üret
            </button>
            <Link href="/denemeler/" className="nav-cta">
              Deneme Başlat
            </Link>
            {!oturumVar ? (
              <button
                type="button"
                className="nav-btn"
                onClick={() => modalOnAc("giris")}
              >
                🔐 Giriş / Kayıt
              </button>
            ) : (
              <button
                type="button"
                className="nav-btn nav-hide-md"
                onClick={async () => {
                  await kullaniciCikisYap();
                  setOturumVar(false);
                }}
              >
                Çıkış Yap
              </button>
            )}
            <Link
              href="/profil/"
              className={`nav-profil ${yol.startsWith("/profil") ? "active" : ""}`}
              title="Profil"
            >
              <span className="nav-avatar">
                {profilFoto && oturumVar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilFoto}
                    alt={kisaAd}
                    className="avatar-img"
                  />
                ) : (
                  basHarf
                )}
              </span>
              <span>{kisaAd}</span>
            </Link>
            <button
              type="button"
              className="nav-burger"
              onClick={() => setMobilAcik((v) => !v)}
              aria-label="Menüyü aç veya kapat"
              aria-expanded={mobilAcik}
            >
              {mobilAcik ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Misafir (Sadece Görüntüleme) Uyarı Şeridi */}
        {kuruldu && !oturumVar && (
          <div className="misafir-serit">
            <span>
              👁️ <strong>Sadece Görüntüleme Modu:</strong> İçeriklere erişmek,
              soru ve deneme çözmek için giriş yapmalısınız.
            </span>
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className="misafir-serit-btn"
                onClick={() => modalOnAc("giris")}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                className="misafir-serit-btn vurgu"
                onClick={() => modalOnAc("kayit")}
              >
                Ücretsiz Kayıt Ol →
              </button>
            </div>
          </div>
        )}

        {/* Mobil ve Tablet Açılır Menü */}
        {mobilAcik && (
          <div className="nav-mobil">
            <div className="nav-mobil-links">
              {LINKLER.map((l) => {
                const aktif = yol.startsWith(l.href.replace(/\/$/, ""));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`nav-mobil-link ${aktif ? "active" : ""}`}
                  >
                    {l.ad}
                  </Link>
                );
              })}
              <Link
                href="/denemeler/"
                className={`nav-mobil-link ${yol.startsWith("/denemeler") ? "active" : ""}`}
              >
                Çıkmış Denemeler
              </Link>
              <Link
                href="/istatistik/"
                className={`nav-mobil-link ${yol.startsWith("/istatistik") ? "active" : ""}`}
              >
                İstatistik & Rozetler
              </Link>
              <Link
                href="/profil/"
                className={`nav-mobil-link ${yol.startsWith("/profil") ? "active" : ""}`}
              >
                Profil & Hedefler ({kisaAd})
              </Link>
              {!oturumVar && (
                <button
                  type="button"
                  className="nav-mobil-link"
                  style={{ textAlign: "left", color: "var(--acc)" }}
                  onClick={() => {
                    setMobilAcik(false);
                    modalOnAc("giris");
                  }}
                >
                  🔐 Giriş Yap / Kayıt Ol
                </button>
              )}
            </div>
            <div className="nav-mobil-actions">
              <button
                className="btn btn-sm"
                onClick={() => {
                  setMobilAcik(false);
                  modalOnAc("rastgele");
                }}
              >
                🎲 Rastgele Soru
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  setMobilAcik(false);
                  modalOnAc("uret");
                }}
              >
                ⚡ Deneme Üret
              </button>
            </div>
          </div>
        )}
      </nav>

      {modal === "rastgele" && <RastgeleModal kapat={() => setModal(null)} />}
      {modal === "uret" && <DenemeUretModal kapat={() => setModal(null)} />}
      {(modal === "giris" || modal === "kayit") && (
        <GirisKayitModal
          baslangicMod={modal}
          uyari={modalUyari}
          kapat={() => setModal(null)}
          basarili={() => setOturumVar(Boolean(aktifOturumAl()))}
        />
      )}
    </>
  );
}
