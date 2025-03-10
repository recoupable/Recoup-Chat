import { SUGGESTIONS } from "@/lib/consts";
import { Message } from "ai";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useFunnelReportProvider } from "@/providers/FunnelReportProvider";

const usePrompts = () => {
  const { selectedArtist, artists, setSelectedArtist, isLoading } =
    useArtistProvider();
  const [prompts, setPrompts] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Message | null>(null);
  const pathname = usePathname();
  const { funnelRawReportContent } = useFunnelReportProvider();
  const isNewChat = pathname.includes("/new");

  useEffect(() => {
    if (isLoading) return;
    
    // If we have a selected artist and we're on the new chat page, set relevant prompts
    if (selectedArtist && isNewChat) {
      setPrompts([
        `Who are ${selectedArtist?.name || ""}'s most engaged fans?`,
        `Analyze ${selectedArtist?.name || ""}'s TikTok posts from this week.`,
        `What content performs best for ${selectedArtist?.name || ""}?`,
        `How can ${selectedArtist?.name || ""} grow their audience?`,
      ]);
      return;
    }
    
    // Only select the first artist if there's truly no artist selected
    // AND there's no artist saved in localStorage
    if (artists.length && !selectedArtist && !localStorage.getItem("RECOUP_ARTIST")) {
      console.log("No artist selected, selecting first artist as fallback");
      setSelectedArtist(artists[0]);
      return;
    }
    
    // Default prompts if no conditions above are met
    setPrompts(SUGGESTIONS);
  }, [selectedArtist, isNewChat, artists, isLoading, setSelectedArtist]);

  const getPrompts = async (content: string, isTikTokAnalysis?: boolean) => {
    const isFunnelReport = content === "Funnel Report";
    const isAnalaysis = pathname.includes("funnels/");
    if (isFunnelReport) content = JSON.stringify(funnelRawReportContent);

    if (!content) return;
    let promptApiUrl = "/api/prompts";
    if (isFunnelReport) promptApiUrl = "/api/prompts/funnel_report";
    if (isTikTokAnalysis || isAnalaysis)
      promptApiUrl = "/api/prompts/funnel_analysis";

    const response = await fetch(promptApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: content,
      }),
    });
    const data = await response.json();
    if (!data?.questions) return;
    setPrompts(() => [...data.questions]);
  };

  return {
    prompts,
    setCurrentQuestion,
    currentQuestion,
    getPrompts,
  };
};

export default usePrompts;
