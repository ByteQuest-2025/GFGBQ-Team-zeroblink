import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AkshayaVault - Self-Sovereign Financial Identity",
  description:
    "Non-custodial Self-Sovereign Financial Identity platform using Zero-Knowledge Proofs for privacy-preserving verification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
