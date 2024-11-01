import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Providers from "@/providers/Providers";
import { DESCRIPTION, TITLE } from "@/lib/consts";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: `/logo.jpg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Suspense>
          <Providers>
            <div className="flex flex-col md:flex-row">
              <Sidebar />
              <Header />
              {children}
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
