import getIpfsLink from "@/lib/ipfs/getIpfsLink";
import { uploadFile } from "@/lib/ipfs/uploadToIpfs";
import { useEffect, useRef, useState } from "react";
import { ArtistRecord } from "@/types/Artist";

const useArtistSetting = () => {
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
  const [bases, setBases] = useState<any>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [knowledgeUploading, setKnowledgeUploading] = useState(false);
  const [question, setQuestion] = useState("");
  const [editableArtist, setEditableArtist] = useState<ArtistRecord | null>(
    null,
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
    setBases(temp);
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
      setBases(editableArtist?.knowledges || "");
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
          (item) => item.type === type,
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
