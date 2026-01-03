import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#030806",
};

export const metadata: Metadata = {
  title: "AkshayaVault - Self-Sovereign Financial Identity",
  description:
    "Non-custodial Self-Sovereign Financial Identity platform using Zero-Knowledge Proofs for privacy-preserving verification.",
  keywords: ["ZK Proofs", "Zero Knowledge", "Identity Verification", "Privacy", "Blockchain", "Aadhaar", "Financial Identity"],
  authors: [{ name: "AkshayaVault Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "AkshayaVault - Self-Sovereign Financial Identity",
    description: "Privacy-preserving identity verification using Zero-Knowledge Proofs",
    type: "website",
    siteName: "AkshayaVault",
  },
  twitter: {
    card: "summary_large_image",
    title: "AkshayaVault - Self-Sovereign Financial Identity",
    description: "Privacy-preserving identity verification using Zero-Knowledge Proofs",
  },
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
