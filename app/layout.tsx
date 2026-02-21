import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Viewport: Mobile optimization ke liye
export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Metadata: Favicon aur PWA icons yahan define honge
export const metadata: Metadata = {
  title: "Bird Farm Pro",
  description: "Invest and Grow your Bird Farm",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico", // Browser tab ke liye
    shortcut: "/favicon.ico",
    apple: "/icons/icon-192x192.png", // iPhone home screen ke liye
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bird Farm Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased !bg-[#020617] text-white`}
      >
        {children}
        {/* PWA mobile behavior ke liye extra tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </body>
    </html>
  );
}