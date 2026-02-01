import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/providers/UserProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-geist antialiased">
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
