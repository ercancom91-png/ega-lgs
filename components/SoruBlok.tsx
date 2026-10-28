import type { Harf, Soru } from "@/lib/types";
import { DERS_ADI, DERS_RENK, ZORLUK_ADI } from "@/lib/types";
import Sekil from "./Sekil";

interface Props {
  soru: Soru;
  no?: number;
  secim?: Harf | null;
  onSec?: (h: Harf) => void;
  geriBildirim?: boolean;
  gizli?: boolean; // sınavda süre dolmadan çözüm gösterilmesin
  isaret?: boolean;
  onIsaretle?: () => void;
}

export default function SoruBlok({
  soru,
  no,
  secim,
  onSec,
  geriBildirim = false,
  gizli = false,
  isaret = false,
  onIsaretle,
}: Props) {
  return (
    <div className="q" data-soru-id={soru.id}>
      <div className="q-head">
        {no !== undefined && <span className="q-no">{no}</span>}
        <span className="pill" style={{ color: DERS_RENK[soru.ders] }}>
          <i className="ders-dot" style={{ background: DERS_RENK[soru.ders] }} />
          {DERS_ADI[soru.ders]}
        </span>
        <span className="pill blue">{soru.konu}</span>
        <span className="pill">{ZORLUK_ADI[soru.zorluk]}</span>
        <span className="pill" style={{ marginLeft: "auto" }}>
          {soru.kaynak}
        </span>
        {onIsaretle && (
          <button
            type="button"
            className={`flag-btn ${isaret ? "on" : ""}`}
            onClick={onIsaretle}
            title="Bu soruyu işaretle"
          >
            ⚑ {isaret ? "İşaretli" : "İşaretle"}
          </button>
        )}
        {!onIsaretle && isaret && <span className="pill red">⚑ işaretli</span>}
      </div>

      <div
        className="q-text"
        dangerouslySetInnerHTML={{ __html: soru.metin.replace(/\n/g, "<br/>") }}
      />

      {soru.sekil && <Sekil name={soru.sekil} />}

      {soru.tablo && (
        <table className="q-table">
          <tbody>
            {soru.tablo.map((satir, i) => (
              <tr key={i}>
                {satir.map((h, j) =>
                  i === 0 ? <th key={j}>{h}</th> : <td key={j}>{h}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="opts">
        {soru.secenekler.map((s) => {
          let sinif = "opt";
          if (geriBildirim) {
            if (s.id === soru.dogru) sinif += " ok";
            else if (s.id === secim) sinif += " no";
          } else if (s.id === secim) sinif += " sel";
          return (
            <button
              key={s.id}
              type="button"
              className={sinif}
              onClick={() => onSec?.(s.id)}
              disabled={!onSec}
            >
              <span className="letter">{s.id}</span>
              <span>{s.text}</span>
            </button>
          );
        })}
      </div>

      {geriBildirim && !gizli && (soru.cozum || !secim) && (
        <div className="cozum">
          {soru.cozum ? (
            <>
              <strong>Çözüm:</strong>{" "}
              <span dangerouslySetInnerHTML={{ __html: soru.cozum }} />
            </>
          ) : (
            <span className="muted">
              Bu soru için çözüm metni henüz eklenmemiş. Doğru cevap yeşil
              çerçeveyle gösterildi.
            </span>
          )}
          {!secim && <div style={{ marginTop: 8 }}>Bu soruyu boş bıraktın.</div>}
        </div>
      )}
    </div>
  );
}
