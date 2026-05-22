import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

export const metadata = {
  title: "interactwithf",
  description: "Simple · Thoughtful · Precise — The creative studio of Fayyadh",
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
      <body className="bg-white text-[#051A24] font-pp-neue antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
