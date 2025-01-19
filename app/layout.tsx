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
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
