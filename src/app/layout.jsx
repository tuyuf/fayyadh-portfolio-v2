import "./globals.css";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import { icons } from "lucide-react";

const soria = localFont({
  src: "./fonts/Soria-Regular.ttf",
  variable: "--font-soria",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "interactwithf",
  description: "Simple · Thoughtful · Precise",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${soria.variable} bg-[var(--color-bg)] text-[var(--color-text)]`}
      >
        {children}
      </body>
    </html>
  );
}
