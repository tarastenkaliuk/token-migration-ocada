import type { Metadata } from "next";
import Head from "next/head";
import Announcement from "@/components/announcement";
import Header from "@/components/header";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/provider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Bird Token Migration",
  description: "Migrate token from bird to ocada",
};

const Gabarito = localFont({
  src: [
    {
      path: "../public/fonts/Gabarito-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Gabarito-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Gabarito-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-gabarito",
});

const Rethink_Sans = localFont({
  src: [
    {
      path: "../public/fonts/RethinkSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/RethinkSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-rethink_sans",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${Gabarito.variable} ${Rethink_Sans.variable} ${GeistSans.variable} ${GeistMono.variable} flex min-h-screen overflow-hidden min-w-full bg-[#fff8e5]`}
      >
        <Providers
          attribute="classname"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Announcement />
          <Header />
          <main className="min-w-full min-h-full">{children}</main>
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
