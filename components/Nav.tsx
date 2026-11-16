"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MODAL_OLAY, ModalTur } from "@/lib/modal";
import { useVeri } from "@/lib/store";
import { aktifOturumAl } from "@/lib/supabase";
import RastgeleModal from "./RastgeleModal";
import DenemeUretModal from "./DenemeUretModal";

const LINKLER = [
  { href: "/dersler/", ad: "Dersler" },
  { href: "/banka/", ad: "Test Çöz" },
  { href: "/meb/", ad: "MEB Çalışma Kitapları" },
];

export default function Nav() {
  const yol = usePathname();
  const [modal, setModal] = useState<ModalTur | null>(null);
  const [mobilAcik, setMobilAcik] = useState(false);
  const [kuruldu, setKuruldu] = useState(false);
  const veri = useVeri();
  const [oturumVar, setOturumVar] = useState(false);

  useEffect(() => {
    setKuruldu(true);
    setOturumVar(Boolean(aktifOturumAl()));
  }, [yol, veri.profil.eposta]);

  const basHarf = kuruldu
    ? (veri.profil.ad || "Ö").trim().slice(0, 1).toUpperCase()
    : "Ö";
  const profilFoto = kuruldu ? veri.profil.foto : undefined;
  const kisaAd =
    kuruldu && veri.profil.ad && veri.profil.ad !== "Öğrenci"
      ? veri.profil.ad
      : "Profil";

  useEffect(() => {
    const dinle = (e: Event) => setModal((e as CustomEvent<ModalTur>).detail);
    window.addEventListener(MODAL_OLAY, dinle);
    return () => window.removeEventListener(MODAL_OLAY, dinle);
  }, []);

  useEffect(() => {
    setModal(null);
    setMobilAcik(false);
  }, [yol]);

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
              onClick={() => setModal("rastgele")}
            >
              🎲 Rastgele Soru
            </button>
            <button
              className="nav-btn nav-hide-sm"
              onClick={() => setModal("uret")}
            >
              Deneme Üret
            </button>
            <Link href="/denemeler/" className="nav-cta">
              Deneme Başlat
            </Link>
            {!oturumVar && (
              <Link
                href="/giris/"
                className={`nav-btn nav-hide-md ${yol.startsWith("/giris") ? "active-btn" : ""}`}
              >
                Giriş / Kayıt
              </Link>
            )}
            <Link
              href="/profil/"
              className={`nav-profil ${yol.startsWith("/profil") ? "active" : ""}`}
              title="Profil"
            >
              <span className="nav-avatar">
                {profilFoto ? (
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
              <Link
                href="/giris/"
                className={`nav-mobil-link ${yol.startsWith("/giris") ? "active" : ""}`}
              >
                {oturumVar ? "Hesap & Bulut Oturumu" : "Giriş Yap / Kayıt Ol"}
              </Link>
            </div>
            <div className="nav-mobil-actions">
              <button
                className="btn btn-sm"
                onClick={() => {
                  setMobilAcik(false);
                  setModal("rastgele");
                }}
              >
                🎲 Rastgele Soru
              </button>
              <button
                className="btn btn-sm"
                onClick={() => {
                  setMobilAcik(false);
                  setModal("uret");
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
    </>
  );
}
