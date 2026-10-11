import React from "react";

const S = {
  bg: "#0a0c13",
  line: "#8d95ab",
  strong: "#e9ebf3",
  red: "#ff2d55",
  blue: "#2f6bff",
  amber: "#f59e0b",
};

function Frame({ children, h = 190 }: { children: React.ReactNode; h?: number }) {
  return (
    <svg
      viewBox="0 0 320 190"
      width="100%"
      style={{ maxWidth: 420, height: "auto", display: "block" }}
      role="img"
    >
      <rect width="320" height="190" fill={S.bg} />
      {children}
    </svg>
  );
}

const T = (x: number, y: number, t: string, size = 13, fill = S.strong, anchor: "start" | "middle" | "end" = "middle", weight = 600) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    fill={fill}
    textAnchor={anchor}
    fontFamily="Inter, sans-serif"
    fontWeight={weight}
  >
    {t}
  </text>
);

const FIGURES: Record<string, React.ReactNode> = {
  "dikdortgen-kesim": (
    <Frame>
      <rect x="46" y="40" width="228" height="110" fill="none" stroke={S.strong} strokeWidth="2" />
      <line x1="110" y1="40" x2="110" y2="150" stroke={S.red} strokeWidth="2" strokeDasharray="6 4" />
      <line x1="196" y1="40" x2="196" y2="150" stroke={S.red} strokeWidth="2" strokeDasharray="6 4" />
      {T(78, 30, "I")}
      {T(153, 30, "II")}
      {T(225, 30, "III")}
      {T(160, 172, "8 cm", 13, S.line)}
    </Frame>
  ),
  "ucgen-abc": (
    <Frame>
      <polygon points="160,32 46,152 274,152" fill="none" stroke={S.strong} strokeWidth="2" />
      {T(160, 24, "A")}
      {T(34, 166, "B")}
      {T(286, 166, "C")}
      {T(120, 96, "8", 13, S.red)}
      {T(196, 96, "6", 13, S.red)}
      {T(160, 168, "10", 13, S.blue)}
    </Frame>
  ),
  "daire-dilim": (
    <Frame>
      <circle cx="120" cy="95" r="62" fill="none" stroke={S.strong} strokeWidth="2" />
      <path d="M120 95 L120 33 A62 62 0 0 1 178 76 Z" fill="rgba(255,45,85,.35)" stroke={S.red} strokeWidth="2" />
      <line x1="120" y1="95" x2="120" y2="33" stroke={S.strong} strokeWidth="2" />
      <line x1="120" y1="95" x2="178" y2="76" stroke={S.strong} strokeWidth="2" />
      {T(120, 90, "O")}
      {T(232, 60, "90°", 14, S.red, "start")}
      {T(232, 84, "%25", 14, S.line, "start")}
    </Frame>
  ),
  "cizgi-grafik": (
    <Frame>
      {[20, 40, 60, 80, 100].map((v) => (
        <g key={v}>
          <line x1="46" y1={150 - v * 1.2} x2="286" y2={150 - v * 1.2} stroke={S.line} strokeWidth="0.7" opacity="0.45" />
          {T(38, 154 - v * 1.2, String(v), 10, S.line, "end", 500)}
        </g>
      ))}
      <line x1="46" y1="150" x2="286" y2="150" stroke={S.line} strokeWidth="1.5" />
      <line x1="46" y1="150" x2="46" y2="30" stroke={S.line} strokeWidth="1.5" />
      <polyline points="70,126 118,90 166,102 214,54 262,30" fill="none" stroke={S.blue} strokeWidth="2.5" />
      {[
        [70, 126],
        [118, 90],
        [166, 102],
        [214, 54],
        [262, 30],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={S.red} />
      ))}
      {T(70, 168, "Pzt", 11, S.line)}
      {T(118, 168, "Sal", 11, S.line)}
      {T(166, 168, "Çar", 11, S.line)}
      {T(214, 168, "Per", 11, S.line)}
      {T(262, 168, "Cum", 11, S.line)}
    </Frame>
  ),
  "sutun-grafik": (
    <Frame>
      {[10, 20, 30, 40, 50].map((v) => (
        <g key={v}>
          <line x1="52" y1={152 - v * 2} x2="288" y2={152 - v * 2} stroke={S.line} strokeWidth="0.7" opacity="0.45" />
          {T(44, 156 - v * 2, String(v), 10, S.line, "end", 500)}
        </g>
      ))}
      <line x1="52" y1="152" x2="288" y2="152" stroke={S.line} strokeWidth="1.5" />
      {[
        [72, 70, S.blue, "A"],
        [130, 42, S.red, "B"],
        [188, 100, S.blue, "C"],
        [246, 58, S.red, "D"],
      ].map(([x, h, c, l], i) => (
        <g key={i}>
          <rect x={x as number} y={152 - (h as number)} width="40" height={h as number} fill={(c as string) + "66"} stroke={c as string} strokeWidth="2" rx="3" />
          {T((x as number) + 20, 170, l as string, 12, S.line)}
        </g>
      ))}
    </Frame>
  ),
  "sayi-dogrusu": (
    <Frame>
      <line x1="40" y1="95" x2="286" y2="95" stroke={S.strong} strokeWidth="2" />
      <polygon points="286,95 276,90 276,100" fill={S.strong} />
      {[60, 110, 160, 210, 260].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="88" x2={x} y2="102" stroke={S.line} strokeWidth="2" />
          {T(x, 120, String(i * 5), 12, S.line)}
        </g>
      ))}
      <circle cx="135" cy="95" r="6" fill={S.red} />
      {T(135, 74, "M", 13, S.red)}
      <circle cx="235" cy="95" r="6" fill={S.blue} />
      {T(235, 74, "N", 13, S.blue)}
    </Frame>
  ),
  "devre": (
    <Frame>
      <rect x="60" y="50" width="200" height="90" fill="none" stroke={S.strong} strokeWidth="2" />
      <g>
        <line x1="140" y1="50" x2="140" y2="38" stroke={S.strong} strokeWidth="2" />
        <line x1="156" y1="50" x2="156" y2="42" stroke={S.strong} strokeWidth="2" />
        {T(148, 32, "6 V", 12, S.red)}
      </g>
      <rect x="180" y="40" width="46" height="20" fill="rgba(47,107,255,.3)" stroke={S.blue} strokeWidth="2" rx="3" />
      {T(203, 32, "R₁", 12, S.blue)}
      <rect x="86" y="130" width="46" height="20" fill="rgba(255,45,85,.28)" stroke={S.red} strokeWidth="2" rx="3" />
      {T(109, 166, "R₂", 12, S.red)}
      {T(240, 96, "A", 13, S.line)}
      <circle cx="260" cy="95" r="11" fill="none" stroke={S.strong} strokeWidth="2" />
    </Frame>
  ),
  "kuresel": (
    <Frame>
      <circle cx="160" cy="95" r="66" fill="none" stroke={S.strong} strokeWidth="2" />
      <ellipse cx="160" cy="95" rx="30" ry="66" fill="none" stroke={S.line} strokeWidth="1.5" />
      {[55, 78, 95, 112, 135].map((y, i) => (
        <line key={i} x1="94" y1={y} x2="226" y2={y} stroke={S.line} strokeWidth="1.2" />
      ))}
      <line x1="94" y1="78" x2="226" y2="78" stroke={S.red} strokeWidth="2" strokeDasharray="5 4" />
      {T(240, 74, "30° K", 11, S.red, "start")}
      {T(240, 92, "0°", 11, S.line, "start")}
      {T(240, 110, "30° G", 11, S.line, "start")}
    </Frame>
  ),
  "simetri-eksen": (
    <Frame>
      <line x1="160" y1="24" x2="160" y2="166" stroke={S.red} strokeWidth="2" strokeDasharray="7 5" />
      <polygon points="160,40 100,90 130,150" fill="none" stroke={S.strong} strokeWidth="2" />
      <polygon points="160,40 220,90 190,150" fill="rgba(47,107,255,.18)" stroke={S.blue} strokeWidth="2" strokeDasharray="4 4" />
      {T(160, 20, "simetri ekseni", 11, S.red)}
    </Frame>
  ),
  "katman-kesit": (
    <Frame>
      <rect x="40" y="46" width="240" height="26" fill="rgba(255,45,85,.3)" stroke={S.red} strokeWidth="2" />
      <rect x="40" y="72" width="240" height="34" fill="rgba(47,107,255,.25)" stroke={S.blue} strokeWidth="2" />
      <rect x="40" y="106" width="240" height="38" fill="rgba(245,158,11,.2)" stroke={S.amber || "#f59e0b"} strokeWidth="2" />
      {T(150, 64, "Kabuk", 12)}
      {T(150, 94, "Manto", 12)}
      {T(150, 130, "Çekirdek", 12)}
    </Frame>
  ),
  "kutup-koniler": (
    <Frame>
      <polygon points="160,42 96,142 224,142" fill="rgba(47,107,255,.2)" stroke={S.blue} strokeWidth="2" />
      <ellipse cx="160" cy="42" rx="64" ry="18" fill="none" stroke={S.strong} strokeWidth="2" />
      <line x1="160" y1="42" x2="160" y2="142" stroke={S.red} strokeWidth="2" strokeDasharray="6 4" />
      {T(160, 30, "ışık", 11, S.red)}
      {T(250, 92, "gölge konisi", 11, S.line, "start")}
    </Frame>
  ),
  "hareket-grafik": (
    <Frame>
      <line x1="46" y1="150" x2="288" y2="150" stroke={S.line} strokeWidth="1.5" />
      <line x1="46" y1="150" x2="46" y2="30" stroke={S.line} strokeWidth="1.5" />
      <polyline points="46,150 96,150 96,96 166,96 166,48 262,48" fill="none" stroke={S.red} strokeWidth="2.5" />
      {T(288, 168, "t (dk)", 11, S.line, "end")}
      {T(30, 40, "x (km)", 11, S.line, "end")}
      {T(120, 88, "durdu", 11, S.line)}
      {T(214, 40, "durdu", 11, S.line)}
    </Frame>
  ),
  "yuzde-grafik": (
    <Frame>
      <rect x="46" y="40" width="228" height="110" fill="none" stroke={S.strong} strokeWidth="2" />
      <rect x="46" y="40" width="91" height="110" fill="rgba(255,45,85,.28)" />
      <rect x="137" y="40" width="68" height="110" fill="rgba(47,107,255,.28)" />
      <line x1="137" y1="40" x2="137" y2="150" stroke={S.strong} strokeWidth="1.5" />
      <line x1="205" y1="40" x2="205" y2="150" stroke={S.strong} strokeWidth="1.5" />
      {T(92, 102, "%40", 14)}
      {T(171, 102, "%30", 14)}
      {T(244, 102, "%30", 14)}
      {T(160, 172, "bir sınıftaki 30 öğrencinin dağılımı", 11, S.line)}
    </Frame>
  ),
  "agirlik-cizelge": (
    <Frame>
      <rect x="40" y="46" width="240" height="100" fill="none" stroke={S.strong} strokeWidth="2" />
      <line x1="160" y1="46" x2="160" y2="146" stroke={S.strong} strokeWidth="1.5" />
      <line x1="40" y1="96" x2="280" y2="96" stroke={S.strong} strokeWidth="1.5" />
      {T(100, 80, "2 kg", 13)}
      {T(220, 80, "3 kg", 13)}
      {T(100, 128, "x kg", 13, S.red)}
      {T(220, 128, "1 kg", 13)}
      {T(160, 34, "terazi dengede", 11, S.line)}
    </Frame>
  ),
  "dna": (
    <Frame>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <line x1={70 + i * 8} y1={40 + i * 20} x2={210 - i * 8} y2={40 + i * 20} stroke={S.line} strokeWidth="2" />
          <circle cx={70 + i * 8} cy={40 + i * 20} r="5" fill={S.red} />
          <circle cx={210 - i * 8} cy={40 + i * 20} r="5" fill={S.blue} />
        </g>
      ))}
      {T(240, 70, "eşleme", 11, S.line, "start")}
      {T(240, 88, "tamamlandı", 11, S.line, "start")}
      {T(240, 126, "eşleme", 11, S.red, "start")}
      {T(240, 144, "sürüyor", 11, S.red, "start")}
    </Frame>
  ),
  "hucre": (
    <Frame>
      <circle cx="160" cy="95" r="66" fill="rgba(47,107,255,.12)" stroke={S.strong} strokeWidth="2" />
      <circle cx="150" cy="90" r="24" fill="rgba(255,45,85,.25)" stroke={S.red} strokeWidth="2" />
      <rect x="196" y="112" width="26" height="14" rx="7" fill="none" stroke={S.line} strokeWidth="2" />
      <rect x="104" y="122" width="26" height="14" rx="7" fill="none" stroke={S.line} strokeWidth="2" />
      {T(150, 95, " çekirdek", 11, "#ffd0da")}
      {T(160, 182, "hücre zarı · sitoplazma · çekirdek", 11, S.line)}
    </Frame>
  ),
  "bitki-bicim": (
    <Frame>
      {[
        [60, 130, "I"],
        [140, 130, "II"],
        [220, 130, "III"],
      ].map(([x, y, l], i) => (
        <g key={i}>
          <rect x={x as number} y={y as number} width="46" height="30" fill="rgba(34,197,94,.18)" stroke="#22c55e" strokeWidth="2" />
          {T((x as number) + 23, 178, l as string, 12, S.line)}
        </g>
      ))}
      <line x1="83" y1="130" x2="83" y2="60" stroke="#22c55e" strokeWidth="2" />
      <line x1="163" y1="130" x2="163" y2="40" stroke="#22c55e" strokeWidth="2" />
      <line x1="243" y1="130" x2="243" y2="86" stroke="#22c55e" strokeWidth="2" />
      {T(83, 50, "12 cm", 11, S.line)}
      {T(163, 30, "22 cm", 11, S.line)}
      {T(243, 76, "18 cm", 11, S.line)}
      {T(160, 22, "aynı ortamda yetişen bitkiler", 11, S.line)}
    </Frame>
  ),
  "harita-sinir": (
    <Frame>
      <polygon points="60,60 130,44 200,66 250,110 190,150 100,140 56,104" fill="rgba(47,107,255,.16)" stroke={S.strong} strokeWidth="2" />
      <line x1="150" y1="46" x2="176" y2="150" stroke={S.red} strokeWidth="2" strokeDasharray="6 4" />
      {T(110, 100, "X Ülkesi", 12)}
      {T(216, 92, "Y Ülkesi", 12)}
      {T(250, 30, "sınır", 11, S.red, "end")}
    </Frame>
  ),
};

export default function Sekil({ name }: { name: string }) {
  const node = FIGURES[name];
  if (!node) return null;
  return <div className="q-fig">{node}</div>;
}

export const SEKIL_ADLARI = Object.keys(FIGURES);
