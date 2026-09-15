import type { Metadata, Viewport } from "next"
import { Sora, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
})
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Workforce Attrition Intelligence — HR Analytics & Risk Modeling",
  description:
    "An interactive HR analytics platform that turns 5,513 employee records into workforce insights, attrition-rate breakdowns, and live logistic-regression risk predictions — all running client-side.",
  keywords: [
    "HR analytics",
    "employee attrition",
    "workforce intelligence",
    "attrition prediction",
    "people analytics",
    "logistic regression",
  ],
  authors: [{ name: "Workforce Attrition Intelligence" }],
  openGraph: {
    title: "Workforce Attrition Intelligence",
    description:
      "Interactive HR analytics and attrition risk modeling built from real employee data.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0F1C",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
