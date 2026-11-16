"use client";

import { useEffect, useState } from "react";
import { kilidiAc, kilitliMi, veriYukle } from "@/lib/store";

/**
 * Profil koduna (PIN) sahipse her oturumun başında sorulur.
 * Yalnızca istemci tarafında çalışır; doğru kod oturuma özel hafızada tutulur.
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

  const ad = veriYukle().profil.ad || "Öğrenci";
  const bas = ad.trim().slice(0, 1).toUpperCase();

  return (
    <div className="kilit">
      <div className="panel panel-pad kilit-kutu">
        <div className="between">
          <p className="eyebrow">EGA · GİRİŞ</p>
          <span className="avatar kilit-avatar">{bas}</span>
        </div>
        <h2 style={{ margin: "14px 0 6px", fontSize: 22 }}>{ad}</h2>
        <p className="small muted" style={{ marginBottom: 16 }}>
          Devam etmek için profil kodunu gir. Kodun yalnızca bu cihazda saklanır,
          hiçbir sunucuya gönderilmez.
        </p>

        <input
          type="password"
          value={kod}
          autoFocus
          placeholder="Profil kodu"
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
            Kod hatalı, tekrar dene.
          </p>
        )}

        <button
          className="btn btn-primary"
          disabled={yukleniyor || !kod.trim()}
          onClick={ac}
          style={{ marginTop: 14, width: "100%" }}
        >
          {yukleniyor ? "Doğrulanıyor…" : "Kilidi aç"}
        </button>

        <p className="small muted" style={{ marginTop: 14 }}>
          Kodunu unuttuysan Profil → Ayarlar’dan kaldırabilirsin; tüm verilerin de
          bu cihazda saklanır.
        </p>
      </div>
    </div>
  );
}
