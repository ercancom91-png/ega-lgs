import { DERS_BILGI } from "@/lib/dersler";
import { DERS_ADI } from "@/lib/types";
import DersSayfa from "@/components/DersSayfa";

export function generateStaticParams() {
  return DERS_BILGI.map((d) => ({ ders: d.slug }));
}

export function generateMetadata({ params }: { params: { ders: string } }) {
  const b = DERS_BILGI.find((d) => d.slug === params.ders);
  const ad = b ? DERS_ADI[b.ders] : params.ders;
  return { title: `${ad} · Dersler · EGA` };
}

export default function DersRota({ params }: { params: { ders: string } }) {
  return <DersSayfa slug={params.ders} />;
}
