import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/shared/SmoothScrolling";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "STORM BARZ | Premium Calisthenics Equipment",
  description: "Become the Storm. Premium parallettes built for control, power, and clean movement. Luxury calisthenics equipment.",
  icons: [
    { rel: "icon", url: "/lightning.png" },
    { rel: "apple-touch-icon", url: "/lightning.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-storm-dark text-foreground min-h-screen flex flex-col`}
      >
        <SmoothScrolling>
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
