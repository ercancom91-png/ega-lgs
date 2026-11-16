import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import KilitPerdesi from "@/components/KilitPerdesi";

export const metadata: Metadata = {
  title: "EGA · LGS Hazırlık Platformu",
  description:
    "MEB çıkmış LGS denemeleri (2018–2025), çalışma kitapları, 7.000+ soruluk gerçek soru bankası ve resmî sürelerle sınav simülasyonu. Liseye hazırlanan öğrenciler için.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-fx" aria-hidden>
          <div className="grid-lines" />
        </div>
        <Nav />
        <KilitPerdesi />
        <main className="shell">{children}</main>
        <footer className="footer">
          <b>EGA</b> — MEB çıkmış sorular, çalışma kitapları ve resmî LGS kurallarıyla
          hazırlanan ücretsiz hazırlık platformu.
          <br />
          Puanlama MEB kılavuzundaki formülle (ham puan = doğru − yanlış/3, katsayı 4/1)
          hesaplanır; tahmini değerdir.
        </footer>
      </body>
    </html>
  );
}
