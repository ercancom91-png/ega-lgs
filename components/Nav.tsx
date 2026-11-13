"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MODAL_OLAY, ModalTur } from "@/lib/modal";
import RastgeleModal from "./RastgeleModal";
import DenemeUretModal from "./DenemeUretModal";

const LINKLER = [
  { href: "/dersler/", ad: "Dersler" },
  { href: "/banka/", ad: "Soru Bankası" },
  { href: "/meb/", ad: "MEB Çalışma Kitapları" },
];

export default function Nav() {
  const yol = usePathname();
  const [modal, setModal] = useState<ModalTur | null>(null);

  // sayfa içi butonlar modalAc() ile haber verir
  useEffect(() => {
    const dinle = (e: Event) => setModal((e as CustomEvent<ModalTur>).detail);
    window.addEventListener(MODAL_OLAY, dinle);
    return () => window.removeEventListener(MODAL_OLAY, dinle);
  }, []);

  // rota değişince açık modal kapansın
  useEffect(() => {
    setModal(null);
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
            <button className="nav-btn" onClick={() => setModal("rastgele")}>
              🎲 Rastgele Soru
            </button>
            <button className="nav-btn" onClick={() => setModal("uret")}>
              Deneme Üret
            </button>
            <Link href="/denemeler/" className="nav-cta">
              Deneme Başlat
            </Link>
          </div>
        </div>
      </nav>

      {modal === "rastgele" && <RastgeleModal kapat={() => setModal(null)} />}
      {modal === "uret" && <DenemeUretModal kapat={() => setModal(null)} />}
    </>
  );
}
