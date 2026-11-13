import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil · EGA",
};

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
