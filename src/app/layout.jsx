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
    icon: "/favicon.svg",
  },
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
