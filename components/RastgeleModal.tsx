"use client";

import { useState } from "react";
import SoruBlok from "./SoruBlok";
import { BANK, karistir } from "@/lib/questions";
import { Harf, Soru } from "@/lib/types";
import { soruKaydet } from "@/lib/store";

interface Props {
  kapat: () => void;
}

/** Havuzun tamamından karışık soru getiren mini widget (modal). */
export default function RastgeleModal({ kapat }: Props) {
  const [sira, setSira] = useState<Soru[]>(() => karistir(BANK, Math.random));
  const [i, setI] = useState(0);
  const [secim, setSecim] = useState<Harf | null>(null);
  const [cevaplandi, setCevaplandi] = useState(false);
  const [cozulen, setCozulen] = useState(0);
  const [dogruSay, setDogruSay] = useState(0);

  const soru = sira[i % sira.length];

  const cevapla = (h: Harf) => {
    if (cevaplandi || !soru) return;
    setSecim(h);
    setCevaplandi(true);
    const d = h === soru.dogru;
    soruKaydet(soru.id, d ? "dogru" : "yanlis");
    setCozulen((n) => n + 1);
    if (d) setDogruSay((n) => n + 1);
  };

  const sonraki = () => {
    if (i + 1 >= sira.length) {
      setSira(karistir(BANK, Math.random));
      setI(0);
    } else {
      setI(i + 1);
    }
    setSecim(null);
    setCevaplandi(false);
  };

  return (
    <div className="modal-bg" onClick={kapat}>
      <div
        className="modal orta kaydir"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Rastgele soru"
      >
        <div className="modal-ust">
          <p className="eyebrow">🎲 RASTGELE SORU</p>
          <button className="modal-kapat" onClick={kapat} aria-label="Kapat">
            ✕
          </button>
        </div>

        <div className="row wrap" style={{ marginBottom: 18, gap: 8 }}>
          <span className="pill acc">{cozulen} çözüldü</span>
          <span className="pill green">{dogruSay} doğru</span>
          <span className="pill">
            {cozulen ? Math.round((dogruSay / cozulen) * 100) : 0}% doğruluk
          </span>
          <span className="pill blue" style={{ marginLeft: "auto" }}>
            Karışık havuz · {BANK.length} soru
          </span>
        </div>

        {soru && (
          <>
            <SoruBlok
              soru={soru}
              no={i + 1}
              secim={secim}
              onSec={cevaplandi ? undefined : cevapla}
              geriBildirim={cevaplandi}
            />
            <div className="between" style={{ marginTop: 18 }}>
              {cevaplandi ? (
                <>
                  <span className={`pill ${secim === soru.dogru ? "green" : "red"}`}>
                    {secim === soru.dogru
                      ? "✓ Doğru!"
                      : `✗ Yanlış · doğru cevap ${soru.dogru}`}
                  </span>
                  <button className="btn btn-primary" onClick={sonraki}>
                    Sıradaki soru →
                  </button>
                </>
              ) : (
                <span className="small muted">
                  Şıklardan birine bas; çözüm ve konu açıklaması açılsın.
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
