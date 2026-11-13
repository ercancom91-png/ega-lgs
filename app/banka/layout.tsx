import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test Çöz · EGA",
};

export default function TestCozLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
