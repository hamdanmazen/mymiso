import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mymiso — Sell Fast. Shop Better.",
    template: "%s | Mymiso",
  },
  description:
    "Multi-vendor marketplace. Discover products from thousands of sellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.classList.add(t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-canvas text-text-primary font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
