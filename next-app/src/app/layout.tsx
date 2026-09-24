import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import SiteChrome from "@/components/SiteChrome";

config.autoAddCss = false;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brandonsanders.org"),
  title: {
    default: "Brandon Sanders, CISSP | IT Security Leader & Manager",
    template: "%s | Brandon Sanders, CISSP",
  },
  description:
    "Portfolio of Brandon Sanders, CISSP, IT Security Leader and Cybersecurity Professional with expertise in risk management, GRC, infrastructure strategy, and compliance. Targeting IT Manager and CISO roles.",
  keywords: [
    "Brandon Sanders",
    "CISSP",
    "IT Manager",
    "CISO",
    "Cybersecurity Leader",
    "Risk Management",
    "GRC",
    "Compliance",
    "HIPAA",
    "IT Security",
    "Salina KS",
  ],
  icons: { icon: "/files/images/bs-logo.svg" },
  openGraph: {
    type: "website",
    url: "https://brandonsanders.org",
    siteName: "Brandon Sanders, CISSP",
    title: "Brandon Sanders, CISSP | IT Security Leader & Manager",
    description:
      "Portfolio of Brandon Sanders, CISSP, IT Security Leader and Cybersecurity Professional with expertise in risk management, GRC, infrastructure strategy, and compliance. Targeting IT Manager and CISO roles.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandon Sanders, CISSP | IT Security Leader & Manager",
    description:
      "Portfolio of Brandon Sanders, CISSP, IT Security Leader and Cybersecurity Professional with expertise in risk management, GRC, infrastructure strategy, and compliance. Targeting IT Manager and CISO roles.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white">
        <a
          href="#content"
          className="absolute top-2.5 left-2.5 -translate-y-[200%] focus:translate-y-0 transition-transform z-[9999] bg-white text-brand text-sm font-semibold px-3 py-2.5 rounded-[10px] shadow-lg"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
