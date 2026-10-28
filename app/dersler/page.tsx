import Link from "next/link";
import { DERS_BILGI } from "@/lib/dersler";
import { BANK, konular } from "@/lib/questions";
import { DERS_ADI } from "@/lib/types";

export const metadata = { title: "Dersler · EGA" };

export default function DerslerSayfasi() {
  return (
    <>
      <section style={{ padding: "46px 0 26px" }}>
        <p className="eyebrow">BÖLÜM 07</p>
        <h1 className="h-sec" style={{ margin: "10px 0 12px" }}>
          Dersler
        </h1>
        <p className="lead">
          LGS&apos;deki altı dersin tamamı. Bir dersi seç, o derste hangi konular
          olduğunu ve her konuda kaç soru bulunduğunu gör; konunun üzerine basarak
          doğrudan soru çözme ekranına geç.
        </p>
      </section>

      <div className="grid g-3">
        {DERS_BILGI.map((d) => {
          const sayi = BANK.filter((s) => s.ders === d.ders).length;
          const konuSayisi = konular(d.ders).length;
          return (
            <Link
              key={d.slug}
              href={`/dersler/${d.slug}/`}
              className="ders-card"
            >
              <div className="d-ico">{d.ikon}</div>
              <h3>{DERS_ADI[d.ders]}</h3>
              <p>{d.aciklama}</p>
              <div className="d-stat">
                <span className="pill">{konuSayisi} konu</span>
                <span className="pill red">{sayi} soru</span>
                <span className="pill blue">{d.oturum}</span>
              </div>
              <div className="d-go">Konuları gör →</div>
            </Link>
          );
        })}
      </div>

      <div className="panel panel-pad" style={{ marginTop: 26 }}>
        <p className="eyebrow">HIZLI KISAYOL</p>
        <p className="small muted" style={{ margin: "12px 0 16px", maxWidth: "62ch", lineHeight: 1.75 }}>
          Hangi ders olduğunu bilmiyor musun? Havuzun tamamından rastgele soru üret.
        </p>
        <Link href="/rastgele/" className="btn btn-primary">
          Rastgele soru üret →
        </Link>
      </div>
    </>
  );
}
