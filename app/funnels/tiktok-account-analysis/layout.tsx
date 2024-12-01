import { TikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Get instant insights about any TikTok account's performance and content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grow h-screen flex">
      <TikTokAnalysisProvider>{children}</TikTokAnalysisProvider>
    </div>
  );
}
