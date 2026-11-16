"use client";

import { useEffect, useState } from "react";
import { kilidiAc, kilitliMi, veriYukle } from "@/lib/store";

/**
 * Profil koduna (parola kilidine) sahipse her oturumun başında sorulur.
 */
export default function KilitPerdesi() {
  const [durum, setDurum] = useState<"bekle" | "kilitli" | "acik">("bekle");
  const [kod, setKod] = useState("");
  const [hata, setHata] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    setDurum(kilitliMi() ? "kilitli" : "acik");
  }, []);

  if (durum !== "kilitli") return null;

  const ac = async () => {
    if (!kod.trim()) return;
    setYukleniyor(true);
    const tamam = await kilidiAc(kod);
    setYukleniyor(false);
    if (tamam) {
      setDurum("acik");
      setKod("");
      setHata(false);
    } else {
      setHata(true);
    }
  };

  const p = veriYukle().profil;
  const tamAd = [p.ad || "Öğrenci", p.soyad].filter(Boolean).join(" ");
  const bas = (p.ad || "Ö").trim().slice(0, 1).toUpperCase();

  return (
    <div className="kilit">
      <div className="panel panel-pad kilit-kutu">
        <div className="between">
          <p className="eyebrow">EGA · GÜVENLİ GİRİŞ</p>
          <span className="avatar kilit-avatar" style={{ overflow: "hidden" }}>
            {p.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.foto} alt={tamAd} className="avatar-img" />
            ) : (
              bas
            )}
          </span>
        </div>
        <h2 style={{ margin: "14px 0 6px", fontSize: 22 }}>{tamAd}</h2>
        <p className="small muted" style={{ marginBottom: 16 }}>
          Devam etmek için profil parolanı gir.
        </p>

        <input
          type="password"
          value={kod}
          autoFocus
          placeholder="Parolan"
          onChange={(e) => {
            setKod(e.target.value);
            setHata(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") ac();
          }}
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: ".18em",
          }}
        />

        {hata && (
          <p className="small" style={{ color: "var(--red)", marginTop: 8 }}>
            Parola hatalı, tekrar dene.
          </p>
        )}

        <button
          className="btn btn-primary"
          disabled={yukleniyor || !kod.trim()}
          onClick={ac}
          style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
        >
          {yukleniyor ? "Doğrulanıyor…" : "Kilidi Aç"}
        </button>

        <p className="small muted" style={{ marginTop: 14 }}>
          Parolanı Profil → Ayarlar bölümünden değiştirebilir veya kaldırabilirsin.
        </p>
      </div>
    </div>
  );
}
