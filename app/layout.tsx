import type { Metadata, Viewport } from "next";
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
import ArtistSelectionOverlay from "@/components/ArtistSelectionOverlay";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: TITLE,
    description: META_DESCRIPTION,
    other: {
      "fc:frame": JSON.stringify({
        version: process.env.NEXT_PUBLIC_VERSION,
        imageUrl: process.env.NEXT_PUBLIC_IMAGE_URL,
        button: {
          title: `Launch ${TITLE}`,
          action: {
            type: "launch_frame",
            name: TITLE,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE_URL,
            splashBackgroundColor: `#${process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR}`,
          },
        },
      }),
    },
    openGraph: {
      title: TITLE,
      description: META_DESCRIPTION,
      images: "/logo.png",
    },
    manifest: "/manifest.json",
    icons: [{ rel: "icon", url: "/recoup.png" }],
    viewport:
      "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
    themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  };
}

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
              <div className="grow flex h-[100dvh] pt-16 md:pt-0 md:h-screen overflow-hidden md:bg-grey-light-3">
                <div className="size-full md:py-4 md:pl-4">
                  <div className="size-full bg-white overflow-y-auto md:rounded-xl flex flex-col md:shadow-[0px_0px_7px_0px_#80808063]">
                    {children}
                  </div>
                </div>
                <ArtistsSidebar />
              </div>
              <MobileDownloadModal />
            </div>
            <ArtistSelectionOverlay />
            <ToastContainer />
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
