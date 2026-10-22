import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useArtistImage from "@/hooks/useArtistImage";

interface TaskArtistImageProps {
  artistAccountId?: string | null;
}

const TaskArtistImage: React.FC<TaskArtistImageProps> = ({
  artistAccountId,
}) => {
  const { imageUrl, artistName } = useArtistImage(artistAccountId);

  return (
    <Avatar className="items-center justify-center bg-muted">
      <AvatarImage
        src={imageUrl ?? undefined}
        alt={artistName ?? "Artist avatar"}
        className="object-cover"
      />
      <AvatarFallback role="img" aria-label={artistName ?? "Artist avatar"}>
        <Clock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </AvatarFallback>
    </Avatar>
  );
};

export default TaskArtistImage;
