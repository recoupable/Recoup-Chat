"use client";

import AutoPilot from "@/components/AutoPilot";
import { AutopilotProvider } from "@/providers/AutopilotProvider";
import { useFirstArtistRedirect } from "@/hooks/useFirstArtistRedirect";

const AutoPilotPage = () => {
  useFirstArtistRedirect();

  return (
    <AutopilotProvider>
      <AutoPilot />
    </AutopilotProvider>
  );
};

export default AutoPilotPage; 