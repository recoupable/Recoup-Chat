import getIpfsLink from "@/lib/ipfs/getIpfsLink";
import { uploadFile } from "@/lib/ipfs/uploadToIpfs";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useEffect, useRef, useState } from "react";

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
  const [bases, setBases] = useState("");
  const { selectedArtist, getArtists } = useArtistProvider();
  const [imageUploading, setImageUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loading = imageUploading || updating;

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

  const saveSetting = async () => {
    setUpdating(true);
    const response = await fetch("/api/artist/profile", {
      method: "POST",
      body: JSON.stringify({ name, image, artistId: selectedArtist?.id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    await getArtists();
    setUpdating(false);
    return data?.artistInfo;
  };

  useEffect(() => {
    if (selectedArtist) {
      setName(selectedArtist.name || "");
      setImage(selectedArtist.image || "");
    }
  }, [selectedArtist]);

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
    saveSetting,
    loading,
    imageUploading,
    updating,
  };
};

export default useArtistSetting;
