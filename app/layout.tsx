import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const playfair = localFont({
  variable: "--font-playfair",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/playfair_display/PlayfairDisplay-Variable.ttf",
      style: "normal",
    },
    {
      path: "../assets/fonts/playfair_display/PlayfairDisplay-Italic-Variable.ttf",
      style: "italic",
    },
  ],
});

const playwrite = localFont({
  variable: "--font-playwrite",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/playwrite_vn/PlaywriteVN-Variable.ttf",
      style: "normal",
    },
  ],
});

const publicSans = localFont({
  variable: "--font-public-sans",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/public-sans/PublicSans-Variable.ttf",
      style: "normal",
    },
    {
      path: "../assets/fonts/public-sans/PublicSans-Italic-Variable.ttf",
      style: "italic",
    },
  ],
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Grace Teaches";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Bible Teaching for Everyday Faith`,
    template: `%s — ${siteName}`,
  },
  description:
    "Grace Teaches is a Bible-based ministry blog and podcast helping everyday believers grow in faith through Scripture, teaching, and honest conversation.",
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Bible Teaching for Everyday Faith`,
    description:
      "Grace Teaches is a Bible-based ministry blog and podcast helping everyday believers grow in faith through Scripture, teaching, and honest conversation.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${publicSans.variable} ${playwrite.variable} antialiased`}>
      <body className="relative min-h-screen bg-paper text-ink">
        <div className="paper-grain" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
