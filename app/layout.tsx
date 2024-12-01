import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";
import { DESCRIPTION, TITLE } from "@/lib/consts";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Suspense } from "react";
import { CircleHelp } from "lucide-react";
import ArtistSettingModal from "@/components/ArtistSettingModal";

export const metadata: Metadata = {
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
      <body>
        <Suspense>
          <Providers>
            <div className="flex flex-col md:flex-row">
              <Sidebar />
              <Header />
              <ArtistSettingModal />
              {children}
              <div className="fixed right-4 bottom-4">
                <button type="button">
                  <CircleHelp />
                </button>
              </div>
            </div>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
