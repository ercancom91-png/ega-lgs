"use client";

import type { ReactNode } from "react";
import { modalAc } from "@/lib/modal";

interface Props {
  className?: string;
  children: ReactNode;
}

/** Sunucu bileşenlerinden rastgele soru modalını açan buton. */
export default function RastgeleButon({ className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => modalAc("rastgele")}
    >
      {children}
    </button>
  );
}
