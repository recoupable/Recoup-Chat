import getIpfsLink from "@/lib/ipfs/getIpfsLink";
import { uploadFile } from "@/lib/ipfs/uploadToIpfs";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArtistRecord } from "@/types/Artist";
import { v4 as uuidV4 } from "uuid";
import { useMessagesProvider } from "@/providers/MessagesProvider";

interface KnowledgeBase {
  name: string;
  url: string;
  type: string;
}

interface IPFSResponse {
  cid: string;
  error?: string;
}

const useArtistSetting = () => {
  const { finalCallback } = useMessagesProvider();
  const { chat_id: chatId } = useParams();
  const imageRef = useRef<HTMLInputElement>(null);
  const baseRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [spotifyUrl, setSpotifyUrl] = useState<string>("");
  const [appleUrl, setAppleUrl] = useState<string>("");
  const [tiktok, setTikTok] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [bases, setBases] = useState<KnowledgeBase[]>([]);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [knowledgeUploading, setKnowledgeUploading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [editableArtist, setEditableArtist] = useState<ArtistRecord | null>(null);

  const handleDeleteKnowledge = (index: number) => {
    let temp = [...bases];
    if (temp.length === 1) {
      setBases([]);
      return;
    }
    temp = temp.splice(index, 1);
    setBases([...temp]);
  };

  const handleImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploading(true);
    try {
      const file = e.target.files?.[0];
      if (!file) {
        setImageUploading(false);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size too large. Please upload an image smaller than 10MB.');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file (PNG, JPG, etc).');
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: formData
      });

      let data: IPFSResponse;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        if (data.error?.includes('plan usage limit')) {
          throw new Error('Unable to upload image - storage limit reached. Please try again later.');
        }
        throw new Error(data.error || 'Failed to upload image');
      }

      if (!data.cid) {
        throw new Error('No image ID returned from upload');
      }

      const ipfsUrl = getIpfsLink(`ipfs://${data.cid}`);
      console.log('Setting image URL:', ipfsUrl);
      setImage(ipfsUrl);
      
      window.toast?.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      window.toast?.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleKnowledgesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setKnowledgeUploading(true);
    const files = e.target.files;
    if (!files) return;
    
    const temp: KnowledgeBase[] = [];
    for (const file of Array.from(files)) {
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

  const updateCallback = (artistInfo: ArtistRecord) => {
    finalCallback(
      {
        role: "assistant",
        id: uuidV4(),
        content: `Artist Information: Name - ${artistInfo.name} Image - ${artistInfo.image}`,
      },
      { id: uuidV4(), content: question, role: "user" },
      chatId as string,
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
    updateCallback,
    clearParams,
    knowledgeUploading,
    handleDeleteKnowledge,
    editableArtist,
    setEditableArtist,
  };
};

export default useArtistSetting;
