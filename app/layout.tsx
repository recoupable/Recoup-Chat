import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/providers/Providers";
import { META_DESCRIPTION, TITLE } from "@/lib/consts";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Suspense } from "react";
import ArtistSettingModal from "@/components/ArtistSettingModal";
import MobileDownloadModal from "@/components/ModalDownloadModal";
import ArtistsSidebar from "@/components/Artists/ArtistsSidebar";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: META_DESCRIPTION,
    images: `/logo.png`,
  },
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/recoup.png" }],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
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
              <div className="grow flex h-[calc(100vh-56px)] md:h-screen overflow-hidden md:bg-grey-light-3">
                <div className="size-full py-4 pl-4">
                  <div className="size-full bg-white overflow-y-auto md:rounded-xl flex flex-col md:shadow-[0px_0px_7px_0px_#80808063]">
                    {children}
                  </div>
                </div>
                <ArtistsSidebar />
              </div>
              <MobileDownloadModal />
            </div>
            <ToastContainer />
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
