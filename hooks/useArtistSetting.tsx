import { uploadFile } from "@/lib/arweave/uploadToArweave";
import { useEffect, useRef, useState } from "react";
import { ArtistRecord } from "@/types/Artist";

const useArtistSetting = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<HTMLInputElement>(null);
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
  const [bases, setBases] = useState<
    Array<{ name: string; url: string; type: string }>
  >([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [knowledgeUploading, setKnowledgeUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [editableArtist, setEditableArtist] = useState<ArtistRecord | null>(
    null
  );

  const handleDeleteKnowledge = (index: number) => {
    let temp = [...bases];
    if (temp.length === 1) {
      setBases([]);
      return;
    }
    temp = temp.splice(index, 1);
    setBases([...temp]);
  };

  const handleImageSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImageUploading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setImageUploading(false);
      return;
    }
    try {
      const { uri } = await uploadFile(file);
      setImage(uri);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
    setImageUploading(false);
  };

  const handleKnowledgesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKnowledgeUploading(true);
    const files = e.target.files;
    const temp = [];
    try {
      if (files) {
        for (const file of files) {
          const name = file.name;
          const type = file.type;
          const { uri } = await uploadFile(file);
          temp.push({
            name,
            url: uri,
            type,
          });
        }
      }
      setBases(temp);
    } catch (error) {
      console.error("Failed to upload knowledge files:", error);
    }
    setKnowledgeUploading(false);
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
    setBases([]);
    setEditableArtist(null);
  };

  useEffect(() => {
    if (editableArtist) {
      setName(editableArtist?.name || "");
      setImage(editableArtist?.image || "");
      setLabel(editableArtist?.label || "");
      setInstruction(editableArtist?.instruction || "");
      setBases(editableArtist?.knowledges || []);
      const socialMediaTypes = {
        TWITTER: setTwitter,
        YOUTUBE: setYoutube,
        APPLE: setAppleUrl,
        INSTAGRAM: setInstagram,
        SPOTIFY: setSpotifyUrl,
        TIKTOK: setTikTok,
      };
      Object.entries(socialMediaTypes).forEach(([type, setter]) => {
        const link = editableArtist?.account_socials?.find(
          (item) => item.type === type
        )?.link;
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
    bases,
    setBases,
    imageRef,
    baseRef,
    imageUploading,
    question,
    setQuestion,
    clearParams,
    knowledgeUploading,
    handleDeleteKnowledge,
    editableArtist,
    setEditableArtist,
  };
};

export default useArtistSetting;
