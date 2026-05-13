import { Outfit, Ovo } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outFit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ovo = Ovo({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Kunal's Portfolio",
  description:
    "Portfolio of Kunal Pandey, an AI/ML developer and data engineer building GenAI apps, ML pipelines, and cloud-deployed projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outFit.className} ${ovo.className} antialiased leading-8 overflow-x-hidden dark:bg-darkTheme dark:text-white`}
      >
        {children}
        <Analytics />

        <SpeedInsights />
      </body>
    </html>
  );
}
