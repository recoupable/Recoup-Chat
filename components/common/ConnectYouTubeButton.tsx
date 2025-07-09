import { Youtube, Loader } from "lucide-react";
import { youtubeLogin } from "@/lib/youtube/youtubeLogin";
import { Button } from "@/components/ui/button";
import { useYouTubeAuth } from "@/hooks/useYouTubeAuth";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";

interface ConnectYouTubeButtonProps {
  accountId?: string;
  className?: string;
  size?: "sm" | "lg" | "default" | "icon";
  disabled?: boolean;
}

export const ConnectYouTubeButton = ({
  accountId,
  className = "",
  size = "default",
  disabled = false,
}: ConnectYouTubeButtonProps) => {
  const { selectedArtist } = useArtistProvider();
  const { userData } = useUserProvider();
  
  // Use the account ID from props, fallback to selectedArtist
  const artistAccountId = accountId || selectedArtist?.account_id;
  const userAccountId = userData?.id;
  
  const { isAuthenticated, isLoading, channelData } = useYouTubeAuth(
    artistAccountId,
    userAccountId
  );

  const isDisabled = disabled || !artistAccountId || isLoading;

  // If authenticated, show channel name
  if (isAuthenticated && channelData) {
    return (
      <Button
        onClick={() => youtubeLogin(artistAccountId)}
        className={`bg-green-600 hover:bg-green-700 text-white flex items-center justify-center ${className}`}
        size={size}
        disabled={isDisabled}
        title="Re-authenticate YouTube account"
      >
        <Youtube className="h-4 w-4 mr-2" />
        <span className="truncate">{channelData.title}</span>
      </Button>
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <Button
        className={`bg-gray-400 text-white flex items-center justify-center ${className}`}
        size={size}
        disabled={true}
      >
        <Loader className="h-4 w-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  // Default: show connect button
  return (
    <Button
      onClick={() => youtubeLogin(artistAccountId)}
      className={`bg-red-600 hover:bg-red-700 text-white flex items-center justify-center ${className}`}
      size={size}
      disabled={isDisabled}
    >
      <Youtube className="h-4 w-4 mr-2" />
      Connect YouTube Account
    </Button>
  );
};