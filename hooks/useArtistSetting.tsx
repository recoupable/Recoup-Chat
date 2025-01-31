import getIpfsLink from "@/lib/ipfs/getIpfsLink";
import { uploadFile } from "@/lib/ipfs/uploadToIpfs";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ARTIST_INFO } from "@/types/Artist";
import { v4 as uuidV4 } from "uuid";
import { useMessagesProvider } from "@/providers/MessagesProvider";
import getSocialPlatformByLink from "@/lib/getSocialPlatformByLink";

const useArtistSetting = () => {
  const { finalCallback } = useMessagesProvider();
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
  const [knowledges, setKnowledges] = useState<any>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [knowledgeUploading, setKnowledgeUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [editableArtist, setEditableArtist] = useState<ARTIST_INFO | null>(
    null,
  );

  const handleDeleteKnowledge = (index: number) => {
    let temp = [...knowledges];
    if (temp.length === 1) {
      setKnowledges([]);
      return;
    }
    temp = temp.splice(index, 1);
    setKnowledges([...temp]);
  };
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

  const handleKnowledgesSelected = async (e: any) => {
    setKnowledgeUploading(true);
    const files = e.target.files;
    const temp = [];
    for (const file of files) {
      const name = file.name;
      const type = file.type;
      const { uri } = await uploadFile(file);
      temp.push({
        name,
        url: getIpfsLink(uri),
        type,
      });
    }
    setKnowledges(temp);
    setKnowledgeUploading(false);
  };

  const updateCallback = (artistInfo: ARTIST_INFO) => {
    finalCallback(
      {
        role: "assistant",
        id: uuidV4(),
        content: `Artist Information: Name - ${artistInfo.artist.name} Image - ${artistInfo.artist.name}`,
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
    setKnowledges([]);
    setEditableArtist(null);
  };

  useEffect(() => {
    if (editableArtist) {
      setName(editableArtist?.artist.name || "");
      setImage(editableArtist?.artist.account_info[0].image || "");
      setLabel(editableArtist?.artist.account_info[0].label || "");
      setInstruction(editableArtist?.artist.account_info[0].instruction || "");
      setKnowledges(editableArtist?.artist.account_info[0].knowledges || []);
      const socialMediaTypes = {
        TWITTER: setTwitter,
        YOUTUBE: setYoutube,
        APPLE: setAppleUrl,
        INSTAGRAM: setInstagram,
        SPOTIFY: setSpotifyUrl,
        TIKTOK: setTikTok,
      };
      Object.entries(socialMediaTypes).forEach(([type, setter]) => {
        const link = editableArtist.artist.account_socials.find((item) => {
          const socialPlatform = getSocialPlatformByLink(
            item.social.profile_url,
          );
          return type === socialPlatform;
        })?.social.profile_url;
        setter(link || "");
      });
    }
  }, [editableArtist]);

  return {
    handleImageSelected,
    handleKnowledgesSelected,
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
    knowledges,
    setKnowledges,
    imageRef,
    baseRef,
    imageUploading,
    question,
    setQuestion,
    updateCallback,
    clearParams,
    knowledgeUploading,
    handleDeleteKnowledge,
    editableArtist,
    setEditableArtist,
  };
};

export default useArtistSetting;
