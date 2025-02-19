import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/providers/UserProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ICI Services Portal",
  description:
    "Explore the Innamaadhoo Council Services Portal – your gateway to seamless service requests, registrations, and updates for community development and sustainability. Join us in building a cleaner, more connected, and vibrant Innamaadhoo.",
  keywords: [
    "Innamaadhoo",
    "Council Services",
    "Maldives",
    "Community Development",
    "Waste Management",
    "Registrations",
    "Local Government",
    "ICI Services",
    "Sustainability",
    "Public Services",
  ],
  authors: [{ name: "Innamaadhoo Council" }],
  openGraph: {
    title: "ICI Services Portal",
    description:
      "Your gateway to seamless service requests, registrations, and community updates in Innamaadhoo.",
    url: "https://services.ici.gov.mv",
    type: "website",
    images: [
      {
        url: "/assets/images/seo_image.png",
        width: 1200,
        height: 630,
        alt: "Waste Management Banner",
      },
    ],
    locale: "dv_MV",
    siteName: "ICI Services Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "ICI Services Portal",
    description:
      "Your gateway to seamless service requests, registrations, and community updates in Innamaadhoo.",
    images: "/assets/images/seo_image.png",
  },
  metadataBase: new URL("https://services.ici.gov.mv"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      dv: "/dv",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <Header />
          {children}
          <div className="font-dhivehi">
            <Toaster />
          </div>
        </UserProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
