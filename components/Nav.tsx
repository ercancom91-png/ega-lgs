"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKLER = [
  { href: "/", ad: "Ana Sayfa" },
  { href: "/denemeler/", ad: "Denemeler" },
  { href: "/banka/", ad: "Soru Bankası" },
  { href: "/rastgele/", ad: "Rastgele Soru" },
  { href: "/dersler/", ad: "Dersler" },
  { href: "/meb/", ad: "MEB Çalışma Kitapları" },
  { href: "/istatistik/", ad: "İstatistik" },
];

export default function Nav() {
  const yol = usePathname();
  return (
    <nav className="nav">
      <div className="nav-in">
        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          <span className="brand-txt">
            <strong>EGA</strong>
            <span>LGS Hazırlık</span>
          </span>
        </Link>
        <div className="nav-links">
          {LINKLER.map((l) => {
            const aktif =
              l.href === "/" ? yol === "/" : yol.startsWith(l.href.replace(/\/$/, ""));
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
        <Link href="/sinav/?id=ega-tam" className="nav-cta">
          Deneme Başlat
        </Link>
      </div>
    </nav>
  );
}
