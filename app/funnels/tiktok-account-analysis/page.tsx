import { Metadata } from "next";
import TikTokAccountInput from "@/components/Funnels/TikTokAccountAnalysis/Input";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "TikTok Account Analysis | Recoup",
  description: "Get instant insights about any TikTok account's performance and content",
};

export default function TikTokAccountAnalysisFunnel() {
  return (
    <div className="grow h-screen flex">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 text-center">
          <h1 className={`
            ${plusJakartaSans.className}
            text-[32px]
            sm:text-3xl 
            lg:text-[32px] 
            leading-[1.2]
            tracking-[-0.5px] 
            mb-4
            sm:mb-5
            font-semibold
            max-w-[700px]
            mx-auto
            px-2
          `}>
            Analyze Your TikTok Account in Seconds.
          </h1>
          <p className="
            text-gray-400 
            text-lg 
            sm:text-xl 
            mb-8 
            sm:mb-10 
            max-w-[600px] 
            mx-auto 
            px-6
            sm:px-2
            leading-relaxed
            sm:leading-normal
          ">
            <span className="sm:hidden">
              See what works, why it works,<br />
              and how to make it better.
            </span>
            <span className="hidden sm:block">
              See what works, why it works, and how to make it better.
            </span>
          </p>
          <TikTokAccountInput />
        </div>
      </main>
    </div>
  );
}