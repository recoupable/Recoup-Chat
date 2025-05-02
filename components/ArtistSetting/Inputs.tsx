import { useArtistProvider } from "@/providers/ArtistProvider";
import Input from "../Input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const Inputs = () => {
  const {
    instruction,
    setInstruction,
    name,
    setName,
    label,
    setLabel,
    spotifyUrl,
    setSpotifyUrl,
    appleUrl,
    setAppleUrl,
    tiktok,
    setTikTok,
    instagram,
    setInstagram,
    youtube,
    setYoutube,
    twitter,
    setTwitter,
  } = useArtistProvider();
  return (
    <>
      <div className="col-span-8 space-y-1 md:space-y-2">
        <Label htmlFor="instruction">Custom Instructions</Label>
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          id="instruction"
          name="instruction"
          placeholder="Instructions added directly to the AI system prompt. Use for artist-specific tone, style guidance, or special responses."
          rows={4}
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Artist Name"
          id="name"
          name="name"
          required
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          label="Artist Label"
          id="label"
          name="label"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          label="Spotify URL"
          id="spotifyUrl"
          name="spotifyUrl"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={appleUrl}
          onChange={(e) => setAppleUrl(e.target.value)}
          label="Apple URL"
          id="appleUrl"
          name="appleUrl"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={tiktok}
          onChange={(e) => setTikTok(e.target.value)}
          label="TikTok"
          id="tiktok"
          name="tiktok"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          label="Instagram"
          id="instagram"
          name="instagram"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          label="YouTube"
          id="youtube"
          name="youtube"
          hookToForm
        />
      </div>
      <div className="col-span-6 space-y-1 md:space-y-2">
        <Input
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          label="X"
          id="twitter"
          name="twitter"
          hookToForm
        />
      </div>
    </>
  );
};

export default Inputs;
