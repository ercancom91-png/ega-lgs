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

const MADDE_RE = /^(?:[•●▪▸–-]|(?:I|II|III|IV|V|VI)\.|(?:\(I\)|\(II\)|\(III\)|\(IV\))|\d{1,2}\.\s*Adım\s*:|\d{1,2}\.\s+[A-ZÇĞİÖŞÜ])\s*/;

const KOK_BAS_RE = /^(?:Buna göre|Bu bilgilere göre|Verilen bilgilere göre|Yukarıdaki bilgilere göre|Bu metne göre|Bu parçaya göre|Bu açıklamaya göre|Bu ifadeye göre|Bu metinden|Bu parçadan|Bu metinde|Bu görsele göre|Görsele göre|Bu grafiğe göre|Grafiğe göre|Bu tabloya göre|Tabloya göre|Tablodaki bilgilere göre|Tabloda ücretleri|Bu haritaya göre|Haritaya göre|Şekildeki|Bu deneyde|Bu deneye göre|Bu programa göre|Bu kurada|Bu uyarıların|Bu düşünceyi|Yukarıdakilerden hangisi|Yukarıdakilerden hangileri|Aşağıdakilerden hangisi|Aşağıdakilerden hangileri|Numaralanmış|According to|Which of the following)/i;

const UST_GORSEL_RE = /^(?:Yukarıda|Yukarıdaki|Şekilde|Şekildeki|Görselde|Görseldeki|Verilen şekil|Verilen görsel)/i;

function baseUrl(yol?: string): string | undefined {
  if (!yol) return undefined;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (base && yol.startsWith("/") && !yol.startsWith(base + "/")) {
    return `${base}${yol}`;
  }
  return yol;
}

/**
 * Soru metnini paragraflara, alt alta maddelere ve soru cümlesine (stem) ayırır.
 */
function parcalaMetin(metin: string) {
  const hamBloklar = metin
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  // Eğer tek blok varsa ama içinde \n ile ayrılmış maddeler ve sonda soru kökü varsa ayrıştır
  const satirlar = metin
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  let giris: string[] = [];
  let maddeler: string[] = [];
  let kok: string | null = null;

  if (satirlar.length > 1) {
    const sonSatir = satirlar[satirlar.length - 1];
    const kalanlar =
      KOK_BAS_RE.test(sonSatir) || sonSatir.endsWith("?")
        ? satirlar.slice(0, -1)
        : satirlar;
    if (KOK_BAS_RE.test(sonSatir) || sonSatir.endsWith("?")) {
      kok = sonSatir;
    }

    for (const s of kalanlar) {
      if (MADDE_RE.test(s)) {
        maddeler.push(s);
      } else if (maddeler.length > 0 && !s.endsWith(":")) {
        // Maddelerden sonra gelen ara açıklama veya öncül devamı
        maddeler.push(s);
      } else {
        giris.push(s);
      }
    }
  } else if (hamBloklar.length === 1) {
    // Tek satır içinde birden fazla cümle varsa ve son cümle soru kökü ise ayır
    const tek = hamBloklar[0];
    const m = tek.match(
      /^(.*?\.)\s+((?:Buna göre|Bu bilgilere göre|Bu metne göre|Bu parçaya göre|Bu açıklamaya göre|Grafiğe göre|Tabloya göre|Görsele göre|Yukarıdakilerden hangisi|Aşağıdakilerden hangisi|According to|Which of the following)[^?]+\?)$/i
    );
    if (m && m[1].length > 20) {
      giris = [m[1].trim()];
      kok = m[2].trim();
    } else {
      giris = [tek];
    }
  }

  return { giris, maddeler, kok };
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
  const { giris, maddeler, kok } = parcalaMetin(soru.metin);
  const gorselSrc = baseUrl(soru.gorselUrl);
  const secGorselSrc = baseUrl(soru.secenekGorselUrl);
  const ilkMetin = giris[0] || kok || soru.metin;
  const gorselUstte = UST_GORSEL_RE.test(ilkMetin) || (giris.length === 0 && maddeler.length === 0);

  const gorselKutusu = (
    <>
      {gorselSrc && (
        <div className="q-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gorselSrc}
            alt={`${DERS_ADI[soru.ders]} — ${soru.konu} soru görseli`}
            loading="lazy"
          />
        </div>
      )}
      {soru.sekil && <Sekil name={soru.sekil} />}
      {soru.tablo && (
        <div className="q-table-wrap">
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
        </div>
      )}
    </>
  );

  const gorselSecenekModu =
    Boolean(secGorselSrc) ||
    soru.secenekler.every((s) => s.text.trim() === "[görsel]");

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
          {soru.yil ? `${soru.yil} LGS` : soru.kaynak.toUpperCase()}
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

      {gorselUstte && gorselKutusu}

      <div className="q-text">
        {giris.map((p, idx) => (
          <p key={idx} className="q-para" dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        {maddeler.length > 0 && (
          <div className="q-maddeler" role="list">
            {maddeler.map((m, idx) => (
              <div
                key={idx}
                className="q-madde-satir"
                role="listitem"
                dangerouslySetInnerHTML={{ __html: m }}
              />
            ))}
          </div>
        )}

        {!gorselUstte && gorselKutusu}

        {kok && (
          <p
            className="q-stem"
            dangerouslySetInnerHTML={{ __html: kok }}
          />
        )}
      </div>

      {secGorselSrc && (
        <div className="q-figure q-sec-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secGorselSrc}
            alt="Seçenek görselleri (A, B, C, D)"
            loading="lazy"
          />
        </div>
      )}

      <div className={`opts ${gorselSecenekModu ? "opts-grid-4" : ""}`}>
        {soru.secenekler.map((s) => {
          let sinif = "opt";
          if (geriBildirim) {
            if (s.id === soru.dogru) sinif += " ok";
            else if (s.id === secim) sinif += " no";
          } else if (s.id === secim) sinif += " sel";
          const etiket =
            s.text.trim() === "[görsel]"
              ? `${s.id} Seçeneği`
              : s.text;
          return (
            <button
              key={s.id}
              type="button"
              className={sinif}
              onClick={() => onSec?.(s.id)}
              disabled={!onSec}
            >
              <span className="letter">{s.id}</span>
              <span>{etiket}</span>
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
              Doğru cevap <strong>{soru.dogru}</strong> seçeneğidir (yeşil çerçeveyle
              işaretlendi).
            </span>
          )}
          {!secim && <div style={{ marginTop: 8 }}>Bu soruyu boş bıraktın.</div>}
        </div>
      )}
    </div>
  );
}
