import { Youtube } from "lucide-react";
import { youtubeLogin } from "@/lib/youtube/youtubeLogin";
import { Button } from "@/components/ui/button";

interface ConnectYouTubeButtonProps {
  accountId?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const sizeMap: Record<"sm" | "md" | "lg", "sm" | "lg" | "default"> = {
  sm: "sm",
  md: "default",
  lg: "lg",
};

export const ConnectYouTubeButton = ({
  accountId,
  className = "",
  size = "md",
  disabled = false,
}: ConnectYouTubeButtonProps) => (
  <Button
    onClick={() => youtubeLogin(accountId)}
    className={`bg-red-600 hover:bg-red-700 text-white flex items-center justify-center ${className}`}
    size={sizeMap[size]}
    disabled={disabled || !accountId}
  >
    <Youtube className="h-4 w-4 mr-2" />
    Connect YouTube Account
  </Button>
);