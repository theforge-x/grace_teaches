import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const chubbo = localFont({
  variable: "--font-chubbo",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/chubbo/Chubbo-Variable.ttf",
      style: "normal",
    },
    {
      path: "../assets/fonts/chubbo/Chubbo-VariableItalic.ttf",
      style: "italic",
    },
  ],
});

const zodiak = localFont({
  variable: "--font-zodiak",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/zodiak/Zodiak-Variable.ttf",
      style: "normal",
    },
    {
      path: "../assets/fonts/zodiak/Zodiak-VariableItalic.ttf",
      style: "italic",
    },
  ],
});

const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/satoshi/Satoshi-Variable.ttf",
      style: "normal",
    },
    {
      path: "../assets/fonts/satoshi/Satoshi-VariableItalic.ttf",
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcf7" },
    { media: "(prefers-color-scheme: dark)", color: "#101b17" },
  ],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${chubbo.variable} ${satoshi.variable} ${zodiak.variable} antialiased`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline bootstrap that applies the stored theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative min-h-screen bg-paper text-ink">
        <div className="paper-grain" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
