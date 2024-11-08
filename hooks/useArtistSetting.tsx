import getIpfsLink from "@/lib/ipfs/getIpfsLink";
import { uploadFile } from "@/lib/ipfs/uploadToIpfs";
import { useParams } from "next/navigation";
import { useChatProvider } from "@/providers/ChatProvider";
import { useRef, useState } from "react";
import { ArtistRecord } from "@/types/Artist";
import { v4 as uuidV4 } from "uuid";

const useArtistSetting = () => {
  const { finalCallback } = useChatProvider();
  const { conversation: conversationId } = useParams();
  const imageRef = useRef() as any;
  const baseRef = useRef() as any;
  const [image, setImage] = useState("");
  const [instruction, setInstruction] = useState("");
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [appleUrl, setAppleUrl] = useState("");
  const [tiktok, setTikTok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [twitter, setTwitter] = useState("");
  const [bases, setBases] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [question, setQuestion] = useState("");

  const handleImageSelected = async (e: any) => {
    setImageUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setImageUploading(false);
      return;
    }
    if (file) {
      const { uri } = await uploadFile(file);
      setImage(getIpfsLink(uri));
    }
    setImageUploading(false);
  };

  const updateCallback = (artistInfo: ArtistRecord) => {
    finalCallback(
      {
        role: "assistant",
        id: uuidV4(),
        content: `Artist Information: Name - ${artistInfo.name} Image - ${artistInfo.image}`,
      },
      { id: uuidV4(), content: question, role: "user" },
      conversationId as string,
    );
  };

  const clearParams = () => {
    setName("");
    setImage("");
    setInstruction("");
    setInstagram("");
    setLabel("");
    setSpotifyUrl("");
    setAppleUrl("");
    setTikTok("");
    setYoutube("");
    setTwitter("");
    setBases("");
  };

  return {
    handleImageSelected,
    image,
    setImage,
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
    bases,
    setBases,
    imageRef,
    baseRef,
    imageUploading,
    question,
    setQuestion,
    updateCallback,
    clearParams,
  };
};

export default useArtistSetting;
