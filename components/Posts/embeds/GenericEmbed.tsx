import { ExternalLink } from "lucide-react";

interface GenericEmbedProps {
  url: string;
  platform: string;
}

export const GenericEmbed = ({ url, platform }: GenericEmbedProps) => {
  const platformName =
    platform === "unknown"
      ? "Post"
      : platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className="generic-embed h-full">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors h-full"
      >
        <span className="mr-2">View {platformName}</span>
        <ExternalLink size={16} />
      </a>
    </div>
  );
};
